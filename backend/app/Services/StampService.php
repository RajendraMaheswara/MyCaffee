<?php

namespace App\Services;

use App\Models\Pesanan;
use App\Models\Stamp;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class StampService
{
    /**
     * HITUNG EARN STAMP DARI TOTAL KOPI SETELAH DISKON
     * 1 stamp per 15.000
     */
    public static function calculateEarnStamp(Pesanan $pesanan): int
    {
        $totalKopiFinal = 0;

        foreach ($pesanan->detailPesanan as $item) {
            if ($item->menu && strtolower($item->menu->kategori) === 'kopi') {
                $totalKopiFinal += $item->subtotal_setelah_diskon;
            }
        }

        return (int) floor($totalKopiFinal / 15000);
    }

    /**
     * TAMBAH EARN STAMP SAAT PEMBAYARAN -> LUNAS
     */
    public static function addEarnedStamps(Pesanan $pesanan): int
    {
        $user = $pesanan->user;

        if (!$user) return 0;
        if ($pesanan->earned_stamp > 0) return 0; // ✅ anti double earn

        $earned = self::calculateEarnStamp($pesanan);
        if ($earned <= 0) return 0;

        DB::transaction(function () use ($user, $pesanan, $earned) {
            // Tambah saldo stamp user
            $user->increment('total_stamp', $earned);

            // Simpan riwayat
            Stamp::create([
                'user_id'    => $user->id,
                'pesanan_id' => $pesanan->id,
                'tipe'       => 'earn',
                'jumlah'     => $earned,
                'keterangan' => 'Earn from pesanan #' . $pesanan->id,
            ]);

            // Catat di pesanan
            $pesanan->earned_stamp = $earned;
            $pesanan->save();
        });

        return $earned;
    }

    /**
     * PROSES REDEEM STAMP → MEMECAH DISKON KE DETAIL PESANAN
     * 10 STAMP = 20.000
     */
    public static function redeemStampsForPesanan(Pesanan $pesanan, int $stampAmount): int
    {
        $user = $pesanan->user;
        if (!$user) {
            throw new InvalidArgumentException('Pesanan tidak memiliki user.');
        }

        if ($pesanan->redeem_stamp === true) {
            throw new InvalidArgumentException('Pesanan ini sudah pernah redeem.');
        }

        if ($stampAmount < 10 || $stampAmount % 10 !== 0) {
            throw new InvalidArgumentException('Stamp harus kelipatan 10.');
        }

        if ($user->total_stamp < $stampAmount) {
            throw new InvalidArgumentException('Stamp user tidak cukup.');
        }

        // Ambil semua item kopi
        $kopiItems = $pesanan->detailPesanan->filter(function ($item) {
            return $item->menu && strtolower($item->menu->kategori) === 'kopi';
        });

        if ($kopiItems->count() === 0) {
            throw new InvalidArgumentException('Tidak ada kopi untuk diredeem.');
        }

        // Hitung total kopi awal
        $totalKopi = $kopiItems->sum('subtotal');

        $discount = ($stampAmount / 10) * 20000;
        $discount = min($discount, $totalKopi); // ❗ diskon tidak boleh lebih besar dari total kopi

        DB::transaction(function () use ($user, $pesanan, $kopiItems, $stampAmount, $discount) {

            // ✅ KURANGI STAMP USER
            $user->decrement('total_stamp', $stampAmount);

            Stamp::create([
                'user_id'    => $user->id,
                'pesanan_id' => $pesanan->id,
                'tipe'       => 'redeem',
                'jumlah'     => $stampAmount,
                'keterangan' => 'Redeem untuk pesanan #' . $pesanan->id,
            ]);

            // ✅ BAGI DISKON KE ITEM KOPI SECARA PROPORSIONAL
            $sisaDiskon = $discount;

            foreach ($kopiItems as $item) {

                if ($sisaDiskon <= 0) break;

                $maxDiskonItem = $item->subtotal;
                $diskonItem = min($maxDiskonItem, $sisaDiskon);

                $item->diskon = $diskonItem;
                $item->subtotal_setelah_diskon = $item->subtotal - $diskonItem;
                $item->save();

                $sisaDiskon -= $diskonItem;
            }

            // ✅ HITUNG ULANG TOTAL PESANAN DARI DETAIL
            $totalFinal = $pesanan->detailPesanan->sum('subtotal_setelah_diskon');

            $pesanan->update([
                'redeem_stamp'        => true,
                'redeem_stamp_amount'=> $stampAmount,
                'redeem_value'        => $discount,
                'total_harga'         => $totalFinal,
            ]);
        });

        return $discount;
    }
}