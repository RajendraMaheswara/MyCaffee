<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\PesananController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DetailPesananController;
use App\Http\Controllers\Api\LaporanPenjualanController;
use App\Http\Controllers\Api\StampController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::apiResource('/user', UserController::class);
Route::apiResource('/menu', MenuController::class);
Route::apiResource('/pesanan', PesananController::class);
Route::apiResource('detail-pesanan', DetailPesananController::class);
Route::apiResource('/laporan-penjualan', LaporanPenjualanController::class);

Route::middleware('auth:sanctum')->post('/redeem', [StampController::class, 'redeem']);