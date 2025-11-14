<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'username',
        'email',
        'password',
        'nama_lengkap',
        'peran',
        'total_stamp',
    ];

    protected $hidden = [
        'password',
    ];

    public function pesanan()
    {
        return $this->hasMany(Pesanan::class, 'user_id', 'id');
    }

    public function pesananDiproses()
    {
        return $this->hasMany(Pesanan::class, 'kasir_id', 'id');
    }

    public function stampHistories()
    {
        return $this->hasMany(StampHistory::class);
    }

    public function redeemHistories()
    {
        return $this->hasMany(StampRedeemHistory::class);
    }
}