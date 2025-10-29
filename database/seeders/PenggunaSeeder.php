<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Pengguna;

class PenggunaSeeder extends Seeder
{
    public function run(): void
    {
        Pengguna::create([
            'username' => 'admin',
            'password' => Hash::make('admin'),
            'nama_lengkap' => 'Administrator',
            'peran' => 'admin',
        ]);

        Pengguna::create([
            'username' => 'kasir',
            'password' => Hash::make('kasir'),
            'nama_lengkap' => 'Kasir Utama',
            'peran' => 'kasir',
        ]);
    }
}