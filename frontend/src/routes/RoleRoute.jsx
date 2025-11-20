import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

export default function RoleRoute({ roles, children }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    if (!roles.includes(user.peran)) return <Navigate to="/not-found" />;

    return children;
}