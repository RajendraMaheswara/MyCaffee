import { useState } from "react";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    nama_lengkap: "",
    peran: "kasir",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.get("/sanctum/csrf-cookie");

      const res = await api.post("/api/register", form);

      console.log("Register Berhasil:", res.data);
      alert("Registrasi sukses");

    } catch (err) {
      console.error(err);
      alert("Gagal daftar");
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: "50px auto" }}>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        /><br />

        <input
          type="text"
          name="nama_lengkap"
          placeholder="Nama Lengkap"
          onChange={handleChange}
        /><br />

        <select name="peran" onChange={handleChange}>
          <option value="admin">Admin</option>
          <option value="kasir">Kasir</option>
          <option value="user">User</option>
        </select><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
