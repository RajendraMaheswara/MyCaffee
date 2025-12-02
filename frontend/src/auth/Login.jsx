import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthProvider";
import api from "../api/axios";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        login: "",
        password: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [remainingAttempts, setRemainingAttempts] = useState(null);
    const [lockoutMessage, setLockoutMessage] = useState("");

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

    // Poll remaining attempts while the login input is filled
    useEffect(() => {
        let interval = null;

        const fetchAttempts = async () => {
            if (!form.login) return;
            try {
                const res = await api.get('/api/login-attempts', { params: { login: form.login } });
                const data = res.data;
                if (data.locked) {
                    setLockoutMessage(`Kata sandi salah sebanyak 5 kali. Akun dikunci sementara. Coba lagi dalam ${data.available_in_seconds} detik.`);
                    setRemainingAttempts(0);
                } else {
                    setRemainingAttempts(data.remaining_attempts);
                    setLockoutMessage("");
                }
            } catch (e) {
                // ignore network errors silently
            }
        };

        // fetch immediately and then every 5 seconds
        if (form.login) {
            fetchAttempts();
            interval = setInterval(fetchAttempts, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [form.login]);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(form);

            // clear attempt info on success
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
            // handle API provided remaining attempts or lockout message
            const resp = err?.response;
            if (resp && resp.data) {
                if (resp.status === 429) {
                    setLockoutMessage(resp.data.message || "Akun terkunci sementara.");
                    setRemainingAttempts(0);
                } else if (typeof resp.data.remaining_attempts !== 'undefined') {
                    setRemainingAttempts(resp.data.remaining_attempts);
                    setLockoutMessage("");
                }
            }

            // fallback generic alert
            if (!resp) alert("Login gagal. Periksa koneksi Anda.");
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                           focus:ring-2 focus:ring-[#8B6B47] focus:border-transparent
                                           transition"
                                placeholder="Masukkan username atau email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                           focus:ring-2 focus:ring-[#8B6B47] focus:border-transparent
                                           transition"
                                placeholder="Masukkan password"
                            />
                            {/* Remaining attempts / lockout message (moved below password) */}
                            {lockoutMessage ? (
                                <p className="mt-2 text-sm text-red-700">{lockoutMessage}</p>
                            ) : remainingAttempts !== null ? (
                                <p className="mt-2 text-sm text-yellow-700">Sisa percobaan login: {remainingAttempts}</p>
                            ) : null}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
                            style={{ backgroundColor: "#5C4033" }}
                        >
                            Login
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