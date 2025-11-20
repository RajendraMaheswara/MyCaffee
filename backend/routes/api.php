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

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [UserController::class, 'me']);

    Route::middleware('role:kasir,admin')->group(function () {
        Route::post('/pesanan', [PesananController::class, 'store']);
        Route::post('/stamp/grant', [StampController::class, 'grantStamp']);
    });

    Route::middleware('role:user')->group(function () {
        Route::post('/stamp/redeem', [StampController::class, 'redeemStamp']);
    });
});

Route::apiResource('/user', UserController::class);
Route::apiResource('/menu', MenuController::class);
Route::apiResource('/pesanan', PesananController::class);
Route::apiResource('detail-pesanan', DetailPesananController::class);
Route::apiResource('/laporan-penjualan', LaporanPenjualanController::class);

Route::middleware('auth:sanctum')->post('/redeem', [StampController::class, 'redeem']);