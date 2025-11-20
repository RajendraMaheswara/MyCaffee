import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

export default function KasirDashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard Kasir</h1>
      <p>Login sebagai: <b>{user.username}</b> ({user.peran})</p>

      <button onClick={logout} style={{ marginTop: 20 }}>
        Logout
      </button>
    </div>
  );
}
