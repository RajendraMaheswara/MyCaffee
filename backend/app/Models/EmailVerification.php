<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class EmailVerification extends Model
{
    protected $fillable = [
        'email',
        'otp',
        'expires_at',
        'is_verified',
        'type'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_verified' => 'boolean'
    ];

    public function setOtpAttribute($value)
    {
        $this->attributes['otp'] = Hash::make($value);
    }

    public function verifyOtp($otp)
    {
        return Hash::check($otp, $this->otp);
    }
}