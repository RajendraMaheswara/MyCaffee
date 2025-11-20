import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

export default function GuestRoute({ children }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (user) {
        if (user.peran === "admin") return <Navigate to="/admin/dashboard" />;
        if (user.peran === "kasir") return <Navigate to="/kasir/dashboard" />;
        if (user.peran === "user") return <Navigate to="/user/dashboard" />;
    }

    return children;
}