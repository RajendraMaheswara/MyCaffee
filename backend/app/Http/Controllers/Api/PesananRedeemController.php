<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pesanan;
use App\Services\StampService;
use Illuminate\Support\Facades\Validator;

class PesananRedeemController extends Controller
{
    // POST /api/pesanan/{id}/redeem-stamp
    public function redeem(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'stamp_amount' => 'required|integer|min:10',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $pesanan = Pesanan::with(['detailPesanan.menu', 'user'])->find($id);

        if (!$pesanan) {
            return response()->json(['message' => 'Pesanan tidak ditemukan'], 404);
        }

        try {
            $discount = StampService::redeemStampsForPesanan(
                $pesanan,
                (int) $request->stamp_amount
            );

            return response()->json([
                'success'  => true,
                'message'  => 'Redeem berhasil',
                'discount' => $discount,
                'pesanan'  => $pesanan->fresh()
            ]);

        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan sistem'], 500);
        }
    }
}