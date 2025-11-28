<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DetailPesanan;

class DetailPesananSeeder extends Seeder
{
    public function run(): void
    {
        DetailPesanan::insert([
            [
                'pesanan_id'   => 1,
                'menu_id'      => 1,
                'jumlah'       => 1,
                'harga_satuan' => 15000.00,
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'pesanan_id'   => 1,
                'menu_id'      => 2,
                'jumlah'       => 1,
                'harga_satuan' => 15000.00,
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'pesanan_id'   => 2,
                'menu_id'      => 1,
                'jumlah'       => 1,
                'harga_satuan' => 15000.00,
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'pesanan_id'   => 3,
                'menu_id'      => 2,
                'jumlah'       => 1,
                'harga_satuan' => 15000.00,
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'pesanan_id'   => 3,
                'menu_id'      => 3,
                'jumlah'       => 1,
                'harga_satuan' => 25000.00,
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
        ]);
    }
}