// src/pages/admin/AdminDashboard.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { Link } from "react-router-dom";
import axios from 'axios';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [totalStock, setTotalStock] = useState(0);
  const [makananSold, setMakananSold] = useState(0);
  const [minumanSold, setMinumanSold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const API_BASE_URL = 'http://127.0.0.1:8000/api';

  useEffect(() => {
    const loadStats = async () => {
      setLoadingStats(true);
      try {
        // Fetch menus to calculate total stock
        const menusRes = await axios.get(`${API_BASE_URL}/menu`);
        const menusData = menusRes?.data?.data || menusRes?.data || [];
        const menus = Array.isArray(menusData) ? menusData : (menusData.data || []);
        const stockSum = menus.reduce((acc, m) => acc + (Number(m.stok) || 0), 0);

        // Fetch orders to calculate revenue and sold items (paid/lunas)
        const ordersRes = await axios.get(`${API_BASE_URL}/pesanan`);
        const ordersData = ordersRes?.data?.data || ordersRes?.data || [];
        const orders = Array.isArray(ordersData) ? ordersData : (ordersData.data || []);

        let revenue = 0;
        let foodCount = 0;
        let drinkCount = 0;

        orders.forEach((order) => {
          const payment = (order.status_pembayaran || order.payment_status || '').toString().toLowerCase();
          const isPaid = ['lunas', 'paid', 'sudah_bayar'].some(p => payment.includes(p));
          // Use backend total_harga if exists otherwise try total
          const orderTotal = Number(order.total_harga ?? order.total ?? 0) || 0;
          if (isPaid) {
            revenue += orderTotal;

            const details = order.detail_pesanan || order.details || order.detail || [];
            details.forEach((d) => {
              const qty = Number(d.jumlah || d.quantity || 0) || 0;
              // category may live in relation menu.kategori or in the detail itself
              const kategori = (d.menu?.kategori || d.kategori || d.type || '').toString().toLowerCase();
              if (kategori.includes('makanan')) foodCount += qty;
              else if (kategori.includes('minum') || kategori.includes('minuman') || kategori.includes('drink')) drinkCount += qty;
              else {
                // fallback: try to detect by nama/menu name keywords
                const name = (d.menu?.nama_menu || d.nama_menu || '').toString().toLowerCase();
                if (name.includes('nasi') || name.includes('mie') || name.includes('roti') || name.includes('kue') || name.includes('snack') || name.includes('makanan')) foodCount += qty;
                else drinkCount += qty;
              }
            });
          }
        });

        setTotalStock(stockSum);
        setTotalRevenue(revenue);
        setMakananSold(foodCount);
        setMinumanSold(drinkCount);
      } catch (err) {
        console.error('Gagal mengambil statistik admin:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, []);

  // Lock page scrolling while this component is mounted
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous || '';
    };
  }, []);

  return (
    <div className="" style={{ height: '100vh', overflow: 'hidden', backgroundColor: "#F8F5F2" }}>
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col items-center">

        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-4xl font-serif text-gray-900 mb-2">
            Selamat Datang, {user?.username || "Admin"}!
          </h1>
          <p className="text-gray-600 text-sm">
            Kelola data MyCaffee melalui menu berikut:
          </p>
        </div>

        {/* Akses Cepat - DIPINDAHKAN KE ATAS */}
        <div className="mb-2 bg-white border border-gray-200 rounded-xl shadow-sm p-5 w-full max-w-3xl text-center">
          <h2 className="text-2xl font-serif text-gray-900 mb-5">
            Akses Cepat
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">

            <div
              className="p-5 rounded-xl text-left text-gray-800 transition"
              style={{ backgroundColor: "#F5F1ED" }}
            >
              <div className="mb-2 text-center">
                <svg className="w-10 h-10 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="3" y="10" width="4" height="11" rx="1" fill="#5C4033" />
                  <rect x="9" y="6" width="4" height="15" rx="1" fill="#5C4033" />
                  <rect x="15" y="2" width="4" height="19" rx="1" fill="#5C4033" />
                </svg>
              </div>
              <p className="text-sm font-medium mb-2 text-center">Laporan Penjualan</p>
              {loadingStats ? (
                <p className="text-sm text-gray-500">Memuat...</p>
              ) : (
                <>
                  <p className="text-sm text-gray-800">Total Pesanan Lunas: {makananSold + minumanSold}</p>
                  <p className="text-sm text-gray-600">Total Pendapatan: Rp {Math.round(totalRevenue).toLocaleString('id-ID')}</p>
                </>
              )}
            </div>

            <div
              className="p-5 rounded-xl text-left text-gray-800 transition"
              style={{ backgroundColor: "#F5F1ED" }}
            >
              <div className="mb-2 text-center">
                <svg className="w-10 h-10 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M3 7l9-4 9 4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" fill="#5C4033" />
                  <path d="M12 3v14" stroke="#F8F5F2" strokeWidth="0.8" opacity="0.2" />
                </svg>
              </div>
              <p className="text-sm font-medium mb-2 text-center">Stok Barang</p>
              {loadingStats ? (
                <p className="text-sm text-gray-500">Memuat...</p>
              ) : (
                <>
                  <p className="text-sm text-gray-800">Total Stok: {totalStock}</p>
                  <p className="text-sm text-gray-600">(Jumlah seluruh stok menu)</p>
                </>
              )}
            </div>

            <div
              className="p-5 rounded-xl text-left text-gray-800 transition"
              style={{ backgroundColor: "#F5F1ED" }}
            >
              <div className="mb-2 text-center">
                <svg className="w-10 h-10 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <circle cx="12" cy="12" r="8" fill="#5C4033" />
                  <path d="M10.5 8.5c1-.3 2.5-.3 3.5 0 1 .3 1 1.6 0 1.9-1 .3-2.5.3-3.5 0-1-.3-1-1.6 0-1.9z" fill="#F8F5F2" opacity="0.95" />
                </svg>
              </div>
              <p className="text-sm font-medium mb-2 text-center">Terjual dan Lunas</p>
              {loadingStats ? (
                <p className="text-sm text-gray-500">Memuat...</p>
              ) : (
                <>
                  <p className="text-sm text-gray-700">Makanan: <span className="font-semibold">{makananSold}</span></p>
                  <p className="text-sm text-gray-700">Minuman: <span className="font-semibold">{minumanSold}</span></p>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Menu Cards - DIPINDAHKAN KE BAWAH */}
        <div className="grid sm:grid-cols-2 gap-10 w-full max-w-3xl">

          {/* MENU CARD */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition text-center">
            <div className="flex flex-col items-center">
              
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4"
                style={{ backgroundColor: "#5C4033" }}
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
                  <path d="M3 7h12v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 8h1a3 3 0 0 1 0 6h-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h3 className="text-xl font-serif text-gray-800 mb-1">
                Manajemen Menu
              </h3>

              <p className="text-gray-600 text-sm mb-5">
                Kelola menu kopi, teh, dan snack.
              </p>

              <Link
                to="/admin/menu"
                className="px-5 py-3 rounded-lg font-semibold text-white text-sm"
                style={{ backgroundColor: "#5C4033" }}
              >
                Kelola Menu
              </Link>
            </div>
          </div>

          {/* USER CARD */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition text-center">
            <div className="flex flex-col items-center">

              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4"
                style={{ backgroundColor: "#5C4033" }}
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
                  <path d="M8 14c-2.2 0-4 1.8-4 4v1h12v-1c0-2.2-1.8-4-4-4H8z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18 11c.8 0 1.5-.7 1.5-1.5S18.8 8 18 8s-1.5.7-1.5 1.5S17.2 11 18 11z" fill="currentColor" opacity="0.9" />
                </svg>
              </div>

              <h3 className="text-xl font-serif text-gray-800 mb-1">
                Manajemen Pengguna
              </h3>

              <p className="text-gray-600 text-sm mb-5">
                Kelola akun admin & kasir.
              </p>

              <Link
                to="/admin/users"
                className="px-5 py-3 rounded-lg font-semibold text-white text-sm"
                style={{ backgroundColor: "#5C4033" }}
              >
                Kelola Pengguna
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Fonts */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
        `}
      </style>

    </div>
  );
}