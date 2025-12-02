<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:50|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:4|confirmed',
            'nama_lengkap' => 'nullable|string|max:100',
            'no_telp' => 'nullable|string|regex:/^[0-9]{10,15}$/|unique:users,no_telp'
        ]);

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'nama_lengkap' => $request->nama_lengkap,
            'no_telp'      => $request->no_telp,
            'peran' => 'user',
            'total_stamp' => 0,
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'login'    => 'required',
            'password' => 'required'
        ]);

        $login = (string) $request->input('login');
        $ip = $request->ip();
        $key = Str::lower($login) . '|' . $ip;

        $maxAttempts = 5;
        $decayMinutes = 15; // lockout duration in minutes

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'message' => 'Terlalu banyak percobaan login. Coba lagi dalam '. $seconds . ' detik.'
            ], 429);
        }

        $user = User::where('username', $login)
            ->orWhere('email', $login)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            RateLimiter::hit($key, $decayMinutes * 60);

            $attempts = RateLimiter::attempts($key);
            if ($attempts >= $maxAttempts) {
                $seconds = RateLimiter::availableIn($key);
                return response()->json([
                    'message' => 'Kata sandi salah sebanyak '.$maxAttempts.' kali. Akun dikunci sementara. Coba lagi dalam '. $seconds .' detik.'
                ], 429);
            }

            $remaining = $maxAttempts - $attempts;
            return response()->json([
                'message' => 'Akun tidak ditemukan atau kata sandi salah',
                'remaining_attempts' => $remaining
            ], 401);
        }

        // successful login -> clear attempts
        RateLimiter::clear($key);

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'message' => 'Login sukses',
            'token' => $token,
            'user'  => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout berhasil']);
    }

    // GET /api/login-attempts?login=...
    public function loginAttempts(Request $request)
    {
        $request->validate([
            'login' => 'required'
        ]);

        $login = (string) $request->input('login');
        $ip = $request->ip();
        $key = Str::lower($login) . '|' . $ip;

        $maxAttempts = 5;
        $decayMinutes = 15;

        $attempts = RateLimiter::attempts($key);
        $locked = RateLimiter::tooManyAttempts($key, $maxAttempts);
        $availableIn = $locked ? RateLimiter::availableIn($key) : 0;

        return response()->json([
            'remaining_attempts' => max(0, $maxAttempts - $attempts),
            'locked' => $locked,
            'available_in_seconds' => $availableIn
        ]);
    }
}