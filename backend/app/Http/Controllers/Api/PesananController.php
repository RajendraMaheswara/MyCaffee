<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PesananResource;
use App\Models\Pesanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Services\StampService;
use Illuminate\Support\Facades\DB;

class PesananController extends Controller
{
    // GET /pesanan
    public function index()
    {
        $pesanan = Pesanan::with(['kasir', 'user', 'detailPesanan.menu'])
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'List Data Pesanan',
            'data'    => $pesanan
        ]);
    }

    public function pesananUser($id)
    {
        $pesanan = Pesanan::with('detailPesanan.menu')
            ->where('user_id', $id)
            ->orderByDesc('created_at')
            ->get();

        // Format data untuk frontend dengan perhitungan detail
        $pesanan = $pesanan->map(function ($order) {
            // Hitung total diskon dari semua detail pesanan
            $totalDiskon = $order->detailPesanan->sum('diskon');
            
            // Hitung subtotal sebelum diskon
            $subtotalSebelumDiskon = $order->detailPesanan->sum('subtotal');
            
            // Hitung subtotal setelah diskon
            $subtotalSetelahDiskon = $order->detailPesanan->sum('subtotal_setelah_diskon');
            
            return [
                'id' => $order->id,
                'user_id' => $order->user_id,
                'kasir_id' => $order->kasir_id,
                'nomor_meja' => $order->nomor_meja,
                'total_harga' => $order->total_harga,
                'status_pesanan' => $order->status_pesanan,
                'status_pembayaran' => $order->status_pembayaran,
                'catatan' => $order->catatan,
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
                'detail_pesanan' => $order->detailPesanan->map(function ($detail) {
                    return [
                        'id' => $detail->id,
                        'menu_id' => $detail->menu_id,
                        'jumlah' => $detail->jumlah,
                        'harga_satuan' => $detail->harga_satuan,
                        'subtotal' => $detail->subtotal,
                        'diskon' => $detail->diskon ?? 0,
                        'subtotal_setelah_diskon' => $detail->subtotal_setelah_diskon ?? $detail->subtotal,
                        'menu' => [
                            'id' => $detail->menu->id,
                            'nama_menu' => $detail->menu->nama_menu,
                            'gambar' => $detail->menu->gambar,
                            'kategori' => $detail->menu->kategori,
                        ]
                    ];
                }),
                'ringkasan' => [
                    'subtotal_sebelum_diskon' => $subtotalSebelumDiskon,
                    'total_diskon' => $totalDiskon,
                    'subtotal_setelah_diskon' => $subtotalSetelahDiskon,
                    'total_bayar' => $order->total_harga,
                ]
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Riwayat pesanan user',
            'data'    => $pesanan
        ]);
    }

    // POST /pesanan
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'kasir_id'          => 'nullable|exists:users,id',
            'user_id'           => 'nullable|exists:users,id',
            'nomor_meja'        => 'required|integer',
            'total_harga'       => 'required|numeric|min:0',
            'status_pesanan'    => 'required|in:diproses,diantar',
            'status_pembayaran' => 'required|in:belum_dibayar,lunas',
            'catatan'           => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $pesanan = Pesanan::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil ditambahkan!',
            'data'    => $pesanan
        ], 201);
    }

    // GET /pesanan/{id}
    public function show($id)
    {
        $pesanan = Pesanan::with(['kasir', 'user', 'detailPesanan.menu'])->find($id);

        if (!$pesanan) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan'
            ], 404);
        }

        // Hitung ringkasan
        $totalDiskon = $pesanan->detailPesanan->sum('diskon');
        $subtotalSebelumDiskon = $pesanan->detailPesanan->sum('subtotal');
        $subtotalSetelahDiskon = $pesanan->detailPesanan->sum('subtotal_setelah_diskon');

        $pesananData = [
            'id' => $pesanan->id,
            'user_id' => $pesanan->user_id,
            'kasir_id' => $pesanan->kasir_id,
            'nomor_meja' => $pesanan->nomor_meja,
            'total_harga' => $pesanan->total_harga,
            'status_pesanan' => $pesanan->status_pesanan,
            'status_pembayaran' => $pesanan->status_pembayaran,
            'catatan' => $pesanan->catatan,
            'created_at' => $pesanan->created_at,
            'updated_at' => $pesanan->updated_at,
            'kasir' => $pesanan->kasir,
            'user' => $pesanan->user,
            'detail_pesanan' => $pesanan->detailPesanan->map(function ($detail) {
                return [
                    'id' => $detail->id,
                    'menu_id' => $detail->menu_id,
                    'jumlah' => $detail->jumlah,
                    'harga_satuan' => $detail->harga_satuan,
                    'subtotal' => $detail->subtotal,
                    'diskon' => $detail->diskon ?? 0,
                    'subtotal_setelah_diskon' => $detail->subtotal_setelah_diskon ?? $detail->subtotal,
                    'menu' => $detail->menu
                ];
            }),
            'ringkasan' => [
                'subtotal_sebelum_diskon' => $subtotalSebelumDiskon,
                'total_diskon' => $totalDiskon,
                'subtotal_setelah_diskon' => $subtotalSetelahDiskon,
                'total_bayar' => $pesanan->total_harga,
            ]
        ];

        return response()->json([
            'success' => true,
            'message' => 'Detail pesanan',
            'data'    => $pesananData
        ]);
    }

    // PUT /pesanan/{id}
   public function update(Request $request, $id)
    {
        $pesanan = Pesanan::with('detailPesanan.menu', 'user')->find($id);
        if (!$pesanan) {
            return response()->json(['success' => false, 'message' => 'Data Pesanan Tidak Ditemukan!'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nomor_meja' => 'required|integer',
            'total_harga' => 'required|numeric|min:0',
            'status_pesanan' => 'required|in:diproses,diantar',
            'status_pembayaran' => 'required|in:belum_dibayar,lunas',
            'catatan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $oldStatusPembayaran = $pesanan->status_pembayaran;
        $pesanan->update($request->all());

        if (
            $oldStatusPembayaran !== 'lunas' &&
            $pesanan->status_pembayaran === 'lunas' &&
            $pesanan->user_id
        ) {
            StampService::addEarnedStamps($pesanan);
        }
        
        return new PesananResource(true, 'Data Pesanan Berhasil Diubah!', $pesanan->fresh());
    }

    // DELETE /pesanan/{id}
    public function destroy($id)
    {
        $pesanan = Pesanan::find($id);

        if (!$pesanan) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan'
            ], 404);
        }

        $pesanan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dihapus'
        ]);
    }
}