<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\PesananController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DetailPesananController;
use App\Http\Controllers\Api\LaporanPenjualanController;
use App\Http\Controllers\Api\StampController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::get('/login-attempts', [AuthController::class, 'loginAttempts']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [UserController::class, 'me']);
    
    Route::middleware('role:user')->group(function () {
        Route::post('/stamp/redeem', [StampController::class, 'redeemStamp']);
    });
});

Route::middleware('role:kasir,admin')->group(function () {
    // Route untuk update status pesanan dan pembayaran
    Route::patch('/pesanan/{id}/update-status', [PesananController::class, 'updateStatus']);
    
    // Route untuk menambahkan menu ke pesanan
    Route::post('/pesanan/{id}/add-menu', [PesananController::class, 'addMenuToPesanan']);
});

Route::post('/pesanan', [PesananController::class, 'store']);
Route::patch('/pesanan/{id}/update-status', [PesananController::class, 'updateStatus']);
Route::post('/pesanan/{id}/add-menu', [PesananController::class, 'addMenuToPesanan']);
Route::post('/stamp/grant', [StampController::class, 'grantStamp']);
Route::post('/redeem', [StampController::class, 'redeemStamp']);

// Resource
Route::apiResource('/user', UserController::class);
Route::apiResource('/menu', MenuController::class);
Route::apiResource('/pesanan', PesananController::class);
Route::apiResource('detail-pesanan', DetailPesananController::class);
Route::apiResource('/laporan-penjualan', LaporanPenjualanController::class);
Route::apiResource('/redeem', StampController::class);

Route::middleware('auth:sanctum')->post('/redeem', [StampController::class, 'redeem']);