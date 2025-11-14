import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        await api.get("/sanctum/csrf-cookie");

        const res = await api.post("/api/login", { username, password });

        const role = res.data.user.peran;

        if (role === "admin") {
        navigate("/pages/admin/dashboardAdmin");
        } else if (role === "kasir") {
        navigate("/pages/kasir/dashboardKasir");
        } else {
        navigate("/");
        }

    } catch (err) {
        console.error(err);
        alert("Login gagal");
    }
    };

  return (
    <div style={{ maxWidth: 300, margin: "50px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}