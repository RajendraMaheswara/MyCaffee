<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pesanan;

class PesananSeeder extends Seeder
{
    public function run(): void
    {
        Pesanan::insert([
            [
                'kasir_id' => 2,
                'user_id' => null,
                'nomor_meja' => 5,
                'jumlah_stamp' => 0,
                'tanggal_pesan' => '2025-10-27 01:29:25',
                'total_harga' => 40000.00,
                'status_pesanan' => 'diproses',
                'status_pembayaran' => 'belum_dibayar',
                'catatan' => 'Tanpa gula untuk kopi.',
                'tanggal_pembayaran' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kasir_id' => 2,
                'user_id' => null,
                'nomor_meja' => 10,
                'jumlah_stamp' => 0,
                'tanggal_pesan' => '2025-10-27 01:29:25',
                'total_harga' => 25000.00,
                'status_pesanan' => 'diantar',
                'status_pembayaran' => 'belum_dibayar',
                'catatan' => null,
                'tanggal_pembayaran' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kasir_id' => 2,
                'user_id' => null,
                'nomor_meja' => 3,
                'jumlah_stamp' => 0,
                'tanggal_pesan' => '2025-10-27 01:29:25',
                'total_harga' => 40000.00,
                'status_pesanan' => 'diproses',
                'status_pembayaran' => 'lunas',
                'catatan' => 'Customer minta sambal tambahan.',
                'tanggal_pembayaran' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}