import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function MenuList() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("api/menu")
        .then((res) => {
        // console.log("API response:", res.data);
        setMenus(res.data.data.data);
        setLoading(false);
        })
        .catch((err) => {
        console.error("Error fetching menu:", err);
        setLoading(false);
        });
    }, []);


  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Daftar Menu</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {menus.map((menu) => (
          <div key={menu.id} style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "10px" }}>
            <img
              src={menu.gambar}
              alt={menu.nama_menu}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <h3>{menu.nama_menu}</h3>
            <p>{menu.deskripsi}</p>
            <p><strong>Rp {menu.harga}</strong></p>
            <Link to={`/menu/${menu.id}`}>Lihat Detail</Link>
          </div>
        ))}
      </div>
    </div>
  );
}