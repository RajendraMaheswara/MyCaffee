import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

export default function UserDashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard User</h1>
      <p>Anda login sebagai: <strong>{user?.username}</strong> ({user?.peran})</p>

      <button onClick={logout} style={{ marginTop: 20 }}>
        Logout
      </button>
    </div>
  );
}