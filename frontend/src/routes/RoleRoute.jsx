import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

export default function RoleRoute({ roles, children }) {
    const { user, loading } = useContext(AuthContext);

    // Menunggu status login selesai
    if (loading) return <div>Loading...</div>;

    // Jika pengguna belum login, arahkan ke halaman login
    if (!user) return <Navigate to="/login" />;

    // Jika peran pengguna tidak sesuai, arahkan ke halaman "not-found"
    if (!roles.includes(user.peran)) return <Navigate to="/not-found" />;

    // Jika peran sesuai, tampilkan konten anak
    return children;
}
