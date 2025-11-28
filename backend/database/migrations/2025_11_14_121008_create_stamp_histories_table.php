<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stamp_histories', function (Blueprint $table) {
        $table->id();
        $table->bigInteger('user_id')->unsigned();
        $table->bigInteger('pesanan_id')->unsigned()->nullable();
        $table->integer('jumlah_stamp');
        $table->enum('tipe', ['earn', 'redeem']);
        $table->string('keterangan')->nullable();
        $table->timestamps();

        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        $table->foreign('pesanan_id')->references('id')->on('pesanan')->onDelete('set null');
    });
    }

    public function down(): void
    {
        Schema::dropIfExists('stamp_histories');
    }
};