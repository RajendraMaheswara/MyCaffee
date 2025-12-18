<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\EmailVerification;
use App\Mail\OtpMail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\Login;
use Carbon\Carbon;

class AuthController extends Controller
{
    // ==================== REGISTER OTP ====================
    
    // Step 1: Request OTP for Registration
    public function requestOtp(Request $request)
    {
        // Honeypot
        if ($request->filled('website')) {
            return response()->json([
                'message' => 'Bot detected'
            ], 403);
        }

        // Verifikasi Turnstile
        $response = Http::asForm()->post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            [
                'secret' => env('TURNSTILE_SECRET'),
                'response' => $request->turnstile_token,
                'remoteip' => $request->ip(),
            ]
        );

        if (!($response->json()['success'] ?? false)) {
            return response()->json([
                'message' => 'Turnstile verification failed'
            ], 403);
        }

        $request->validate([
            'email' => 'required|email|unique:users,email',
        ]);

        // Generate 6 digit OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Delete old OTP for this email
        EmailVerification::where('email', $request->email)
            ->where('type', 'register')
            ->delete();

        // Store OTP (will be auto-hashed by model)
        EmailVerification::create([
            'email' => $request->email,
            'otp' => $otp, // Will be hashed automatically
            'type' => 'register',
            'expires_at' => Carbon::now()->addMinutes(10),
            'is_verified' => false,
        ]);

        // Send OTP via email
        try {
            Mail::to($request->email)->send(new OtpMail($otp, $request->email, 'register'));
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengirim email. Periksa konfigurasi email Anda.'
            ], 500);
        }

        return response()->json([
            'message' => 'Kode OTP telah dikirim ke email Anda',
            'email' => $request->email,
        ], 200);
    }

    // Step 2: Verify OTP and Register
    public function register(Request $request)
    {
        // Honeypot
        if ($request->filled('website')) {
            return response()->json([
                'message' => 'Bot detected'
            ], 403);
        }

        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
            'username' => 'required|string|max:50|unique:users',
            'password' => 'required|min:4|confirmed',
            'nama_lengkap' => 'nullable|string|max:100',
            'no_telp' => 'nullable|string|regex:/^[0-9]{10,15}$/|unique:users,no_telp'
        ]);

        // Find OTP record
        $verification = EmailVerification::where('email', $request->email)
            ->where('type', 'register')
            ->where('is_verified', false)
            ->first();

        if (!$verification) {
            return response()->json([
                'message' => 'Kode OTP tidak valid atau sudah digunakan'
            ], 400);
        }

        // Check if OTP expired
        if (Carbon::now()->greaterThan($verification->expires_at)) {
            return response()->json([
                'message' => 'Kode OTP telah kadaluarsa. Silakan minta kode baru.'
            ], 400);
        }

        // Verify OTP using hash check
        if (!$verification->verifyOtp($request->otp)) {
            return response()->json([
                'message' => 'Kode OTP tidak valid'
            ], 400);
        }

        // Create user
        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'nama_lengkap' => $request->nama_lengkap,
            'no_telp' => $request->no_telp,
            'peran' => 'user',
            'total_stamp' => 0,
        ]);

        // Mark OTP as verified
        $verification->update(['is_verified' => true]);

        return response()->json([
            'message' => 'Registrasi berhasil',
            'user' => $user,
        ], 201);
    }

    // Resend OTP for Registration
    public function resendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Check if email already registered
        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'message' => 'Email sudah terdaftar'
            ], 400);
        }

        // Rate limiting: max 3 requests per 10 minutes
        $key = 'resend-otp:' . $request->email;
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'message' => 'Terlalu banyak permintaan. Coba lagi dalam ' . $seconds . ' detik.'
            ], 429);
        }

        // Generate new OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Delete old OTP
        EmailVerification::where('email', $request->email)
            ->where('type', 'register')
            ->delete();

        // Store new OTP
        EmailVerification::create([
            'email' => $request->email,
            'otp' => $otp,
            'type' => 'register',
            'expires_at' => Carbon::now()->addMinutes(10),
            'is_verified' => false,
        ]);

        // Send OTP
        try {
            Mail::to($request->email)->send(new OtpMail($otp, $request->email, 'register'));
            RateLimiter::hit($key, 600); // 10 minutes
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengirim email'
            ], 500);
        }

        return response()->json([
            'message' => 'Kode OTP baru telah dikirim'
        ], 200);
    }

    // ==================== RESET PASSWORD OTP ====================

    // Step 1: Request OTP for Reset Password
    public function requestResetPasswordOtp(Request $request)
    {
        // Honeypot
        if ($request->filled('website')) {
            return response()->json([
                'message' => 'Bot detected'
            ], 403);
        }

        // Verifikasi Turnstile
        $response = Http::asForm()->post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            [
                'secret' => env('TURNSTILE_SECRET'),
                'response' => $request->turnstile_token,
                'remoteip' => $request->ip(),
            ]
        );

        if (!($response->json()['success'] ?? false)) {
            return response()->json([
                'message' => 'Turnstile verification failed'
            ], 403);
        }

        $request->validate([
            'email' => 'required|email',
        ]);

        // Check if email exists
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'message' => 'Email tidak terdaftar'
            ], 404);
        }

        // Rate limiting
        $key = 'reset-password-otp:' . $request->email;
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'message' => 'Terlalu banyak permintaan. Coba lagi dalam ' . $seconds . ' detik.'
            ], 429);
        }

        // Generate 6 digit OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Delete old reset password OTP
        EmailVerification::where('email', $request->email)
            ->where('type', 'reset_password')
            ->delete();

        // Store OTP
        EmailVerification::create([
            'email' => $request->email,
            'otp' => $otp,
            'type' => 'reset_password',
            'expires_at' => Carbon::now()->addMinutes(10),
            'is_verified' => false,
        ]);

        // Send OTP via email
        try {
            Mail::to($request->email)->send(new OtpMail($otp, $request->email, 'reset_password'));
            RateLimiter::hit($key, 600);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengirim email'
            ], 500);
        }

        return response()->json([
            'message' => 'Kode OTP untuk reset password telah dikirim ke email Anda',
            'email' => $request->email,
        ], 200);
    }

    // Step 2: Verify OTP for Reset Password
    public function verifyResetPasswordOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        // Find OTP record
        $verification = EmailVerification::where('email', $request->email)
            ->where('type', 'reset_password')
            ->where('is_verified', false)
            ->first();

        if (!$verification) {
            return response()->json([
                'message' => 'Kode OTP tidak valid atau sudah digunakan'
            ], 400);
        }

        // Check if OTP expired
        if (Carbon::now()->greaterThan($verification->expires_at)) {
            return response()->json([
                'message' => 'Kode OTP telah kadaluarsa. Silakan minta kode baru.'
            ], 400);
        }

        // Verify OTP
        if (!$verification->verifyOtp($request->otp)) {
            return response()->json([
                'message' => 'Kode OTP tidak valid'
            ], 400);
        }

        // Mark as verified but don't delete yet
        $verification->update(['is_verified' => true]);

        return response()->json([
            'message' => 'Kode OTP berhasil diverifikasi',
            'verified' => true
        ], 200);
    }

    // Step 3: Reset Password
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
            'password' => 'required|min:4|confirmed',
        ]);

        // Find verified OTP
        $verification = EmailVerification::where('email', $request->email)
            ->where('type', 'reset_password')
            ->where('is_verified', true)
            ->first();

        if (!$verification) {
            return response()->json([
                'message' => 'Kode OTP belum diverifikasi atau tidak valid'
            ], 400);
        }

        // Check if OTP expired
        if (Carbon::now()->greaterThan($verification->expires_at)) {
            return response()->json([
                'message' => 'Kode OTP telah kadaluarsa'
            ], 400);
        }

        // Verify OTP again
        if (!$verification->verifyOtp($request->otp)) {
            return response()->json([
                'message' => 'Kode OTP tidak valid'
            ], 400);
        }

        // Find user and update password
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        // Delete verification record
        $verification->delete();

        return response()->json([
            'message' => 'Password berhasil direset'
        ], 200);
    }

    // Resend OTP for Reset Password
    public function resendResetPasswordOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Check if email exists
        if (!User::where('email', $request->email)->exists()) {
            return response()->json([
                'message' => 'Email tidak terdaftar'
            ], 404);
        }

        // Rate limiting
        $key = 'resend-reset-otp:' . $request->email;
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'message' => 'Terlalu banyak permintaan. Coba lagi dalam ' . $seconds . ' detik.'
            ], 429);
        }

        // Generate new OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Delete old OTP
        EmailVerification::where('email', $request->email)
            ->where('type', 'reset_password')
            ->delete();

        // Store new OTP
        EmailVerification::create([
            'email' => $request->email,
            'otp' => $otp,
            'type' => 'reset_password',
            'expires_at' => Carbon::now()->addMinutes(10),
            'is_verified' => false,
        ]);

        // Send OTP
        try {
            Mail::to($request->email)->send(new OtpMail($otp, $request->email, 'reset_password'));
            RateLimiter::hit($key, 600);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengirim email'
            ], 500);
        }

        return response()->json([
            'message' => 'Kode OTP baru telah dikirim'
        ], 200);
    }

    // ==================== LOGIN & LOGOUT ====================

    public function login(Request $request)
    {
        // Honeypot
        if ($request->filled('website')) {
            return response()->json([
                'message' => 'Bot detected'
            ], 403);
        }

        // Verifikasi Turnstile
        $response = Http::asForm()->post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            [
                'secret' => env('TURNSTILE_SECRET'),
                'response' => $request->turnstile_token,
                'remoteip' => $request->ip(),
            ]
        );

        if (!($response->json()['success'] ?? false)) {
            return response()->json([
                'message' => 'Turnstile verification failed'
            ], 403);
        }

        $request->validate([
            'login'    => 'required',
            'password' => 'required'
        ]);

        $login = (string) $request->input('login');
        $ip = $request->ip();
        $key = Str::lower($login) . '|' . $ip;

        $maxAttempts = 5;
        $decayMinutes = 15;

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

        RateLimiter::clear($key);
        event(new Login('api', $user, false));
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

    public function loginAttempts(Request $request)
    {
        $request->validate([
            'login' => 'required'
        ]);

        $login = (string) $request->input('login');
        $ip = $request->ip();
        $key = Str::lower($login) . '|' . $ip;

        $maxAttempts = 5;
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