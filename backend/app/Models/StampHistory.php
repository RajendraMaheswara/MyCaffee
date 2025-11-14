<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StampHistory extends Model
{
    protected $table = 'stamp_histories';

    protected $fillable = [
        'user_id',
        'pesanan_id',
        'jumlah_stamp',
        'tipe',
        'keterangan'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pesanan()
    {
        return $this->belongsTo(Pesanan::class);
    }
}