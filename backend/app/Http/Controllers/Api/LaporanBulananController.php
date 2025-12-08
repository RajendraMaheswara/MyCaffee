<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

use App\Exports\LaporanUserBulananExport;
use Maatwebsite\Excel\Facades\Excel;

class LaporanBulananController extends Controller
{
    /**
     * Helper: parse bulan & tahun (default: bulan ini)
     */
    protected function parseMonthYear(Request $request)
    {
        $month = (int) $request->query('bulan', Carbon::now()->month);
        $year  = (int) $request->query('tahun', Carbon::now()->year);

        // normalize
        if ($month < 1 || $month > 12) {
            $month = Carbon::now()->month;
        }

        return [$month, $year];
    }

    /**
     * LAPORAN OPERASIONAL (FULL) - semua pesanan (lunas & belum)
     * GET /api/laporan/bulanan/operasional?bulan=6&tahun=2025
     */
    public function operasional(Request $request)
    {
        [$month, $year] = $this->parseMonthYear($request);

        $start = Carbon::createFromDate($year, $month, 1)->startOfDay();
        $end   = (clone $start)->endOfMonth()->endOfDay();

        // total pesanan (all)
        $totalPesanan = DB::table('pesanan')
            ->whereBetween('tanggal_pesan', [$start, $end])
            ->count();

        // count by status_pembayaran
        $byPayment = DB::table('pesanan')
            ->select('status_pembayaran', DB::raw('count(*) as total'))
            ->whereBetween('tanggal_pesan', [$start, $end])
            ->groupBy('status_pembayaran')
            ->pluck('total','status_pembayaran')
            ->toArray();

        $lunas = isset($byPayment['lunas']) ? (int)$byPayment['lunas'] : 0;
        $belum = isset($byPayment['belum_dibayar']) ? (int)$byPayment['belum_dibayar'] : 0;

        // total meja aktif (distinct nomor_meja)
        $totalMeja = DB::table('pesanan')
            ->whereBetween('tanggal_pesan', [$start, $end])
            ->distinct('nomor_meja')
            ->count('nomor_meja');

        // jam tersibuk berdasarkan count pesanan (tanggal_pesan hour)
        $busiestHour = DB::table('pesanan')
            ->select(DB::raw('HOUR(tanggal_pesan) as hour'), DB::raw('count(*) as total'))
            ->whereBetween('tanggal_pesan', [$start, $end])
            ->groupBy(DB::raw('HOUR(tanggal_pesan)'))
            ->orderByDesc('total')
            ->first();

        return response()->json([
            'success' => true,
            'bulan' => sprintf('%04d-%02d', $year, $month),
            'total_pesanan' => $totalPesanan,
            'lunas' => $lunas,
            'belum_dibayar' => $belum,
            'total_meja_aktif' => (int) $totalMeja,
            'busiest_hour' => $busiestHour ? ['hour' => (int)$busiestHour->hour, 'count' => (int)$busiestHour->total] : null,
        ]);
    }

    /**
     * LAPORAN KEUANGAN (HANYA LUNAS)
     * GET /api/laporan/bulanan/keuangan?bulan=6&tahun=2025
     */
    public function keuangan(Request $request)
    {
        [$month, $year] = $this->parseMonthYear($request);

        $start = Carbon::createFromDate($year, $month, 1)->startOfDay();
        $end   = (clone $start)->endOfMonth()->endOfDay();

        // hanya pesanan lunas (menggunakan tanggal_pembayaran untuk keakuratan)
        $keuanganQuery = DB::table('pesanan')
            ->where('status_pembayaran', 'lunas')
            ->whereBetween('tanggal_pembayaran', [$start, $end]);

        $totalTransaksi = (int) $keuanganQuery->count();
        $omzet = (float) $keuanganQuery->sum('total_harga'); // total_harga sudah after redeem in your implementation
        $totalDiskon = (float) $keuanganQuery->sum('redeem_value');
        // total stamp earned: sum(earned_stamp)
        $totalStampEarned = (int) DB::table('pesanan')
            ->whereBetween('tanggal_pembayaran', [$start, $end])
            ->where('status_pembayaran', 'lunas')
            ->sum('earned_stamp');

        // total stamp redeemed in that month: sum stamps table tipe=redeem where created_at in month
        $stampRedeemed = (int) DB::table('stamps')
            ->where('tipe', 'redeem')
            ->whereBetween('created_at', [$start, $end])
            ->sum('jumlah');

        return response()->json([
            'success' => true,
            'bulan' => sprintf('%04d-%02d', $year, $month),
            'total_transaksi_lunas' => $totalTransaksi,
            'omzet' => $omzet,
            'total_diskon' => $totalDiskon,
            'stamp_earned' => $totalStampEarned,
            'stamp_redeemed' => $stampRedeemed,
        ]);
    }

    /**
     * LAPORAN MENU (top N)
     * mode query param: mode=all|lunas (default all)
     * GET /api/laporan/bulanan/menu?bulan=6&tahun=2025&mode=lunas&limit=10
     */
    public function menu(Request $request)
    {
        [$month, $year] = $this->parseMonthYear($request);
        $mode = $request->query('mode', 'all'); // all or lunas
        $limit = (int) $request->query('limit', 10);

        $start = Carbon::createFromDate($year, $month, 1)->startOfDay();
        $end   = (clone $start)->endOfMonth()->endOfDay();

        $pesananSub = DB::table('pesanan')
            ->select('id')
            ->whereBetween('tanggal_pesan', [$start, $end]);

        if ($mode === 'lunas') {
            $pesananSub->where('status_pembayaran', 'lunas')
                      ->whereBetween('tanggal_pembayaran', [$start, $end]);
        }

        // join detail_pesanan + menu
        $menuStats = DB::table('detail_pesanan as d')
            ->join('menu as m', 'd.menu_id', '=', 'm.id')
            ->joinSub($pesananSub, 'p', function($join){
                $join->on('d.pesanan_id', '=', 'p.id');
            })
            ->select(
                'm.id',
                'm.nama_menu',
                'm.kategori',
                DB::raw('SUM(d.jumlah) as total_qty'),
                DB::raw('SUM(d.subtotal_setelah_diskon) as total_omzet')
            )
            ->groupBy('m.id','m.nama_menu','m.kategori')
            ->orderByDesc('total_qty')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'bulan' => sprintf('%04d-%02d', $year, $month),
            'mode' => $mode,
            'data' => $menuStats
        ]);
    }

    /**
     * LAPORAN USER (top N)
     * mode=all|lunas
     * GET /api/laporan/bulanan/user?bulan=6&tahun=2025&mode=lunas&limit=10
     */
    public function user(Request $request)
    {
        [$month, $year] = $this->parseMonthYear($request);
        $mode  = $request->query('mode', 'all');
        $limit = (int) $request->query('limit', 10);

        $start = Carbon::createFromDate($year, $month, 1)->startOfDay();
        $end   = (clone $start)->endOfMonth()->endOfDay();

        $pesananSub = DB::table('pesanan')
            ->select('id','user_id','total_harga','earned_stamp')
            ->whereBetween('tanggal_pesan', [$start, $end]);

        if ($mode === 'lunas') {
            $pesananSub->where('status_pembayaran', 'lunas')
                    ->whereBetween('tanggal_pembayaran', [$start, $end]);
        }

        $userStats = DB::table('pesanan as p')
            ->joinSub($pesananSub, 'ps', function($join){
                $join->on('p.id', '=', 'ps.id');
            })
            ->leftJoin('users as u', 'p.user_id', '=', 'u.id')
            ->select(
                'p.user_id',
                DB::raw('COALESCE(u.nama_lengkap, u.username, "Guest") as nama'),
                DB::raw('COUNT(p.id) as transaksi_count'),
                DB::raw('SUM(p.total_harga) as total_belanja'),
                DB::raw('SUM(p.earned_stamp) as total_stamp_earned')
            )
            ->groupBy('p.user_id','u.nama_lengkap','u.username')
            ->orderByDesc('transaksi_count')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'bulan'   => sprintf('%04d-%02d', $year, $month),
            'mode'    => $mode,
            'data'    => $userStats
        ]);
    }
}