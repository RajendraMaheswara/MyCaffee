import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function MenuReport({ bulan, tahun }) {
  const [mode, setMode] = useState("lunas");
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get(`api/laporan/bulanan/menu?bulan=${bulan}&tahun=${tahun}&mode=${mode}`)
      .then(res => setData(res.data.data))
      .catch(console.error);
  }, [bulan, tahun, mode]);

  return (
    <div>
      <select value={mode} onChange={(e) => setMode(e.target.value)} className="border p-2 mb-3 rounded">
        <option value="lunas">Hanya Lunas</option>
        <option value="all">Semua Pesanan</option>
      </select>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th>Menu</th>
            <th>Kategori</th>
            <th>Qty</th>
            <th>Omzet</th>
          </tr>
        </thead>
        <tbody>
          {data.map((m) => (
            <tr key={m.id} className="border-t">
              <td>{m.nama_menu}</td>
              <td>{m.kategori}</td>
              <td>{m.total_qty}</td>
              <td>Rp {parseInt(m.total_omzet).toLocaleString("id-ID")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}