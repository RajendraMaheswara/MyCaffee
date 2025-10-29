<?php

namespace App\Http\Controllers;

use App\Models\Pengguna;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $user = Pengguna::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return back()->withErrors(['login' => 'Username atau password salah']);
        }

        // buat token Sanctum
        $token = $user->createToken('web_token')->plainTextToken;

        // Simpan token ke session agar middleware Sanctum bisa mengenali
        session(['token' => $token]);
        Auth::login($user);

        // Redirect sesuai peran
        return match ($user->peran) {
            'admin' => redirect()->route('admin.dashboard'),
            'kasir' => redirect()->route('kasir.dashboard'),
            default => redirect('/'),
        };
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $user->tokens()->delete(); // hapus semua token
            Auth::logout();
        }

        session()->flush();

        return redirect('/login')->with('success', 'Berhasil logout');
    }
}