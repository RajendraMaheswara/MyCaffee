import { useState } from "react";
import OperasionalReport from "./components/OperasionalReport";
import KeuanganReport from "./components/KeuanganReport";
import MenuReport from "./components/MenuReport";
import UserReport from "./components/UserReport";

export default function LaporanBulananPage() {
  const now = new Date();
  const [bulan, setBulan] = useState(now.getMonth() + 1);
  const [tahun, setTahun] = useState(now.getFullYear());
  const [tab, setTab] = useState("operasional");

  const tabs = [
    { key: "operasional", label: "Operasional" },
    { key: "keuangan", label: "Keuangan" },
    { key: "menu", label: "Menu Terlaris" },
    { key: "user", label: "User Teraktif" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📊 Laporan Bulanan</h1>

      {/* FILTER */}
      <div className="flex gap-3 mb-6">
        <select value={bulan} onChange={(e) => setBulan(e.target.value)} className="border p-2 rounded">
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>Bulan {i + 1}</option>
          ))}
        </select>

        <input
          type="number"
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
          className="border p-2 rounded w-28"
        />
      </div>

      {/* TAB BUTTON */}
      <div className="flex gap-2 mb-4">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded text-sm font-semibold ${
              tab === t.key ? "bg-[#6d503b] text-white" : "bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {tab === "operasional" && <OperasionalReport bulan={bulan} tahun={tahun} />}
      {tab === "keuangan" && <KeuanganReport bulan={bulan} tahun={tahun} />}
      {tab === "menu" && <MenuReport bulan={bulan} tahun={tahun} />}
      {tab === "user" && <UserReport bulan={bulan} tahun={tahun} />}
    </div>
  );
}