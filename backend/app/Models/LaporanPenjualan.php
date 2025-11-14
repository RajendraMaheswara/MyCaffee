<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaporanPenjualan extends Model
{
    protected $table = 'laporan_penjualan';

    protected $fillable = [
        'tanggal_laporan',
        'total_pendapatan_harian',
        'jumlah_transaksi',
    ];

    protected $casts = [
        'tanggal_laporan' => 'date',
        'total_pendapatan_harian' => 'decimal:2',
    ];
}