<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Pengguna extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'pengguna';

    protected $fillable = [
        'username',
        'password',
        'nama_lengkap',
        'peran',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}