<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use App\Models\Pesanan;
use App\Models\DetailPesanan;
use App\Models\Menu;
use App\Services\StampService;

class CheckoutController extends Controller
{
    /**
     * POST /api/checkout
     *
     * Payload contoh:
     * {
     *   "user_id": 1,             // optional
     *   "nomor_meja": 5,
     *   "catatan": "Tanpa gula",
     *   "status_pesanan": "diproses",
     *   "status_pembayaran": "belum_dibayar",
     *   "use_stamp": true,        // optional boolean
     *   "stamp_amount": 20,       // integer, kelipatan 10 jika use_stamp true
     *   "items": [
     *     { "menu_id": 1, "jumlah": 2, "harga_satuan": 15000 },
     *     { "menu_id": 2, "jumlah": 1, "harga_satuan": 30000 }
     *   ]
     * }
     */
    public function checkout(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'           => 'nullable|exists:users,id',
            'nomor_meja'        => 'required|integer',
            'catatan'           => 'nullable|string',
            'status_pesanan'    => 'required|in:diproses,diantar',
            'status_pembayaran' => 'required|in:belum_dibayar,lunas',
            'use_stamp'         => 'nullable|boolean',
            'stamp_amount'      => 'nullable|integer|min:0',
            'items'             => 'required|array|min:1',
            'items.*.menu_id'   => 'required|integer|exists:menu,id',
            'items.*.jumlah'    => 'required|integer|min:1',
            'items.*.harga_satuan' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $payload = $request->all();
        $userId = $payload['user_id'] ?? null;
        $useStamp = !empty($payload['use_stamp']);
        $stampAmount = isset($payload['stamp_amount']) ? (int)$payload['stamp_amount'] : 0;
        $items = $payload['items'];

        // Pre-check stok: pastikan semua menu punya stok mencukupi
        foreach ($items as $it) {
            $menu = Menu::find($it['menu_id']);
            if (!$menu) {
                return response()->json(['success' => false, 'message' => 'Menu tidak ditemukan: ID '.$it['menu_id']], 404);
            }
            if ($menu->stok < $it['jumlah']) {
                return response()->json([
                    'success' => false,
                    'message' => "Stok tidak cukup untuk menu {$menu->nama_menu} (tersisa {$menu->stok})"
                ], 400);
            }
        }

        try {
            DB::beginTransaction();

            // 1) Buat pesanan (sementara total_harga = 0, nanti diupdate)
            $pesanan = Pesanan::create([
                'kasir_id' => null,
                'user_id' => $userId,
                'nomor_meja' => $payload['nomor_meja'],
                'catatan' => $payload['catatan'] ?? null,
                'status_pesanan' => $payload['status_pesanan'],
                'status_pembayaran' => $payload['status_pembayaran'],
                'total_harga' => 0,
            ]);

            // 2) Buat detail dan potong stok
            $totalCalculated = 0;
            foreach ($items as $it) {
                $menu = Menu::find($it['menu_id']);
                $jumlah = (int)$it['jumlah'];
                $harga_satuan = (float)$it['harga_satuan'];
                $subtotal = $harga_satuan * $jumlah;

                $detail = DetailPesanan::create([
                    'pesanan_id' => $pesanan->id,
                    'menu_id' => $menu->id,
                    'jumlah' => $jumlah,
                    'harga_satuan' => $harga_satuan,
                    'subtotal' => $subtotal,
                    'diskon' => 0,
                    'subtotal_setelah_diskon' => $subtotal,
                ]);

                // Kurangi stok menu
                $menu->decrement('stok', $jumlah);

                $totalCalculated += $subtotal;
            }

            // 3) Simpan sementara total (sebelum redeem)
            $pesanan->total_harga = $totalCalculated;
            $pesanan->save();

            // 4) Jika user meminta redeem stamp, panggil StampService (akan handle validasi stamp & riwayat)
            if ($useStamp && $stampAmount >= 10) {
                // ambil fresh pesanan dengan relation detail untuk StampService
                $pesanan->load('detailPesanan.menu', 'user');
                // StampService akan me-throw exception bila invalid
                $discount = StampService::redeemStampsForPesanan($pesanan, $stampAmount);
                // redeemStampsForPesanan akan mengupdate detail (diskon, subtotal_setelah_diskon) dan pesanan->total_harga
                // reload pesanan
                $pesanan->refresh();
            }

            // 5) Jika status_pembayaran == 'lunas' dan user_id ada, beri earned stamps (anti double inside)
            if ($pesanan->status_pembayaran === 'lunas' && $pesanan->user_id) {
                // ensure relations loaded for calculation
                $pesanan->load('detailPesanan.menu', 'user');
                StampService::addEarnedStamps($pesanan);
                // addEarnedStamps will update pesanan->earned_stamp
            }

            DB::commit();

            // Return full pesanan dengan detail
            $pesanan->load('detailPesanan.menu', 'user', 'stamps');

            return response()->json([
                'success' => true,
                'message' => 'Checkout berhasil',
                'data' => $pesanan
            ], 201);

        } catch (\InvalidArgumentException $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            DB::rollBack();
            // Untuk debugging selama development, kembalikan pesan error
            return response()->json([
                'success' => false,
                'message' => 'Checkout gagal: '.$e->getMessage()
            ], 500);
        }
    }
}