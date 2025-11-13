<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::insert([
            [
                'username' => 'admin',
                'password' => Hash::make('admin'),
                'nama_lengkap' => 'Administrator',
                'peran' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'kasir',
                'password' => Hash::make('kasir'),
                'nama_lengkap' => 'Kasir Utama',
                'peran' => 'kasir',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}