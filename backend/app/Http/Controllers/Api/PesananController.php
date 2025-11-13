<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pesanan;
use App\Http\Resources\PesananResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PesananController extends Controller
{
    public function index()
    {
        $pesanan = Pesanan::with(['kasir', 'detailPesanan.menu'])->latest()->paginate(5);
        return new PesananResource(true, 'List Data Pesanan', $pesanan);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_kasir' => 'nullable|exists:users,id',
            'nomor_meja' => 'required|integer',
            'total_harga' => 'required|numeric|min:0',
            'status_pesanan' => 'required|in:diproses,diantar',
            'status_pembayaran' => 'required|in:belum_dibayar,lunas',
            'catatan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $pesanan = Pesanan::create($request->all());
        return new PesananResource(true, 'Data Pesanan Berhasil Ditambahkan!', $pesanan);
    }

    public function show($id)
    {
        $pesanan = Pesanan::with(['kasir', 'detailPesanan.menu'])->find($id);
        if (!$pesanan) {
            return response()->json(['success' => false, 'message' => 'Data Pesanan Tidak Ditemukan!'], 404);
        }

        return new PesananResource(true, 'Detail Data Pesanan!', $pesanan);
    }

    public function update(Request $request, $id)
    {
        $pesanan = Pesanan::find($id);
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

        $pesanan->update($request->all());
        return new PesananResource(true, 'Data Pesanan Berhasil Diubah!', $pesanan);
    }

    public function destroy($id)
    {
        $pesanan = Pesanan::find($id);
        if (!$pesanan) {
            return response()->json(['success' => false, 'message' => 'Data Pesanan Tidak Ditemukan!'], 404);
        }

        $pesanan->delete();
        return new PesananResource(true, 'Data Pesanan Berhasil Dihapus!', null);
    }
}