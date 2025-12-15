import { useState } from "react";
import { Link } from "react-router-dom";
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
    { key: "operasional", label: "Operasional", icon: "📊" },
    { key: "keuangan", label: "Keuangan", icon: "💰" },
    { key: "menu", label: "Menu Terlaris", icon: "🍽️" },
    { key: "user", label: "User Teraktif", icon: "👥" },
  ];

  const bulanNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#6d503b] text-white py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Laporan Bulanan</h1>
                <p className="text-sm opacity-90">Analisis & Statistik MyCaffee</p>
              </div>
            </div>
            <Link
              to="/admin/dashboard"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Dashboard
            </Link>
          </div>

          {/* Filter Section */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Periode:</span>
              </div>
              
              <div className="flex gap-3 flex-1">
                <select 
                  value={bulan} 
                  onChange={(e) => setBulan(parseInt(e.target.value))} 
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-white text-gray-900 border-0 focus:ring-2 focus:ring-white font-medium"
                >
                  {bulanNames.map((name, i) => (
                    <option key={i} value={i + 1}>{name}</option>
                  ))}
                </select>

                <input
                  type="number"
                  value={tahun}
                  onChange={(e) => setTahun(parseInt(e.target.value))}
                  className="w-28 px-4 py-2 rounded-lg bg-white text-gray-900 border-0 focus:ring-2 focus:ring-white font-medium"
                  min="2020"
                  max="2099"
                />
              </div>

              <div className="text-sm opacity-90 hidden sm:block">
                <span className="font-semibold">{bulanNames[bulan - 1]} {tahun}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 min-w-[140px] px-6 py-4 text-sm font-semibold transition-all ${
                  tab === t.key 
                    ? "bg-[#6d503b] text-white border-b-4 border-[#5c4033]" 
                    : "bg-white text-gray-700 hover:bg-gray-50 border-b-4 border-transparent"
                }`}
              >
                <span className="mr-2">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {tab === "operasional" && <OperasionalReport bulan={bulan} tahun={tahun} />}
          {tab === "keuangan" && <KeuanganReport bulan={bulan} tahun={tahun} />}
          {tab === "menu" && <MenuReport bulan={bulan} tahun={tahun} />}
          {tab === "user" && <UserReport bulan={bulan} tahun={tahun} />}
        </div>
      </div>
    </div>
  );
}