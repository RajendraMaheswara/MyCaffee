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
        'jumlah_stamp',
        'tanggal_pesan',
        'total_harga',
        'status_pesanan',
        'status_pembayaran',
        'catatan',
        'tanggal_pembayaran',
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

    public function hitungStamp()
    {
        $stamp = 0;
        foreach ($this->detailPesanan as $detail) {
            if ($detail->harga_satuan >= 25000) {
                $stamp += $detail->jumlah;
            }
        }
        return $stamp;
    }
}