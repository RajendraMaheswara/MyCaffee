<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pesanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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

        return response()->json([
            'success' => true,
            'message' => 'Detail pesanan',
            'data'    => $pesanan
        ]);
    }

    // PUT /pesanan/{id}
    public function update(Request $request, $id)
    {
        $pesanan = Pesanan::with('detailPesanan')->find($id);

        if (!$pesanan) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nomor_meja'        => 'required|integer',
            'total_harga'       => 'required|numeric|min:0',
            'status_pesanan'    => 'required|in:diproses,diantar',
            'status_pembayaran' => 'required|in:belum_dibayar,lunas',
            'catatan'           => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $oldStatus = $pesanan->status_pembayaran;

        // Update data pesanan
        $pesanan->update($request->all());

        // === LOGIC STAMP ===

        // Jika pembayaran baru berubah menjadi "lunas"
        if ($oldStatus !== 'lunas' && $request->status_pembayaran === 'lunas') {
            $stamp = 0;

            foreach ($pesanan->detailPesanan as $item) {
                if ($item->harga_satuan >= 25000) {
                    $stamp += $item->jumlah;
                }
            }

            $pesanan->jumlah_stamp = $stamp;
            $pesanan->save();

            // Jika pesanan milik user
            if ($pesanan->user_id) {
                $pesanan->user->increment('total_stamp', $stamp);
            }
        }

        // Jika pembayaran dibatalkan (revert lunas → belum_dibayar)
        if ($oldStatus === 'lunas' && $request->status_pembayaran === 'belum_dibayar') {
            if ($pesanan->user_id && $pesanan->jumlah_stamp > 0) {
                $pesanan->user->decrement('total_stamp', $pesanan->jumlah_stamp);
            }

            $pesanan->jumlah_stamp = 0;
            $pesanan->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil diupdate!',
            'data'    => $pesanan
        ]);
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