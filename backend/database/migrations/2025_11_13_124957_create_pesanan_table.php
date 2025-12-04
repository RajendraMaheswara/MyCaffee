<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pesanan', function (Blueprint $table) {
            $table->id();

            $table->foreignId('kasir_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->integer('nomor_meja');

            $table->integer('earned_stamp')->default(0);
            $table->boolean('redeem_stamp')->default(false);
            $table->integer('redeem_stamp_amount')->default(0);
            $table->decimal('redeem_value', 12, 2)->default(0);

            $table->dateTime('tanggal_pesan')->useCurrent();
            $table->dateTime('tanggal_pembayaran')->nullable();

            $table->decimal('total_harga', 12, 2)->default(0);

            $table->enum('status_pesanan', ['diproses', 'diantar'])->default('diproses');
            $table->enum('status_pembayaran', ['belum_dibayar', 'lunas'])->default('belum_dibayar');

            $table->text('catatan')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pesanan');
    }
};