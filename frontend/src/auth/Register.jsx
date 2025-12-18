import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    // Step state: 'form' or 'otp'
    const [step, setStep] = useState('form');

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        nama_lengkap: "",
        no_telp: "",
        website: "" // honeypot
    });

    const [otp, setOtp] = useState("");
    const [otpTimer, setOtpTimer] = useState(0);

    // Cloudflare Turnstile
    const [turnstileToken, setTurnstileToken] = useState("");
    const turnstileLoaded = useRef(false);

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });

        let error = "";

        switch (name) {
            case "username":
                if (!value) {
                    error = "Username wajib diisi";
                } else if (value.length > 50) {
                    error = "Username maksimal 50 karakter";
                }
                break;

            case "email":
                if (!value) {
                    error = "Email wajib diisi";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = "Format email tidak valid";
                }
                break;

            case "password":
                if (!value) {
                    error = "Password wajib diisi";
                } else if (value.length < 4) {
                    error = "Password minimal 4 karakter";
                }
                if (formData.password_confirmation && value !== formData.password_confirmation) {
                    setErrors(prev => ({
                        ...prev,
                        password_confirmation: "Konfirmasi password tidak cocok"
                    }));
                }
                break;

            case "password_confirmation":
                if (!value) {
                    error = "Konfirmasi password wajib diisi";
                } else if (value !== formData.password) {
                    error = "Konfirmasi password tidak cocok";
                }
                break;

            case "nama_lengkap":
                if (value && value.length > 100) {
                    error = "Nama lengkap maksimal 100 karakter";
                }
                break;
            
            case "no_telp":
                if (!value) {
                    error = "Nomor telepon wajib diisi";
                } else if (!/^[0-9]{10,12}$/.test(value)) {
                    error = "Nomor telepon tidak valid";
                }
                break;
        }

        if (error) {
            setErrors({
                ...errors,
                [name]: error,
            });
        }
    };

    // Step 1: Request OTP
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        if (formData.website) {
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
            await api.post("/api/request-otp", { 
                email: formData.email,
                turnstile_token: turnstileToken,
                website: formData.website
            });

            setStep('otp');
            setOtpTimer(600); // 10 minutes
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

    // Step 2: Verify OTP and Complete Registration
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await api.get("/sanctum/csrf-cookie");
            await api.post("/api/register", {
                ...formData,
                otp: otp
            });

            navigate("/login", { 
                state: { 
                    message: "Registrasi berhasil! Silakan login dengan akun Anda.",
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
                setErrors({ otp: err.response.data.message });
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
            await api.post("/api/resend-otp", { email: formData.email });
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

    useEffect(() => {
        // Load Turnstile script only once
        if (!window.turnstile && !turnstileLoaded.current) {
            const script = document.createElement("script");
            script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
            script.async = true;
            script.defer = true;
            script.onload = () => {
                turnstileLoaded.current = true;
                if (window.turnstile) {
                    window.turnstile.render("#turnstile-container-register", {
                        sitekey: "0x4AAAAAACHM_YFbipj_w8X4",
                        callback: setTurnstileToken,
                    });
                }
            };
            document.body.appendChild(script);
        } else if (window.turnstile && !turnstileLoaded.current) {
            turnstileLoaded.current = true;
            window.turnstile.render("#turnstile-container-register", {
                sitekey: "0x4AAAAAACHM_YFbipj_w8X4",
                callback: setTurnstileToken,
            });
        }
    }, []);

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
                            {step === 'form' ? 'Daftar Akun Baru' : 'Verifikasi Email'}
                        </p>
                    </div>

                    {/* STEP 1: Registration Form */}
                    {step === 'form' && (
                        <form onSubmit={handleRequestOtp} className="space-y-4">
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    name="nama_lengkap"
                                    value={formData.nama_lengkap}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-4 py-3 border rounded-lg transition
                                               focus:ring-2 focus:ring-[#8B6B47] focus:border-transparent
                                               ${errors.nama_lengkap ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Masukkan nama lengkap"
                                />
                                {errors.nama_lengkap && (
                                    <p className="text-red-500 text-sm mt-1">{errors.nama_lengkap}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    className={`w-full px-4 py-3 border rounded-lg transition
                                               focus:ring-2 focus:ring-[#8B6B47] focus:border-transparent
                                               ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Masukkan username"
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    className={`w-full px-4 py-3 border rounded-lg transition
                                               focus:ring-2 focus:ring-[#8B6B47] focus:border-transparent
                                               ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Masukkan email"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nomor Telp <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="no_telp"
                                    value={formData.no_telp}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    className={`w-full px-4 py-3 border rounded-lg transition
                                               focus:ring-2 focus:ring-[#8B6B47] focus:border-transparent
                                               ${errors.no_telp ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Masukkan nomor telepon"
                                />
                                {errors.no_telp  && (
                                    <p className="text-red-500 text-sm mt-1">{errors.no_telp }</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    className={`w-full px-4 py-3 border rounded-lg transition
                                               focus:ring-2 focus:ring-[#8B6B47] focus:border-transparent
                                               ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Konfirmasi password"
                                />
                                {errors.password_confirmation && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
                                )}
                            </div>

                            {/* Cloudflare Turnstile */}
                            <div className="flex justify-center">
                                <div id="turnstile-container-register"></div>
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
                                <label htmlFor="website_register">Website</label>
                                <input
                                    type="text"
                                    id="website_register"
                                    name="website"
                                    tabIndex="-1"
                                    autoComplete="off"
                                    value={formData.website}
                                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                                />
                            </div>
                        </form>
                    )}

                    {/* STEP 2: OTP Verification */}
                    {step === 'otp' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Kode verifikasi telah dikirim ke<br />
                                    <span className="font-semibold text-gray-800">{formData.email}</span>
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
                                    {loading ? "Memverifikasi..." : "Verifikasi & Daftar"}
                                </button>

                                <div className="text-center space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => setStep('form')}
                                        className="text-sm text-gray-600 hover:text-[#5C4033]"
                                    >
                                        ← Kembali ke form
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

                    <div className="mt-6 text-center space-y-2">
                        <p className="text-sm text-gray-600">
                            Sudah punya akun?{" "}
                            <Link 
                                to="/login" 
                                className="font-semibold hover:underline"
                                style={{ color: "#5C4033" }}
                            >
                                Login di sini
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