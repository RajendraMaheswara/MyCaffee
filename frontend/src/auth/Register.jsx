import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        nama_lengkap: "",
        no_telp: "",
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await api.get("/sanctum/csrf-cookie");
            const res = await api.post("/api/register", formData);
            
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
            } else {
                alert("Terjadi kesalahan. Silakan coba lagi.");
            }
        } finally {
            setLoading(false);
        }
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

                        <p className="text-gray-600">Daftar Akun Baru</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
                            style={{ backgroundColor: "#5C4033" }}
                        >
                            {loading ? "Mendaftar..." : "Daftar"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
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