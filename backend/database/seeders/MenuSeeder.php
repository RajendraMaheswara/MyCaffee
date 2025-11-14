<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        Menu::insert([
            ['nama_menu' => 'Kopi Arabika', 'deskripsi' => 'Kopi Arabika', 'harga' => 25000, 'stok' => 30, 'kategori' => 'Kopi', 'gambar' => null, 'created_at' => now(), 'updated_at' => now()],
            ['nama_menu' => 'Kentang Goreng', 'deskripsi' => 'Kentang Goreng', 'harga' => 15000, 'stok' => 20, 'kategori' => 'Snack', 'gambar' => null, 'created_at' => now(), 'updated_at' => now()],
            ['nama_menu' => 'Ricebowl Ayam Teriyaki', 'deskripsi' => 'Ricebowl', 'harga' => 25000, 'stok' => 15, 'kategori' => 'Makanan', 'gambar' => null, 'created_at' => now(), 'updated_at' => now()],
            ['nama_menu' => 'Kopi Latte', 'deskripsi' => 'Kopi Latte', 'harga' => 30000, 'stok' => 20, 'kategori' => 'Kopi', 'gambar' => null, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}