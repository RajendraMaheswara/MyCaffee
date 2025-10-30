<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PesananSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('pesanan')->insert([
            ['id_pesanan' => 1, 'id_kasir' => null, 'nomor_meja' => 1, 'tanggal_pesan' => '2025-10-24 10:17:32', 'total_harga' => 40000, 'status_pesanan' => 'diantar', 'status_pembayaran' => 'sudah dibayar'],
            ['id_pesanan' => 2, 'id_kasir' => null, 'nomor_meja' => 1, 'tanggal_pesan' => '2025-10-24 10:30:14', 'total_harga' => 25000, 'status_pesanan' => 'diantar', 'status_pembayaran' => 'sudah dibayar'],
            ['id_pesanan' => 3, 'id_kasir' => null, 'nomor_meja' => 10, 'tanggal_pesan' => '2025-10-24 10:43:28', 'total_harga' => 30000, 'status_pesanan' => 'diantar', 'status_pembayaran' => 'sudah dibayar'],
            ['id_pesanan' => 4, 'id_kasir' => null, 'nomor_meja' => 10, 'tanggal_pesan' => '2025-10-24 10:52:49', 'total_harga' => 25000, 'status_pesanan' => 'diantar', 'status_pembayaran' => 'sudah dibayar'],
            ['id_pesanan' => 5, 'id_kasir' => null, 'nomor_meja' => 1, 'tanggal_pesan' => '2025-10-24 11:22:09', 'total_harga' => 57000, 'status_pesanan' => 'diantar', 'status_pembayaran' => 'sudah dibayar'],
            ['id_pesanan' => 6, 'id_kasir' => null, 'nomor_meja' => 1, 'tanggal_pesan' => '2025-10-24 11:33:30', 'total_harga' => 45000, 'status_pesanan' => 'diantar', 'status_pembayaran' => 'sudah dibayar'],
            ['id_pesanan' => 7, 'id_kasir' => null, 'nomor_meja' => 1, 'tanggal_pesan' => '2025-10-24 11:36:30', 'total_harga' => 100000, 'status_pesanan' => 'diproses', 'status_pembayaran' => 'belum dibayar'],
            ['id_pesanan' => 8, 'id_kasir' => null, 'nomor_meja' => 1, 'tanggal_pesan' => '2025-10-24 11:52:00', 'total_harga' => 25000, 'status_pesanan' => 'diantar', 'status_pembayaran' => 'sudah dibayar'],
        ]);
    }
}
