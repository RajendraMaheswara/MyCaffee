import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import api from "../../api/axios";

export default function UserDashboard() {
  const { user, logout, setUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    nama_lengkap: "",
    no_telp: "",
    email: "",
  });
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const ordersPerPage = 10;

  // Detail modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserOrders();
      setEditForm({
        username: user.username || "",
        nama_lengkap: user.nama_lengkap || "",
        no_telp: user.no_telp || "",
        email: user.email || "",
      });
    }
  }, [user, currentPage]);

  const loadUserOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/pesanan/user/${user.id}`);
      if (response.data && response.data.data) {
        const allOrders = response.data.data;
        setTotalOrders(allOrders.length);
        
        const startIndex = (currentPage - 1) * ordersPerPage;
        const endIndex = startIndex + ordersPerPage;
        const paginatedOrders = allOrders.slice(startIndex, endIndex);
        
        setOrders(paginatedOrders);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditForm({
      username: user.username || "",
      nama_lengkap: user.nama_lengkap || "",
      no_telp: user.no_telp || "",
      email: user.email || "",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      username: user.username || "",
      nama_lengkap: user.nama_lengkap || "",
      no_telp: user.no_telp || "",
      email: user.email || "",
    });
  };

  const handleSaveProfile = async () => {
    try {
      setSaveLoading(true);
      const response = await api.put(`/api/user/${user.id}`, editForm);
      
      if (response.data && response.data.data) {
        setUser(response.data.data);
        alert("Profil berhasil diperbarui!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(", ");
        alert(`Error: ${errorMessages}`);
      } else {
        alert("Gagal memperbarui profil. Silakan coba lagi.");
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      diproses: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Diproses" },
      diantar: { bg: "bg-blue-100", text: "text-blue-800", label: "Diantar" },
      selesai: { bg: "bg-green-100", text: "text-green-800", label: "Selesai" },
      dibatalkan: { bg: "bg-red-100", text: "text-red-800", label: "Dibatalkan" },
    };
    return statusMap[status] || { bg: "bg-gray-100", text: "text-gray-800", label: status };
  };

  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      belum_dibayar: { bg: "bg-orange-100", text: "text-orange-800", label: "Belum Dibayar" },
      lunas: { bg: "bg-green-100", text: "text-green-800", label: "Lunas" },
    };
    return statusMap[status] || { bg: "bg-gray-100", text: "text-gray-800", label: status };
  };

  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pesanan</p>
                <p className="text-3xl font-bold text-[#6d503b]">
                  {totalOrders}
                </p>
                <p className="text-xs text-gray-500 mt-1">Riwayat pemesanan</p>
              </div>
              <div className="w-14 h-14 bg-[#8b6a4f] bg-opacity-10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#8b6a4f]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status Akun</p>
                <p className="text-xl font-bold text-[#6d503b] capitalize">
                  {user?.peran || 'User'}
                </p>
                <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
              </div>
              <div className="w-14 h-14 bg-[#c4a574] bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#c4a574]" fill="currentColor" viewBox="0 0 20 20">
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
              onClick={() => {
                setActiveTab("profile");
                setIsEditing(false);
              }}
              className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                activeTab === "profile"
                  ? "text-[#6d503b] border-b-2 border-[#6d503b] bg-gray-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Profil Saya
            </button>
            <button
              onClick={() => {
                setActiveTab("orders");
                setIsEditing(false);
                setCurrentPage(1);
              }}
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
                {!isEditing && (
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={handleEditClick}
                      className="flex items-center gap-2 px-4 py-2 bg-[#6d503b] text-white rounded-lg hover:bg-[#5c4033] transition font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profil
                    </button>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6d503b] focus:border-[#6d503b]"
                        placeholder="Masukkan username"
                      />
                    ) : (
                      <p className="text-gray-900 font-semibold px-4 py-2 bg-gray-50 rounded-lg">
                        {user?.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6d503b] focus:border-[#6d503b]"
                        placeholder="email@example.com"
                      />
                    ) : (
                      <p className="text-gray-900 font-semibold px-4 py-2 bg-gray-50 rounded-lg">
                        {user?.email}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.nama_lengkap}
                        onChange={(e) => setEditForm({...editForm, nama_lengkap: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6d503b] focus:border-[#6d503b]"
                        placeholder="Masukkan nama lengkap"
                      />
                    ) : (
                      <p className="text-gray-900 font-semibold px-4 py-2 bg-gray-50 rounded-lg">
                        {user?.nama_lengkap || "-"}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.no_telp}
                        onChange={(e) => setEditForm({...editForm, no_telp: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6d503b] focus:border-[#6d503b]"
                        placeholder="Masukkan nomor telepon"
                      />
                    ) : (
                      <p className="text-gray-900 font-semibold px-4 py-2 bg-gray-50 rounded-lg">
                        {user?.no_telp || "-"}
                      </p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saveLoading}
                      className="flex-1 sm:flex-none px-6 py-3 bg-[#6d503b] text-white rounded-lg hover:bg-[#5c4033] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saveLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Simpan Perubahan
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={saveLoading}
                      className="flex-1 sm:flex-none px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold disabled:opacity-50"
                    >
                      Batal
                    </button>
                  </div>
                )}
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
                ) : totalOrders > 0 ? (
                  <div>
                    <div className="space-y-4 mb-6">
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
                              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mb-3">
                                <span className="font-medium">Catatan:</span> {order.catatan}
                              </p>
                            )}

                            <button
                              onClick={() => handleViewDetail(order)}
                              className="w-full mt-2 px-4 py-2 bg-[#6d503b] text-white rounded-lg hover:bg-[#5c4033] transition text-sm font-medium flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Lihat Detail
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          Menampilkan {((currentPage - 1) * ordersPerPage) + 1} - {Math.min(currentPage * ordersPerPage, totalOrders)} dari {totalOrders} pesanan
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>

                          <div className="flex gap-1">
                            {getPaginationRange().map((page, index) => (
                              page === '...' ? (
                                <span key={`dots-${index}`} className="px-3 py-2 text-gray-500">
                                  ...
                                </span>
                              ) : (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`px-3 py-2 rounded-lg transition ${
                                    currentPage === page
                                      ? 'bg-[#6d503b] text-white font-semibold'
                                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  {page}
                                </button>
                              )
                            ))}
                          </div>

                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
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

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#6d503b] text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Detail Pesanan #{selectedOrder.id}</h2>
                  <p className="text-sm opacity-90">
                    {new Date(selectedOrder.created_at).toLocaleString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Status Section */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Status</h3>
                <div className="flex gap-3">
                  {(() => {
                    const statusBadge = getStatusBadge(selectedOrder.status_pesanan);
                    const paymentBadge = getPaymentStatusBadge(selectedOrder.status_pembayaran);
                    return (
                      <>
                        <span className={`${statusBadge.bg} ${statusBadge.text} px-3 py-1.5 rounded-full text-sm font-medium`}>
                          {statusBadge.label}
                        </span>
                        <span className={`${paymentBadge.bg} ${paymentBadge.text} px-3 py-1.5 rounded-full text-sm font-medium`}>
                          {paymentBadge.label}
                        </span>
                      </>
                    );
                  })()}
                </div>
                {selectedOrder.catatan && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-900">
                      <span className="font-semibold">Catatan:</span> {selectedOrder.catatan}
                    </p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Item Pesanan</h3>
                <div className="space-y-3">
                  {selectedOrder.detail_pesanan?.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.menu?.gambar ? (
                          <img 
                            src={item.menu.gambar} 
                            alt={item.menu.nama_menu}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {item.menu?.nama_menu || 'Menu tidak tersedia'}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Rp {Math.round(item.harga_satuan).toLocaleString('id-ID')} × {item.jumlah}
                        </p>
                        {item.diskon > 0 && (
                          <p className="text-sm text-green-600 font-medium mt-1">
                            Diskon: -Rp {Math.round(item.diskon).toLocaleString('id-ID')}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {item.diskon > 0 ? (
                          <>
                            <p className="text-sm text-gray-500 line-through">
                              Rp {Math.round(item.subtotal).toLocaleString('id-ID')}
                            </p>
                            <p className="font-bold text-[#6d503b]">
                              Rp {Math.round(item.subtotal_setelah_diskon).toLocaleString('id-ID')}
                            </p>
                          </>
                        ) : (
                          <p className="font-bold text-[#6d503b]">
                            Rp {Math.round(item.subtotal).toLocaleString('id-ID')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Ringkasan Pembayaran</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      Rp {Math.round(selectedOrder.ringkasan?.subtotal_sebelum_diskon || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                  
                  {selectedOrder.ringkasan?.total_diskon > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Total Diskon</span>
                      <span className="font-semibold text-green-600">
                        -Rp {Math.round(selectedOrder.ringkasan.total_diskon).toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-300">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total Bayar</span>
                      <span className="text-2xl font-bold text-[#6d503b]">
                        Rp {Math.round(selectedOrder.total_harga).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">Informasi Pesanan</p>
                      <p>Nomor Meja: <span className="font-semibold">#{selectedOrder.nomor_meja}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-xl border-t border-gray-200">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full bg-[#6d503b] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#5c4033] transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}