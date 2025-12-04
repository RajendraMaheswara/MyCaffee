<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pesanan extends Model
{
    protected $table = 'pesanan';

    protected $fillable = [
        'kasir_id',
        'user_id',
        'nomor_meja',
        'earned_stamp',
        'redeem_stamp',
        'redeem_stamp_amount',
        'redeem_value',
        'tanggal_pesan',
        'tanggal_pembayaran',
        'total_harga',
        'status_pesanan',
        'status_pembayaran',
        'catatan'
    ];

    public function kasir()
    {
        return $this->belongsTo(User::class, 'kasir_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function detailPesanan()
    {
        return $this->hasMany(DetailPesanan::class, 'pesanan_id', 'id');
    }

    public function stamps()
    {
        return $this->hasMany(\App\Models\Stamp::class, 'pesanan_id');
    }
}