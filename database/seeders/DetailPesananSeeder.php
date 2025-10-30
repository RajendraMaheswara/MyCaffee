<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DetailPesananSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('detail_pesanan')->insert([
            ['id_detail' => 1, 'id_pesanan' => 1, 'id_menu' => 1, 'jumlah' => 1, 'harga_satuan' => 15000, 'subtotal' => 15000],
            ['id_detail' => 2, 'id_pesanan' => 1, 'id_menu' => 9, 'jumlah' => 1, 'harga_satuan' => 25000, 'subtotal' => 25000],
            ['id_detail' => 3, 'id_pesanan' => 2, 'id_menu' => 10, 'jumlah' => 1, 'harga_satuan' => 25000, 'subtotal' => 25000],
            ['id_detail' => 4, 'id_pesanan' => 3, 'id_menu' => 2, 'jumlah' => 1, 'harga_satuan' => 20000, 'subtotal' => 20000],
            ['id_detail' => 5, 'id_pesanan' => 3, 'id_menu' => 5, 'jumlah' => 1, 'harga_satuan' => 10000, 'subtotal' => 10000],
            ['id_detail' => 6, 'id_pesanan' => 4, 'id_menu' => 11, 'jumlah' => 1, 'harga_satuan' => 5000, 'subtotal' => 5000],
            ['id_detail' => 7, 'id_pesanan' => 4, 'id_menu' => 7, 'jumlah' => 1, 'harga_satuan' => 20000, 'subtotal' => 20000],
            ['id_detail' => 8, 'id_pesanan' => 5, 'id_menu' => 10, 'jumlah' => 1, 'harga_satuan' => 25000, 'subtotal' => 25000],
            ['id_detail' => 9, 'id_pesanan' => 5, 'id_menu' => 4, 'jumlah' => 1, 'harga_satuan' => 12000, 'subtotal' => 12000],
            ['id_detail' => 10, 'id_pesanan' => 5, 'id_menu' => 7, 'jumlah' => 1, 'harga_satuan' => 20000, 'subtotal' => 20000],
            ['id_detail' => 11, 'id_pesanan' => 6, 'id_menu' => 2, 'jumlah' => 1, 'harga_satuan' => 20000, 'subtotal' => 20000],
            ['id_detail' => 12, 'id_pesanan' => 6, 'id_menu' => 9, 'jumlah' => 1, 'harga_satuan' => 25000, 'subtotal' => 25000],
            ['id_detail' => 13, 'id_pesanan' => 7, 'id_menu' => 11, 'jumlah' => 1, 'harga_satuan' => 100000, 'subtotal' => 100000],
            ['id_detail' => 14, 'id_pesanan' => 8, 'id_menu' => 1, 'jumlah' => 1, 'harga_satuan' => 15000, 'subtotal' => 15000],
            ['id_detail' => 15, 'id_pesanan' => 8, 'id_menu' => 5, 'jumlah' => 1, 'harga_satuan' => 10000, 'subtotal' => 10000],
        ]);
    }
}
