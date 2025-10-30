<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('pesanan', function (Blueprint $table) {
            $table->id('id_pesanan');
            $table->foreignId('id_kasir')->nullable()->constrained('pengguna', 'id_pengguna')->nullOnDelete();
            $table->integer('nomor_meja');
            $table->dateTime('tanggal_pesan')->useCurrent();
            $table->decimal('total_harga', 10, 2);
            $table->enum('status_pesanan', ['diproses', 'diantar', 'selesai'])->default('diproses');
            $table->enum('status_pembayaran', ['belum dibayar', 'sudah dibayar'])->default('belum dibayar');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('pesanan');
    }
};
