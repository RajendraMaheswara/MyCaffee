<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LaporanPenjualan;

class LaporanPenjualanSeeder extends Seeder
{
    public function run(): void
    {
        LaporanPenjualan::insert([
            [
                'tanggal_laporan' => '2025-10-25',
                'total_pendapatan_harian' => 40000.00,
                'jumlah_transaksi' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'tanggal_laporan' => '2025-10-26',
                'total_pendapatan_harian' => 25000.00,
                'jumlah_transaksi' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'tanggal_laporan' => '2025-10-27',
                'total_pendapatan_harian' => 40000.00,
                'jumlah_transaksi' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}