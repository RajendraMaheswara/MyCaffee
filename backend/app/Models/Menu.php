<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Menu extends Model
{
    protected $table = 'menu';
    protected $primaryKey = 'id_menu';

    protected $fillable = [
        'nama_menu',
        'deskripsi',
        'harga',
        'stok',
        'kategori',
        'gambar',
    ];

    /**
     * Accessor untuk gambar agar otomatis generate URL.
     */
    protected function gambar(): Attribute
    {
        return Attribute::make(
            get: fn ($gambar) => $gambar ? url('/storage/menu/' . $gambar) : null,
        );
    }
}