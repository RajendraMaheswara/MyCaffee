import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthProvider";
import api from "../api/axios";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Cloudflare Turnstile
    const [turnstileToken, setTurnstileToken] = useState("");
    const turnstileLoaded = useRef(false);

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
                    window.turnstile.render("#turnstile-container", {
                        sitekey: "0x4AAAAAACHM_YFbipj_w8X4",
                        callback: setTurnstileToken,
                    });
                }
            };
            document.body.appendChild(script);
        } else if (window.turnstile && !turnstileLoaded.current) {
            turnstileLoaded.current = true;
            window.turnstile.render("#turnstile-container", {
                sitekey: "0x4AAAAAACHM_YFbipj_w8X4",
                callback: setTurnstileToken,
            });
        }
    }, []);

    const [form, setForm] = useState({
        login: "",
        password: "",
        website: "" // honeypot field
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [remainingAttempts, setRemainingAttempts] = useState(null);
    const [lockoutMessage, setLockoutMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            
            window.history.replaceState({}, document.title);
            
            const timer = setTimeout(() => {
                setSuccessMessage("");
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [location]);

    // Reset remaining attempts ketika user mengubah username atau password
    useEffect(() => {
        setRemainingAttempts(null);
        setLockoutMessage("");
    }, [form.login, form.password]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        // Honeypot check
        if (form.website) {
            setErrorMessage("Bot terdeteksi.");
            setIsSubmitting(false);
            return;
        }

        if (!turnstileToken) {
            setErrorMessage("Verifikasi captcha diperlukan.");
            setIsSubmitting(false);
            return;
        }
        try {
            // Kirim turnstileToken dan honeypot ke backend
            const user = await login({ ...form, turnstile_token: turnstileToken });

            setRemainingAttempts(null);
            setLockoutMessage("");

            if (user.peran === "admin") {
                navigate("/admin/dashboard");
            } else if (user.peran === "kasir") {
                navigate("/kasir/dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            setIsSubmitting(false);
            const resp = err?.response;
            if (resp && resp.data) {
                if (resp.status === 429) {
                    setLockoutMessage(resp.data.message || "Akun terkunci sementara.");
                    setRemainingAttempts(0);
                } else if (typeof resp.data.remaining_attempts !== "undefined") {
                    setRemainingAttempts(resp.data.remaining_attempts);
                    setLockoutMessage("");
                }
                if (resp.data.message) {
                    setErrorMessage(resp.data.message);
                }
            } else {
                setErrorMessage("Login gagal. Periksa koneksi Anda.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5C4033] to-[#8B6B47] px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4" 
                             style={{ backgroundColor: "#5C4033", color: "#F5F1ED" }}>
                            <span className="text-4xl font-bold">J</span>
                        </div>

                        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">
                            Jagongan Coffee
                        </h1>

                        <p className="text-gray-600">Point of Sale System</p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-green-800 font-medium">
                                    {successMessage}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-red-800 font-medium">
                                    {errorMessage}
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username / Email
                            </label>
                            <input
                                type="text"
                                value={form.login}
                                onChange={(e) =>
                                    setForm({ ...form, login: e.target.value })
                                }
                                required
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                           focus:ring-2 focus:ring-[#8B6B47] focus:border-transparent
                                           transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="Masukkan username atau email"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                            </div>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                                required
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                           focus:ring-2 focus:ring-[#8B6B47] focus:border-transparent
                                           transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="Masukkan password"
                            />
                            {/* Remaining attempts / lockout message */}
                            {lockoutMessage ? (
                                <p className="mt-2 text-sm text-red-700">{lockoutMessage}</p>
                            ) : remainingAttempts !== null ? (
                                <p className="mt-2 text-sm text-yellow-700">Sisa percobaan login: {remainingAttempts}</p>
                            ) : null}
                            <Link 
                                    to="/reset-password"
                                    className="text-sm font-medium hover:underline"
                                    style={{ color: "#5C4033" }}
                                >
                                    Lupa password?
                            </Link>
                        </div>

                        {/* Cloudflare Turnstile Captcha */}
                        <div className="flex justify-center">
                            <div id="turnstile-container"></div>
                        </div>

                        {/* Honeypot field (hidden from users, visible to bots) */}
                        <div style={{ position: "absolute", left: "-9999px", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
                            <label htmlFor="website">Website</label>
                            <input
                                type="text"
                                id="website"
                                name="website"
                                tabIndex="-1"
                                autoComplete="off"
                                value={form.website}
                                onChange={e => setForm({ ...form, website: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 rounded-lg font-semibold text-white transition 
                                     hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: "#5C4033" }}
                        >
                            {isSubmitting ? "Memproses..." : "Login"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Belum punya akun?{" "}
                            <Link 
                                to="/register" 
                                className="font-semibold hover:underline"
                                style={{ color: "#5C4033" }}
                            >
                                Daftar di sini
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