<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Pesanan;
use App\Models\StampHistory;
use App\Models\Menu;
use App\Models\DetailPesanan;

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
        // Hanya hitung untuk kategori 'Kopi'
        foreach ($pesanan->detailPesanan as $d) {
            if (strtoupper($d->menu->kategori) === 'KOPI') {
                // 1 stamp per item jika harga >= 25k
                if ($d->harga_satuan >= 25000) {
                    $stamp += $d->jumlah; // Setiap item kopi yang dibeli akan mendapatkan stamp
                }
            }
        }

        // Perbarui total_stamp pada user
        $user->total_stamp += $stamp;
        $user->save();

        // Catat pemberian stamp di tabel stamp_histories
        if ($stamp > 0) {
            StampHistory::create([
                'user_id' => $user->id,
                'pesanan_id' => $pesanan->id,
                'jumlah_stamp' => $stamp,
                'tipe' => 'earn',  // Tipe 'earn' berarti pemberian stamp
                'keterangan' => 'Stamp dari pesanan kopi',
            ]);
        }

        return response()->json([
            'message' => 'Stamp diberikan',
            'stamp_didapat' => $stamp,
            'total_stamp' => $user->total_stamp
        ]);
    }


    public function redeemStamp(Request $request)
    {
        $user = $request->user();

        // Periksa jika stempel mencukupi (minimal 10 stempel)
        if ($user->total_stamp < 10) {
            return response()->json(['message' => 'Stempel kurang dari 10'], 400);
        }

        // Validasi kopi yang ingin ditukarkan
        $validated = $request->validate([
            'menu_id' => 'required|exists:menu,id',
        ]);

        $menu = Menu::findOrFail($validated['menu_id']);

        // Pastikan menu yang ditukarkan adalah kopi dengan harga maksimal 20k
        if ($menu->kategori !== 'Kopi' || $menu->harga > 20000) {
            return response()->json(['message' => 'Menu tidak memenuhi syarat untuk penukaran'], 400);
        }

        // Kurangi 10 stempel dari akun pengguna
        $user->total_stamp -= 10;
        $user->save();

        // Update harga kopi yang ditukarkan menjadi 0 di pesanan
        $pesanan = Pesanan::create([
            'user_id' => $user->id,
            'total_harga' => 0,  // Harga kopi menjadi 0 setelah diskon penuh
            'status_pesanan' => 'diantar',  // Status pesanan sesuai dengan diskon
            'status_pembayaran' => 'lunas', // Status pembayaran setelah penukaran
            'nomor_meja' => $request->nomor_meja,
        ]);

        // Tambahkan detail pesanan untuk kopi yang ditukarkan
        $detailPesanan = new DetailPesanan();
        $detailPesanan->pesanan_id = $pesanan->id;
        $detailPesanan->menu_id = $menu->id;
        $detailPesanan->jumlah = 1;  // 1 kopi yang ditukarkan
        $detailPesanan->harga_satuan = 0;  // Harga kopi setelah diskon penuh
        $detailPesanan->save();

        // Catat penukaran stamp di history
        StampHistory::create([
            'user_id' => $user->id,
            'pesanan_id' => $pesanan->id,
            'jumlah_stamp' => 10,
            'tipe' => 'redeem',  // Tipe 'redeem' untuk penggunaan stamp
            'keterangan' => 'Tukar 10 stamp: kopi gratis'
        ]);

        return response()->json([
            'message' => 'Berhasil tukar stamp untuk kopi gratis',
            'sisa_stamp' => $user->total_stamp,
            'pesanan' => $pesanan,
        ]);
    }

    public function giveStamps($pesanan)
    {
        // Hitung total harga kategori kopi
        $totalKopiHarga = 0;
        foreach ($pesanan->detailPesanan as $item) {
            $menu = $item->menu;
            if ($menu->kategori == 'Kopi') {
                $totalKopiHarga += $item->harga_satuan * $item->jumlah;
            }
        }

        // Jika total harga kopi >= 15k, berikan stamp sesuai kelipatan
        if ($totalKopiHarga >= 15000) {
            $stampCount = floor($totalKopiHarga / 15000);

            // Berikan stamp ke pengguna dan update total_stamp
            for ($i = 0; $i < $stampCount; $i++) {
                StampHistory::create([
                    'user_id' => $pesanan->user_id,
                    'pesanan_id' => $pesanan->id,
                    'jumlah_stamp' => 1,
                    'tipe' => 'earn',
                    'keterangan' => 'Pembelian kopi',
                ]);
            }

            // Update total_stamp pada user setelah diberikan stamp
            $user = User::find($pesanan->user_id);
            $user->total_stamp += $stampCount;
            $user->save();

            // Update jumlah_stamp pada pesanan
            $pesanan->jumlah_stamp = $stampCount;
            $pesanan->save();
        }
    }

}
