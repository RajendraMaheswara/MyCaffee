import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function MenuDetail() {
  const { id } = useParams();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`menu/${id}`)
      .then((res) => {
        setMenu(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!menu) return <p>Menu tidak ditemukan</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/">← Kembali</Link>
      <h1>{menu.nama_menu}</h1>
      <img src={menu.gambar} alt={menu.nama_menu} style={{ width: "300px", borderRadius: "10px" }} />
      <p>{menu.deskripsi}</p>
      <p><strong>Kategori:</strong> {menu.kategori}</p>
      <p><strong>Harga:</strong> Rp {menu.harga}</p>
      <p><strong>Stok:</strong> {menu.stok}</p>
    </div>
  );
}