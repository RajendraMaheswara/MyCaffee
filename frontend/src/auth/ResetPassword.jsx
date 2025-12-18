import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const navigate = useNavigate();

    // Step state: 'email' -> 'otp' -> 'password'
    const [step, setStep] = useState('email');

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [website, setWebsite] = useState(""); // honeypot

    const [otpTimer, setOtpTimer] = useState(0);
    const [turnstileToken, setTurnstileToken] = useState("");
    const turnstileLoaded = useRef(false);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Load Turnstile
    useEffect(() => {
        if (!window.turnstile && !turnstileLoaded.current) {
            const script = document.createElement("script");
            script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
            script.async = true;
            script.defer = true;
            script.onload = () => {
                turnstileLoaded.current = true;
                if (window.turnstile) {
                    window.turnstile.render("#turnstile-container-reset", {
                        sitekey: "0x4AAAAAACHM_YFbipj_w8X4",
                        callback: setTurnstileToken,
                    });
                }
            };
            document.body.appendChild(script);
        } else if (window.turnstile && !turnstileLoaded.current) {
            turnstileLoaded.current = true;
            window.turnstile.render("#turnstile-container-reset", {
                sitekey: "0x4AAAAAACHM_YFbipj_w8X4",
                callback: setTurnstileToken,
            });
        }
    }, []);

    // Step 1: Request OTP
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        if (website) {
            alert('Bot detected');
            setLoading(false);
            return;
        }

        if (!turnstileToken) {
            alert('Verifikasi captcha diperlukan.');
            setLoading(false);
            return;
        }

        try {
            await api.get("/sanctum/csrf-cookie");
            await api.post("/api/request-reset-password-otp", {
                email,
                turnstile_token: turnstileToken,
                website
            });

            setStep('otp');
            setOtpTimer(600);
            alert('Kode OTP telah dikirim ke email Anda');
        } catch (err) {
            if (err.response?.data?.message) {
                setErrors({ email: err.response.data.message });
            } else {
                alert("Terjadi kesalahan. Silakan coba lagi.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await api.post("/api/verify-reset-password-otp", {
                email,
                otp
            });

            setStep('password');
            alert('Kode OTP berhasil diverifikasi');
        } catch (err) {
            if (err.response?.data?.message) {
                setErrors({ otp: err.response.data.message });
            } else {
                alert("Terjadi kesalahan. Silakan coba lagi.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        if (password !== passwordConfirmation) {
            setErrors({ password_confirmation: "Konfirmasi password tidak cocok" });
            setLoading(false);
            return;
        }

        try {
            await api.post("/api/reset-password", {
                email,
                otp,
                password,
                password_confirmation: passwordConfirmation
            });

            navigate("/login", {
                state: {
                    message: "Password berhasil direset! Silakan login dengan password baru Anda.",
                    type: "success"
                }
            });
        } catch (err) {
            if (err.response?.status === 422) {
                const backendErrors = err.response.data.errors || {};
                const formattedErrors = {};
                
                Object.keys(backendErrors).forEach(key => {
                    formattedErrors[key] = Array.isArray(backendErrors[key])
                        ? backendErrors[key][0]
                        : backendErrors[key];
                });
                
                setErrors(formattedErrors);
            } else if (err.response?.data?.message) {
                alert(err.response.data.message);
            } else {
                alert("Terjadi kesalahan. Silakan coba lagi.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        setLoading(true);
        try {
            await api.post("/api/resend-reset-password-otp", { email });
            setOtpTimer(600);
            alert('Kode OTP baru telah dikirim');
        } catch (err) {
            if (err.response?.data?.message) {
                alert(err.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // OTP Timer countdown
    useEffect(() => {
        if (otpTimer > 0) {
            const interval = setInterval(() => {
                setOtpTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [otpTimer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5C4033] to-[#8B6B47] px-4 py-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    
                    {/* Logo */}
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
                             style={{ backgroundColor: "#5C4033", color: "#F5F1ED" }}>
                            <span className="text-4xl font-bold">J</span>
                        </div>

                        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">
                            Jagongan Coffee
                        </h1>

                        <p className="text-gray-600">
                            {step === 'email' && 'Reset Password'}
                            {step === 'otp' && 'Verifikasi OTP'}
                            {step === 'password' && 'Buat Password Baru'}
                        </p>
                    </div>

                    {/* STEP 1: Email Input */}
                    {step === 'email' && (
                        <form onSubmit={handleRequestOtp} className="space-y-6">
                            <div className="text-center mb-4">
                                <p className="text-sm text-gray-600">
                                    Masukkan email Anda untuk menerima kode OTP reset password
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className={`w-full px-4 py-3 border rounded-lg transition
                                               focus:ring-2 focus:ring-[#8B6B47] focus:border-transparent
                                               disabled:bg-gray-100 disabled:cursor-not-allowed
                                               ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Masukkan email terdaftar"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Cloudflare Turnstile */}
                            <div className="flex justify-center">
                                <div id="turnstile-container-reset"></div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
                                style={{ backgroundColor: "#5C4033" }}
                            >
                                {loading ? "Mengirim OTP..." : "Kirim Kode OTP"}
                            </button>

                            {/* Honeypot hidden field */}
                            <div style={{ position: "absolute", left: "-9999px", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
                                <input
                                    type="text"
                                    name="website"
                                    tabIndex="-1"
                                    autoComplete="off"
                                    value={website}
                                    onChange={e => setWebsite(e.target.value)}
                                />
                            </div>
                        </form>
                    )}

                    {/* STEP 2: OTP Verification */}
                    {step === 'otp' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Kode verifikasi telah dikirim ke<br />
                                    <span className="font-semibold text-gray-800">{email}</span>
                                </p>
                            </div>

                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                                        Masukkan Kode OTP
                                    </label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        maxLength="6"
                                        required
                                        className={`w-full px-4 py-3 border rounded-lg text-center text-2xl font-bold tracking-widest
                                                   focus:ring-2 focus:ring-[#8B6B47] focus:border-transparent
                                                   ${errors.otp ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="000000"
                                    />
                                    {errors.otp && (
                                        <p className="text-red-500 text-sm mt-1 text-center">{errors.otp}</p>
                                    )}
                                </div>

                                {otpTimer > 0 && (
                                    <p className="text-center text-sm text-gray-600">
                                        Kode berlaku selama: <span className="font-semibold text-[#5C4033]">{formatTime(otpTimer)}</span>
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className="w-full py-3 rounded-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                                    style={{ backgroundColor: "#5C4033" }}
                                >
                                    {loading ? "Memverifikasi..." : "Verifikasi OTP"}
                                </button>

                                <div className="text-center space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => setStep('email')}
                                        className="text-sm text-gray-600 hover:text-[#5C4033]"
                                    >
                                        ← Kembali
                                    </button>
                                    <br />
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={loading || otpTimer > 540}
                                        className="text-sm font-semibold hover:underline disabled:opacity-50"
                                        style={{ color: "#5C4033" }}
                                    >
                                        Kirim ulang kode OTP
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* STEP 3: New Password */}
                    {step === 'password' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    OTP terverifikasi! Buat password baru Anda
                                </p>
                            </div>

                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password Baru <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className={`w-full px-4 py-3 border rounded-lg transition
                                                   focus:ring-2 focus:ring-[#8B6B47] focus:border-transparent
                                                   ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Minimal 4 karakter"
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Konfirmasi Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        required
                                        className={`w-full px-4 py-3 border rounded-lg transition
                                                   focus:ring-2 focus:ring-[#8B6B47] focus:border-transparent
                                                   ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Konfirmasi password baru"
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 rounded-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
                                    style={{ backgroundColor: "#5C4033" }}
                                >
                                    {loading ? "Mereset Password..." : "Reset Password"}
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Kembali ke{" "}
                            <Link
                                to="/login"
                                className="font-semibold hover:underline"
                                style={{ color: "#5C4033" }}
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="text-center mt-6 text-white text-sm">
                    <p>&copy; 2025 Jagongan Coffee. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}