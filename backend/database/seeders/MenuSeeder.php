<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        Menu::insert([
            ['nama_menu' => 'Kopi Biasa', 'deskripsi' => 'Kopi Biasa', 'harga' => 15000, 'stok' => 100, 'kategori' => 'Kopi', 'gambar' => 'PBUvwmUblbJBg2TY0cfBb8tKQxzVAnsYtsuHOQzv.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['nama_menu' => 'Kopi Luar Biasa', 'deskripsi' => 'Kopi Luar Biasa', 'harga' => 30000, 'stok' => 10, 'kategori' => 'Kopi', 'gambar' => '8sGmbB65PjOmccixN59QMZ7b0FBEkkuHREEmcxDc.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['nama_menu' => 'Kentang Goreng', 'deskripsi' => 'Kentang Goreng', 'harga' => 15000, 'stok' => 50, 'kategori' => 'Snack', 'gambar' => 'xGfjzNn5ayQexGOx2NPquL6ANopkJoYETYzAwS82.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['nama_menu' => 'Indomie Goreng', 'deskripsi' => 'Indomie Goreng', 'harga' => 10000, 'stok' => 100, 'kategori' => 'Makanan', 'gambar' => 'NMDhpQIRIUlypWK32oMMxggKC2rQwXpPHP0YKkzq.jpg', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}