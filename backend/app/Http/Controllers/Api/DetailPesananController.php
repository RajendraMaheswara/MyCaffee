<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DetailPesanan;
use App\Http\Resources\DetailPesananResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DetailPesananController extends Controller
{
    public function index()
    {
        $detail = DetailPesanan::with(['menu', 'pesanan'])->latest()->paginate(5);
        return new DetailPesananResource(true, 'List Data Detail Pesanan', $detail);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pesanan_id' => 'required|exists:pesanan,id',
            'menu_id' => 'required|exists:menu,id',
            'jumlah' => 'required|integer|min:1',
            'harga_satuan' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $detail = DetailPesanan::create($request->all());
        return new DetailPesananResource(true, 'Detail Pesanan Berhasil Ditambahkan!', $detail);
    }

    public function show($id)
    {
        $detail = DetailPesanan::with(['menu', 'pesanan'])->find($id);
        if (!$detail) {
            return response()->json(['success' => false, 'message' => 'Detail Pesanan Tidak Ditemukan!'], 404);
        }

        return new DetailPesananResource(true, 'Detail Pesanan Ditemukan!', $detail);
    }

    public function update(Request $request, $id)
    {
        $detail = DetailPesanan::find($id);
        if (!$detail) {
            return response()->json(['success' => false, 'message' => 'Detail Pesanan Tidak Ditemukan!'], 404);
        }

        $validator = Validator::make($request->all(), [
            'jumlah' => 'required|integer|min:1',
            'harga_satuan' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $detail->update($request->all());
        return new DetailPesananResource(true, 'Detail Pesanan Berhasil Diubah!', $detail);
    }

    public function destroy($id)
    {
        $detail = DetailPesanan::find($id);
        if (!$detail) {
            return response()->json(['success' => false, 'message' => 'Detail Pesanan Tidak Ditemukan!'], 404);
        }

        $detail->delete();
        return new DetailPesananResource(true, 'Detail Pesanan Berhasil Dihapus!', null);
    }
}