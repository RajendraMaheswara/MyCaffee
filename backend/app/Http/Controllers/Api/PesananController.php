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