<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Pesanan;
use App\Models\StampRedeemHistory;

class StampController extends Controller
{
    public function grantStamp(Request $request)
    {
        $request->validate([
            'pesanan_id' => 'required|exists:pesanan,id',
        ]);

        $pesanan = Pesanan::with('detailPesanan.menu')->find($request->pesanan_id);

        if (!$pesanan->user_id) {
            return response()->json(['message' => 'Pesanan tidak memiliki user'], 400);
        }

        $user = User::find($pesanan->user_id);

        $stamp = 0;
        foreach ($pesanan->detailPesanan as $d) {
            if (strtoupper($d->menu->kategori) === 'KOPI') {
                // 1 stamp per item jika harga >= 25k
                if ($d->harga_satuan >= 25000) {
                    $stamp += $d->jumlah;
                }
            }
        }

        $user->total_stamp += $stamp;
        $user->save();

        StampRedeemHistory::create([
            'user_id' => $user->id,
            'pesanan_id' => $pesanan->id,
            'jumlah_stamp' => $stamp,
            'tipe' => 'tambah',
            'keterangan' => 'Stamp dari pesanan'
        ]);

        return response()->json([
            'message' => 'Stamp diberikan',
            'stamp_didapat' => $stamp,
            'total_stamp' => $user->total_stamp
        ]);
    }

    public function redeemStamp(Request $request)
    {
        $user = $request->user();

        if ($user->total_stamp < 10) {
            return response()->json(['message' => 'Stamp kurang dari 10'], 400);
        }

        $user->total_stamp -= 10;
        $user->save();

        StampRedeemHistory::create([
            'user_id' => $user->id,
            'pesanan_id' => null,
            'jumlah_stamp' => 10,
            'tipe' => 'redeem',
            'keterangan' => 'Tukar 10 stamp: free coffee'
        ]);

        return response()->json([
            'message' => 'Berhasil tukar stamp',
            'sisa_stamp' => $user->total_stamp
        ]);
    }
}
