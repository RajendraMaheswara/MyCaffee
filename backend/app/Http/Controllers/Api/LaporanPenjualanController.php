<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LaporanPenjualan;
use App\Http\Resources\LaporanPenjualanResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LaporanPenjualanController extends Controller
{
    public function index()
    {
        $laporan = LaporanPenjualan::latest()->paginate(5);
        return new LaporanPenjualanResource(true, 'List Data Laporan Penjualan', $laporan);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tanggal_laporan' => 'required|date|unique:laporan_penjualan,tanggal_laporan',
            'total_pendapatan_harian' => 'required|numeric|min:0',
            'jumlah_transaksi' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $laporan = LaporanPenjualan::create($request->all());
        return new LaporanPenjualanResource(true, 'Laporan Penjualan Berhasil Ditambahkan!', $laporan);
    }

    public function show($id)
    {
        $laporan = LaporanPenjualan::find($id);
        if (!$laporan) {
            return response()->json(['success' => false, 'message' => 'Data Laporan Tidak Ditemukan!'], 404);
        }

        return new LaporanPenjualanResource(true, 'Detail Laporan Penjualan!', $laporan);
    }

    public function update(Request $request, $id)
    {
        $laporan = LaporanPenjualan::find($id);
        if (!$laporan) {
            return response()->json(['success' => false, 'message' => 'Data Laporan Tidak Ditemukan!'], 404);
        }

        $validator = Validator::make($request->all(), [
            'tanggal_laporan' => 'required|date|unique:laporan_penjualan,tanggal_laporan,' . $laporan->id,
            'total_pendapatan_harian' => 'required|numeric|min:0',
            'jumlah_transaksi' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $laporan->update($request->all());
        return new LaporanPenjualanResource(true, 'Laporan Penjualan Berhasil Diubah!', $laporan);
    }

    public function destroy($id)
    {
        $laporan = LaporanPenjualan::find($id);
        if (!$laporan) {
            return response()->json(['success' => false, 'message' => 'Data Laporan Tidak Ditemukan!'], 404);
        }

        $laporan->delete();
        return new LaporanPenjualanResource(true, 'Laporan Penjualan Berhasil Dihapus!', null);
    }
}