<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DetailPesanan;

class DetailPesananSeeder extends Seeder
{
    public function run(): void
    {
        DetailPesanan::insert([
            ['id_pesanan' => 1, 'id_menu' => 1, 'jumlah' => 1, 'harga_satuan' => 25000.00, 'created_at' => now(), 'updated_at' => now()],
            ['id_pesanan' => 1, 'id_menu' => 2, 'jumlah' => 1, 'harga_satuan' => 18000.00, 'created_at' => now(), 'updated_at' => now()],
            ['id_pesanan' => 2, 'id_menu' => 1, 'jumlah' => 1, 'harga_satuan' => 25000.00, 'created_at' => now(), 'updated_at' => now()],
            ['id_pesanan' => 3, 'id_menu' => 2, 'jumlah' => 1, 'harga_satuan' => 18000.00, 'created_at' => now(), 'updated_at' => now()],
            ['id_pesanan' => 3, 'id_menu' => 3, 'jumlah' => 1, 'harga_satuan' => 32000.00, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}