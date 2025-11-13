<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'id';
    
    protected $fillable = [
        'username',
        'password',
        'nama_lengkap',
        'peran',
    ];

    protected $hidden = [
        'password',
    ];
}