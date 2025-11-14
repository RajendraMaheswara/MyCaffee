<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StampRedeemHistory extends Model
{
    protected $table = 'stamp_redeem_history';

    protected $fillable = [
        'user_id',
        'menu_id',
        'stamp_used',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function menu()
    {
        return $this->belongsTo(Menu::class, 'menu_id', 'id');
    }
}