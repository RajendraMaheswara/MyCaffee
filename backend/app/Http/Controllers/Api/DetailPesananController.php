<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DetailPesanan;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DetailPesananController extends Controller
{
    // POST /api/detail-pesanan
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pesanan_id'   => 'required|exists:pesanan,id',
            'menu_id'      => 'required|exists:menu,id',
            'jumlah'       => 'required|integer|min:1',
            'harga_satuan' => 'required|numeric|min:0',
            'subtotal'     => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            // Optional: verifikasi menu ada
            $menu = Menu::find($request->menu_id);
            if (!$menu) {
                return response()->json([
                    'success' => false,
                    'message' => 'Menu tidak ditemukan'
                ], 404);
            }
            
            $subtotal = $request->harga_satuan * $request->jumlah;
            $detail = DetailPesanan::create([
                'pesanan_id'   => $request->pesanan_id,
                'menu_id'      => $request->menu_id,
                'jumlah'       => $request->jumlah,
                'harga_satuan' => $request->harga_satuan,
                'subtotal'     => $subtotal,
                'diskon'       => 0,
                'subtotal_setelah_diskon'  => $subtotal,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Detail pesanan berhasil disimpan',
                'data'    => $detail
            ], 201);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan detail pesanan',
                'error'   => $e->getMessage() // PENTING saat debug
            ], 500);
        }
    }
}