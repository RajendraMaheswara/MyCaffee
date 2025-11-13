<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        Menu::insert([
            [
                'nama_menu' => 'Kopi Arabika',
                'deskripsi' => 'Kopi murni dari biji arabika pilihan dengan cita rasa khas.',
                'harga' => 25000.00,
                'stok' => 30,
                'kategori' => 'Kopi',
                'gambar' => 'arabika.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_menu' => 'Kentang Goreng',
                'deskripsi' => 'Kentang goreng renyah disajikan dengan saus sambal dan mayo.',
                'harga' => 15000.00,
                'stok' => 20,
                'kategori' => 'Snack',
                'gambar' => 'kentang.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_menu' => 'Ricebowl Ayam Teriyaki',
                'deskripsi' => 'Nasi hangat dengan potongan ayam teriyaki dan sayur segar.',
                'harga' => 25000.00,
                'stok' => 15,
                'kategori' => 'Makanan',
                'gambar' => 'ricebowl.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}