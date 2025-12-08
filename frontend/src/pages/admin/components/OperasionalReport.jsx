import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function OperasionalReport({ bulan, tahun }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`api/laporan/bulanan/operasional?bulan=${bulan}&tahun=${tahun}`)
      .then(res => setData(res.data))
      .catch(console.error);
  }, [bulan, tahun]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card title="Total Pesanan" value={data.total_pesanan} />
      <Card title="Lunas" value={data.lunas} />
      <Card title="Belum Dibayar" value={data.belum_dibayar} />
      <Card title="Meja Aktif" value={data.total_meja_aktif} />
    </div>
  );
}

const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow border">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);