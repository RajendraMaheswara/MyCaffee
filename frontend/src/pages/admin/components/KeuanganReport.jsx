import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function KeuanganReport({ bulan, tahun }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`api/laporan/bulanan/keuangan?bulan=${bulan}&tahun=${tahun}`)
      .then(res => setData(res.data))
      .catch(console.error);
  }, [bulan, tahun]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Card title="Transaksi Lunas" value={data.total_transaksi_lunas} />
      <Card title="Omzet" value={`Rp ${data.omzet.toLocaleString("id-ID")}`} />
      <Card title="Total Diskon" value={`Rp ${data.total_diskon.toLocaleString("id-ID")}`} />
      <Card title="Stamp Earned" value={data.stamp_earned} />
      <Card title="Stamp Redeemed" value={data.stamp_redeemed} />
    </div>
  );
}

const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow border">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);