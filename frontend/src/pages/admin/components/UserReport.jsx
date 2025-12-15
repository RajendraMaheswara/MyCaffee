import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function UserReport({ bulan, tahun }) {
  const [mode, setMode] = useState("lunas");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`api/laporan/bulanan/user?bulan=${bulan}&tahun=${tahun}&mode=${mode}`)
      .then(res => {
        setData(res.data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [bulan, tahun, mode]);

  const exportCSV = () => {
    if (data.length === 0) return;
    
    const rows = [
      ["Laporan User Teraktif", `Bulan ${bulan}/${tahun}`, `Mode: ${mode}`],
      [""],
      ["Nama User", "Jumlah Transaksi", "Total Belanja", "Stamp Earned"],
      ...data.map(u => [
        u.nama || "Guest",
        u.transaksi_count,
        parseInt(u.total_belanja),
        u.total_stamp_earned || 0
      ])
    ];

    const csvContent = rows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `user_teraktif_${bulan}_${tahun}.csv`);
    link.click();
  };

  // Calculate totals
  const totalTransaksi = data.reduce((sum, u) => sum + parseInt(u.transaksi_count), 0);
  const totalBelanja = data.reduce((sum, u) => sum + parseInt(u.total_belanja), 0);
  const totalStamp = data.reduce((sum, u) => sum + parseInt(u.total_stamp_earned || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6d503b] mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">User Teraktif</h3>
          <p className="text-sm text-gray-600">Pelanggan dengan transaksi terbanyak</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <select 
            value={mode} 
            onChange={(e) => setMode(e.target.value)} 
            className="flex-1 sm:flex-none px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6d503b] focus:border-[#6d503b] font-medium bg-white"
          >
            <option value="lunas">✅ Hanya Lunas</option>
            <option value="all">📊 Semua Pesanan</option>
          </select>
          
          <button
            onClick={exportCSV}
            disabled={data.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-[#6d503b] text-white rounded-lg hover:bg-[#5c4033] transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#6d503b] rounded-xl p-5 text-white">
            <p className="text-sm opacity-90 mb-1">Total User</p>
            <p className="text-3xl font-bold">{data.length}</p>
            <p className="text-xs opacity-80">Pelanggan aktif</p>
          </div>
          <div className="bg-[#8b6a4f] rounded-xl p-5 text-white">
            <p className="text-sm opacity-90 mb-1">Total Transaksi</p>
            <p className="text-3xl font-bold">{totalTransaksi}</p>
            <p className="text-xs opacity-80">Pesanan dibuat</p>
          </div>
          <div className="bg-[#c4a574] rounded-xl p-5 text-white">
            <p className="text-sm opacity-90 mb-1">Total Belanja</p>
            <p className="text-2xl font-bold">Rp {totalBelanja.toLocaleString("id-ID")}</p>
            <p className="text-xs opacity-80">Total pembelian</p>
          </div>
          <div className="bg-[#5c4033] rounded-xl p-5 text-white">
            <p className="text-sm opacity-90 mb-1">Total Stamp</p>
            <p className="text-3xl font-bold">{totalStamp}</p>
            <p className="text-xs opacity-80">Stamp diberikan</p>
          </div>
        </div>
      )}

      {/* Table */}
      {data.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <p className="text-gray-600 font-medium">Tidak ada data user</p>
          <p className="text-sm text-gray-500 mt-1">Belum ada aktivitas user pada periode ini</p>
        </div>
      ) : (
        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#6d503b] text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Nama User</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Transaksi</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Total Belanja</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Rata-rata/Transaksi</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Stamp Earned</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">% Kontribusi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((user, index) => {
                  const kontribusi = totalBelanja > 0 
                    ? ((parseInt(user.total_belanja) / totalBelanja) * 100).toFixed(1) 
                    : 0;
                  const avgPerTransaksi = user.transaksi_count > 0
                    ? Math.round(parseInt(user.total_belanja) / parseInt(user.transaksi_count))
                    : 0;
                  
                  return (
                    <tr 
                      key={index} 
                      className={`hover:bg-gray-50 transition ${
                        index < 3 ? 'bg-[#f5f1ed]' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {index === 0 && <span className="text-xl">🥇</span>}
                          {index === 1 && <span className="text-xl">🥈</span>}
                          {index === 2 && <span className="text-xl">🥉</span>}
                          <span className="font-semibold text-gray-700">{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#6d503b] text-white flex items-center justify-center font-bold">
                            {(user.nama || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.nama || "Guest User"}
                            </p>
                            {index < 3 && (
                              <p className="text-xs text-[#8b6a4f]">⭐ Top Customer</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center gap-1 font-bold text-gray-900">
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                          </svg>
                          {user.transaksi_count}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-bold text-[#6d503b]">
                          Rp {parseInt(user.total_belanja).toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-gray-700">
                          Rp {avgPerTransaksi.toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center gap-1 font-semibold text-[#c4a574]">
                          <span className="text-lg">⭐</span>
                          {user.total_stamp_earned || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[#6d503b] h-2 rounded-full transition-all"
                              style={{ width: `${kontribusi}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-700 min-w-[45px]">
                            {kontribusi}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr className="font-bold">
                  <td colSpan="2" className="px-4 py-4 text-gray-900">TOTAL</td>
                  <td className="px-4 py-4 text-right text-gray-900">{totalTransaksi}</td>
                  <td className="px-4 py-4 text-right text-[#6d503b]">
                    Rp {totalBelanja.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-900">
                    Rp {data.length > 0 ? Math.round(totalBelanja / totalTransaksi).toLocaleString("id-ID") : 0}
                  </td>
                  <td className="px-4 py-4 text-right text-[#c4a574]">⭐ {totalStamp}</td>
                  <td className="px-4 py-4 text-right text-gray-900">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}