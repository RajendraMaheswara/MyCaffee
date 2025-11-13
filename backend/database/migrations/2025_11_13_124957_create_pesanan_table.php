<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pesanan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_kasir')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->integer('nomor_meja');
            $table->dateTime('tanggal_pesan')->useCurrent();
            $table->decimal('total_harga', 10, 2);
            $table->enum('status_pesanan', ['diproses', 'diantar'])->default('diproses');
            $table->enum('status_pembayaran', ['belum_dibayar', 'lunas'])->default('belum_dibayar');
            $table->text('catatan')->nullable();
            $table->dateTime('tanggal_pembayaran')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pesanan');
    }
};