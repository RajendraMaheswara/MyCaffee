import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import api from "../../api/axios";

export default function UserDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (user) {
      loadUserOrders();
    }
  }, [user]);

  const loadUserOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/pesanan/user/${user.id}`);
      if (response.data && response.data.data) {
        setOrders(response.data.data.slice(0, 5)); // Ambil 5 pesanan terakhir
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      diproses: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Diproses" },
      selesai: { bg: "bg-green-100", text: "text-green-800", label: "Selesai" },
      dibatalkan: { bg: "bg-red-100", text: "text-red-800", label: "Dibatalkan" },
    };
    return statusMap[status] || { bg: "bg-gray-100", text: "text-gray-800", label: status };
  };

  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      belum_dibayar: { bg: "bg-orange-100", text: "text-orange-800", label: "Belum Dibayar" },
      sudah_dibayar: { bg: "bg-blue-100", text: "text-blue-800", label: "Sudah Dibayar" },
    };
    return statusMap[status] || { bg: "bg-gray-100", text: "text-gray-800", label: status };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6d503b] to-[#8b6a4f] text-white py-6 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <span className="text-3xl font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Halo, {user?.username}!
                </h1>
                <p className="text-sm opacity-90">Selamat datang kembali</p>
              </div>
            </div>
            <Link
              to="/"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Menu
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Total Stamp */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Stamp</p>
                <p className="text-3xl font-bold text-[#6d503b]">
                  {user?.total_stamp || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ≈ Rp {((user?.total_stamp || 0) * 2000).toLocaleString('id-ID')}
                </p>
              </div>
              <div className="w-14 h-14 bg-[#6d503b] bg-opacity-10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#6d503b]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pesanan</p>
                <p className="text-3xl font-bold text-[#6d503b]">
                  {orders.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Riwayat pemesanan</p>
              </div>
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status Akun</p>
                <p className="text-xl font-bold text-[#6d503b] capitalize">
                  {user?.peran || 'User'}
                </p>
                <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
              </div>
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                activeTab === "profile"
                  ? "text-[#6d503b] border-b-2 border-[#6d503b] bg-gray-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Profil Saya
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                activeTab === "orders"
                  ? "text-[#6d503b] border-b-2 border-[#6d503b] bg-gray-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Riwayat Pesanan
            </button>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <p className="text-gray-900 font-semibold">{user?.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900 font-semibold">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {user?.nama_lengkap || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor Telepon
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {user?.no_telp || "-"}
                    </p>
                  </div>
                </div>

                {/* Stamp Info */}
                <div className="mt-6 p-4 bg-gradient-to-r from-[#6d503b] to-[#8b6a4f] rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Program Loyalitas</p>
                      <p className="text-2xl font-bold">{user?.total_stamp || 0} Stamp</p>
                      <p className="text-xs opacity-80 mt-1">
                        Tukar 10 stamp dengan diskon Rp 20.000
                      </p>
                    </div>
                    <div className="text-5xl opacity-20">⭐</div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6d503b] mx-auto mb-4"></div>
                    <p className="text-gray-500">Memuat riwayat pesanan...</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const statusBadge = getStatusBadge(order.status_pesanan);
                      const paymentBadge = getPaymentStatusBadge(order.status_pembayaran);
                      
                      return (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-sm text-gray-600">
                                Pesanan #{order.id}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(order.created_at).toLocaleString('id-ID')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-[#6d503b]">
                                Rp {Math.round(order.total_harga).toLocaleString('id-ID')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mb-3">
                            <span className={`${statusBadge.bg} ${statusBadge.text} text-xs font-medium px-2 py-1 rounded-full`}>
                              {statusBadge.label}
                            </span>
                            <span className={`${paymentBadge.bg} ${paymentBadge.text} text-xs font-medium px-2 py-1 rounded-full`}>
                              {paymentBadge.label}
                            </span>
                          </div>

                          {order.catatan && (
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              <span className="font-medium">Catatan:</span> {order.catatan}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Belum Ada Pesanan
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Mulai pesan menu favorit Anda sekarang!
                    </p>
                    <Link
                      to="/"
                      className="inline-block bg-[#6d503b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5c4033] transition"
                    >
                      Lihat Menu
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/"
            className="bg-[#6d503b] text-white text-center py-4 px-6 rounded-xl font-bold hover:bg-[#5c4033] transition shadow-md flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Kembali ke Menu
          </Link>
          <button
            onClick={logout}
            className="bg-red-600 text-white py-4 px-6 rounded-xl font-bold hover:bg-red-700 transition shadow-md flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}