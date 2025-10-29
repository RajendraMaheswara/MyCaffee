<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

// 🔹 Route khusus admin
Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/dashboard_admin', fn() => response()->json([
        'message' => 'Selamat datang di Dashboard Admin',
        'info' => 'Hanya admin yang bisa melihat endpoint ini'
    ]));
});

// 🔹 Route khusus kasir
Route::prefix('kasir')->middleware(['auth:sanctum', 'role:kasir'])->group(function () {
    Route::get('/dashboard_kasir', fn() => response()->json([
        'message' => 'Selamat datang di Dashboard Kasir',
        'info' => 'Hanya kasir yang bisa melihat endpoint ini'
    ]));
});