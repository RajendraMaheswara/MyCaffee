// src/pages/admin/AdminDashboard.jsx
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1ED' }}>
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#5C4033', color: '#F5F1ED' }}>
                <span className="text-2xl font-bold">J</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Dashboard Admin</h1>
                <p className="text-xs text-gray-500">Manajemen MyCaffee</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Selamat datang, {user?.username || 'Admin'}!
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-gray-800 mb-2">Selamat Datang, {user?.username || 'Admin'}!</h1>
          <p className="text-gray-600">Pilih menu di bawah untuk mengelola data:</p>
        </div>

        {/* Menu Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl">
          {/* Manajemen Menu Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300 border border-gray-100">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#5C4033', color: '#F5F1ED' }}>
                <span className="text-xl">☕</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-serif text-gray-800 mb-2">Manajemen Menu</h3>
                <p className="text-gray-600 mb-4">Kelola daftar menu kopi, makanan, dan snack.</p>
                <Link 
                  to="/admin/menu" 
                  className="inline-block px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: '#5C4033' }}
                >
                  Kelola Menu
                </Link>
              </div>
            </div>
          </div>
          {/* Manajemen Pengguna Card */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300 border border-gray-100">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#8B6B47', color: '#F5F1ED' }}>
                <span className="text-xl">👥</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-serif text-gray-800 mb-2">Manajemen Pengguna</h3>
                <p className="text-gray-600 mb-4">Kelola data akun admin dan kasir.</p>
                <Link 
                  to="/admin/users" 
                  className="inline-block px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: '#8B6B47' }}
                >
                  Kelola Pengguna
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6 max-w-4xl">
          <h2 className="text-2xl font-serif text-gray-800 mb-4">Akses Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F1ED' }}>
              <div className="text-2xl mb-2">📊</div>
              <p className="text-sm text-gray-600">Laporan Penjualan</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F1ED' }}>
              <div className="text-2xl mb-2">📦</div>
              <p className="text-sm text-gray-600">Stok Barang</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F1ED' }}>
              <div className="text-2xl mb-2">💰</div>
              <p className="text-sm text-gray-600">Pendapatan</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8 max-w-4xl">
          <button 
            onClick={logout}
            className="px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: '#C4A574' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Custom Fonts */}
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