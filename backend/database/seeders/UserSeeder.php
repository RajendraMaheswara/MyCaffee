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
                'username'      => 'admin',
                'email'         => 'admin@gmail.com',
                'password'      => Hash::make('admin'),
                'nama_lengkap'  => 'Administrator',
                'peran'         => 'admin',
                'total_stamp'   => 0,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'username'      => 'kasir',
                'email'         => 'kasir@gmail.com',
                'password'      => Hash::make('kasir'),
                'nama_lengkap'  => 'Kasir Utama',
                'peran'         => 'kasir',
                'total_stamp'   => 0,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'username'      => 'user',
                'email'         => 'user@gmail.com',
                'password'      => Hash::make('user'),
                'nama_lengkap'  => 'User Biasa',
                'peran'         => 'user',
                'total_stamp'   => 0,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
        ]);
    }
}