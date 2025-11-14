<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Menu;
use App\Models\StampRedeemHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StampController extends Controller
{
    public function redeem(Request $request)
    {
        $request->validate([
            'menu_id' => 'required|exists:menu,id',
        ]);

        // Ambil user login dari Sanctum
        $user = Auth::user();

        // Validasi benar-benar instance User
        if (!$user || !($user instanceof User)) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak terautentikasi atau token tidak valid'
            ], 401);
        }

        // Pastikan cukup stamp
        if ($user->total_stamp < 10) {
            return response()->json([
                'success' => false,
                'message' => 'Stamp tidak cukup!'
            ], 400);
        }

        // Ambil menu
        $menu = Menu::find($request->menu_id);

        if (!$menu) {
            return response()->json([
                'success' => false,
                'message' => 'Menu tidak ditemukan'
            ], 404);
        }

        if (strtolower($menu->kategori) !== 'kopi') {
            return response()->json([
                'success' => false,
                'message' => 'Menu yang dipilih bukan kategori kopi'
            ], 400);
        }

        // Kurangi stamp
        $user->total_stamp = $user->total_stamp - 10;

        // SIMPAN SECARA PASTI
        $user->update([
            'total_stamp' => $user->total_stamp
        ]);

        // Simpan history
        $history = StampRedeemHistory::create([
            'user_id'    => $user->id,
            'menu_id'    => $menu->id,
            'stamp_used' => 10,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Redeem berhasil! Kopi gratis: ' . $menu->nama_menu,
            'data' => [
                'history' => $history,
                'sisa_stamp' => $user->total_stamp
            ]
        ]);
    }
}