<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stamp;

class StampController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Stamp::where('user_id', $user->id)->latest();
        $stamps = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $stamps
        ]);
    }
}