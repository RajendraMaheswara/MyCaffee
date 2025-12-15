import { createContext, useState, useEffect, useMemo } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            api.get("/api/me")
                .then((res) => setUser(res.data.user))
                .catch(() => {
                    // ❗ Fix 1 — Tidak auto-logout (agar tidak trigger rerender)
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (loginData) => {
        try {
            await api.get("/sanctum/csrf-cookie");

            const res = await api.post("/api/login", loginData);

            localStorage.setItem("token", res.data.token);

            setToken(res.data.token);
            setUser(res.data.user);

            return res.data.user;
        } catch (error) {
            // 🔥 PENTING: Re-throw error agar bisa di-catch di Login.js
            throw error;
        }
    };

    const logout = async (redirect = true) => {
        try {
            await api.post("/api/logout");
        } catch {}

        localStorage.removeItem("token");
        setToken(null);
        setUser(null);

        if (redirect) window.location.href = "/login";
    };

    const contextValue = useMemo(() => ({
        user,
        setUser,
        token,
        loading,
        login,
        logout,
    }), [user, token, loading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}
