import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthProvider";
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

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(form);

            if (user.peran === "admin") {
                navigate("/admin/dashboard");
            } else if (user.peran === "kasir") {
                navigate("/kasir/dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            alert("Login gagal. Periksa username/email dan password Anda.");
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