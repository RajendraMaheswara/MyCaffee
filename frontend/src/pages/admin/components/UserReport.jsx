import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function UserReport({ bulan, tahun }) {
  const [mode, setMode] = useState("lunas");
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get(`api/laporan/bulanan/user?bulan=${bulan}&tahun=${tahun}&mode=${mode}`)
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
            <th>User</th>
            <th>Transaksi</th>
            <th>Total Belanja</th>
            <th>Stamp</th>
          </tr>
        </thead>
        <tbody>
          {data.map((u, i) => (
            <tr key={i} className="border-t">
              <td>{u.nama}</td>
              <td>{u.transaksi_count}</td>
              <td>Rp {parseInt(u.total_belanja).toLocaleString("id-ID")}</td>
              <td>{u.total_stamp_earned}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}