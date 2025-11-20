import { createContext, useState, useEffect } from "react";
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
                .catch(() => logout(false))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (loginData) => {
        await api.get("/sanctum/csrf-cookie");

        const res = await api.post("/api/login", loginData);

        localStorage.setItem("token", res.data.token);

        setToken(res.data.token);
        setUser(res.data.user);

        return res.data.user;
    };

    const logout = async (redirect = true) => {
        try {
            await api.post("/api/logout");
        } catch (e) {
            console.log("Logout error:", e);
        }

        localStorage.removeItem("token");
        setToken(null);
        setUser(null);

        if (redirect) window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}