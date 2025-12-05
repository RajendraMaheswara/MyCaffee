import React, { useState, useEffect, useMemo, useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import axios from 'axios';
import { 
  LayoutDashboard, 
  History, 
  LogOut, 
  Coffee, 
  Printer, 
  X, 
  ChefHat, 
  CreditCard, 
  CheckCircle,
  ArrowLeft,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';

// --- KONFIGURASI API ---
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// --- HELPER FUNCTIONS ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// --- COMPONENTS ---

const Sidebar = ({ activePage, navigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'Riwayat Pesanan', icon: History }, 
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-stone-200 flex flex-col z-10 hidden md:flex">
      <div className="p-6 flex items-center gap-3 border-b border-stone-100">
        <div className="w-10 h-10 bg-[#5D4037] rounded-full flex items-center justify-center text-white font-bold text-xl font-serif">
          J
        </div>
        <div>
          <h1 className="font-serif font-bold text-stone-800 text-lg leading-tight">Jagongan Coffee</h1>
          <p className="text-xs text-stone-500">Kasir Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activePage === item.id || (activePage === 'detail' && item.id === 'dashboard')
                ? 'bg-[#5D4037] text-white'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-stone-100">
        <button className="w-full flex items-center justify-center gap-2 bg-[#8D6E63] hover:bg-[#795548] text-white px-4 py-2 rounded-lg text-sm transition-colors">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

const ReceiptModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 flex justify-between items-center border-b border-stone-100">
          <h3 className="font-serif text-lg font-bold text-stone-800">Struk Pembelian</h3>
          <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded-full transition-colors">
            <X size={20} className="text-stone-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 bg-stone-50">
          <div className="bg-white p-6 shadow-sm border border-stone-200 font-mono text-xs sm:text-sm text-stone-800 leading-relaxed">
            <div className="text-center mb-4">
              <p className="font-bold">================================</p>
              <p className="font-bold text-lg my-1">JAGONGAN COFFEE</p>
              <p className="font-bold">================================</p>
              <p>Jl. Jogoripon, Jaranan</p>
              <p>Bantul, Yogyakarta</p>
              <br />
              <p>Date: {new Date().toLocaleDateString('id-ID')}</p>
              <p>Time: {new Date().toLocaleTimeString('id-ID')}</p>
              <p>================================</p>
            </div>

            <div className="mb-4">
              <p>Order ID: #{order.id}</p>
              <p>Meja: {order.tableNumber}</p>
              <p>Pelanggan: {order.customerName}</p>
              <p>================================</p>
            </div>

            <div className="mb-4 space-y-2">
              {order.items && order.items.map((item, idx) => (
                <div key={idx}>
                  <p className="font-bold">{item.name}</p>
                  <div className="flex justify-between">
                    <span>{item.quantity} x {formatCurrency(item.price)}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                  {item.note && <p className="text-[10px] italic text-stone-500">Note: {item.note}</p>}
                </div>
              ))}
            </div>

            <div className="mb-4">
              <p>================================</p>
              <div className="flex justify-between font-bold">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.stampDiscount > 0 && (
                <div className="flex justify-between">
                    <span>Potongan Stamp:</span>
                    <span className="font-medium">-{formatCurrency(order.stampDiscount)}</span>
                </div>
              )}
              <p className="border-b border-dashed border-stone-400 my-2"></p>
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              <p>================================</p>
            </div>

            <div className="text-center mt-6">
              <p>Terima kasih atas kunjungan Anda!</p>
              <p>Enjoy Your Coffee</p>
              <p>================================</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-stone-100 bg-white">
          <button 
            onClick={() => alert("Printing...")}
            className="w-full bg-[#5D4037] hover:bg-[#4E342E] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Printer size={18} />
            Print Struk
          </button>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ type, status }) => {
  const styles = {
    status: {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-orange-100 text-orange-800 border-orange-200", 
      diproses: "bg-orange-100 text-orange-800 border-orange-200", 
      delivered: "bg-blue-100 text-blue-800 border-blue-200",
      diantar: "bg-blue-100 text-blue-800 border-blue-200", 
      completed: "bg-green-100 text-green-800 border-green-200", 
      selesai: "bg-green-100 text-green-800 border-green-200", 
    },
    payment: {
      unpaid: "bg-red-100 text-red-800 border-red-200",
      belum_dibayar: "bg-red-100 text-red-800 border-red-200",
      paid: "bg-green-100 text-green-800 border-green-200",
      sudah_bayar: "bg-green-100 text-green-800 border-green-200",
      lunas: "bg-green-100 text-green-800 border-green-200",
    }
  };

  const normalizedStatus = status ? status.toLowerCase().replace(' ', '_') : 'pending';
  
  let Icon = Clock;
  if (['processing', 'diproses'].includes(normalizedStatus)) Icon = ChefHat;
  if (['delivered', 'diantar'].includes(normalizedStatus)) Icon = Coffee;
  if (['completed', 'selesai', 'paid', 'lunas', 'sudah_bayar'].includes(normalizedStatus)) Icon = CheckCircle;
  if (['unpaid', 'belum_dibayar'].includes(normalizedStatus)) Icon = X;

  const currentStyle = styles[type][normalizedStatus] || "bg-gray-100 text-gray-800";
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${currentStyle} capitalize`}>
      <Icon size={14} className="mr-1"/>
      {status || '-'}
    </span>
  );
};

// --- MAIN PAGE ---

export default function KasirDashboard() {
  const { user: kasirUser } = useContext(AuthContext);
  const [activePage, setActivePage] = useState('dashboard');
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  // --- API MAPPING CONFIGURATION ---
  const mapBackendToFrontend = (backendData) => {
    return backendData.map(item => {
      const items = (item.details || item.detail_pesanan || []).map(d => ({
          id: d.id,
          name: d.menu ? d.menu.nama_menu : (d.nama_menu || "Item Menu"),
          price: parseFloat(d.harga_satuan || d.price || 0),
          quantity: parseInt(d.jumlah || d.quantity || 1),
          note: d.catatan || ""
      }));

      const subtotal = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
      const tax = 0; // Pajak dihilangkan sesuai permintaan
      const stampDiscount = parseFloat(item.redeem_value || item.potongan_stamp || 0);
      
      // Backend `total_harga` bisa jadi sudah final setelah diskon, jadi kita prioritaskan itu.
      // Jika tidak ada, hitung manual.
      const total = item.total_harga && item.redeem_value ? parseFloat(item.total_harga) : subtotal - stampDiscount;

      return {
        id: item.id,
        tableNumber: item.nomor_meja || item.no_meja || item.table_number || "-",
        customerName: item.nama_pelanggan || (item.user ? item.user.name : "Pelanggan Umum"),
        date: item.created_at ? item.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        time: item.created_at ? new Date(item.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : "-",
        status: item.status_pesanan || item.status || 'pending',
        paymentStatus: item.status_pembayaran || item.payment_status || 'unpaid',
        note: item.catatan,
        items: items,
        subtotal: subtotal, // Subtotal asli
        tax: tax,
        stampDiscount: stampDiscount,
        total: total, // Total akhir, sudah dikurangi diskon jika ada
        kasirId: item.kasir_id,
        kasirName: item.kasir ? item.kasir.name : 'N/A'
      }
    });
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/pesanan`);
      const resourceData = response.data.data; 

      let itemsArray = [];
      if (resourceData && Array.isArray(resourceData.data)) {
         itemsArray = resourceData.data; 
      } else if (Array.isArray(resourceData)) {
         itemsArray = resourceData; 
      } else {
         itemsArray = [];
      }

      const mappedData = mapBackendToFrontend(itemsArray);
      setOrders(mappedData);
      setError(null);

    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Gagal menghubungi server. Cek koneksi backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- ACTIONS (FIXED: SEND FULL PAYLOAD) ---

  const handleUpdateStatus = async (id, newStatus) => {
    // 1. Ambil data pesanan saat ini (karena backend butuh semua data)
    const currentOrder = orders.find(o => o.id === id);
    if (!currentOrder) return;

    const tableNum = parseInt(currentOrder.tableNumber);
    if (isNaN(tableNum)) {
        alert("Gagal memperbarui: Nomor meja tidak valid.");
        return;
    }

    // Mapping Status Frontend -> Backend
    const statusMapping = {
        'delivered': 'diantar', 
        'processing': 'diproses',
    };
    const payloadStatus = statusMapping[newStatus] || newStatus;

    // Mapping Payment Frontend -> Backend
    const paymentMappingReverse = {
        'unpaid': 'belum_dibayar',
        'paid': 'lunas',
        'lunas': 'lunas',
        'belum_dibayar': 'belum_dibayar',
        'sudah_bayar': 'lunas'
    };
    // Pastikan kita mengirim format yang benar untuk payment juga
    const currentPaymentBackend = paymentMappingReverse[currentOrder.paymentStatus.toLowerCase()] || currentOrder.paymentStatus;

    // Payload Lengkap sesuai permintaan backend update()
    const fullPayload = {
        nomor_meja: tableNum, // Wajib Integer
        total_harga: currentOrder.total,                // Wajib Numeric
        status_pesanan: payloadStatus,                  // Yang kita ubah
        status_pembayaran: currentPaymentBackend,       // Harus dikirim ulang
        catatan: currentOrder.note || '-'
    };

    try {
      console.log(`Mengirim payload lengkap ke /pesanan/${id}:`, fullPayload);
      
      await axios.put(`${API_BASE_URL}/pesanan/${id}`, fullPayload);
      
      await fetchOrders(); 
      alert("Berhasil update status!");

    } catch (err) {
      console.error("Backend Error Full:", err.response);

      let errorMessage = "Terjadi kesalahan pada server.";
      let errorDetail = "";

      if (err.response) {
          if (err.response.status === 422) {
              const validationErrors = err.response.data.errors; // Standard Laravel error bag
              // Jika format error Laravel Resource: { errors: { field: [msg] } }
              if (!validationErrors && err.response.data) {
                 // Coba akses langsung jika format beda
                 errorDetail = JSON.stringify(err.response.data);
              } else if (validationErrors) {
                 errorDetail = Object.entries(validationErrors)
                    .map(([field, msgs]) => `- ${field}: ${msgs.join(', ')}`)
                    .join('\n');
              }
              errorMessage = "Backend menolak data (Validasi Gagal).";
          } else {
              errorMessage = `Error ${err.response.status}: ${err.response.statusText}`;
          }
      }

      alert(`${errorMessage}\n\nDetail:\n${errorDetail}`);
      fetchOrders(); 
    }
  };

  const handleUpdatePayment = async (id, newPaymentStatus) => {
    const currentOrder = orders.find(o => o.id === id);
    if (!currentOrder) return;

    const tableNum = parseInt(currentOrder.tableNumber);
    if (isNaN(tableNum)) {
        alert("Gagal memperbarui: Nomor meja tidak valid.");
        return;
    }

    const paymentMapping = {
        'paid': 'lunas', 
        'lunas': 'lunas',
        'unpaid': 'belum_dibayar'
    };
    const payloadPayment = paymentMapping[newPaymentStatus] || newPaymentStatus;

    // Reverse mapping for status_pesanan (harus dikirim juga)
    const statusMappingReverse = {
        'processing': 'diproses',
        'diproses': 'diproses',
        'delivered': 'diantar',
        'diantar': 'diantar'
    };
    // Fallback ke raw status jika mapping tidak ketemu
    const currentStatusBackend = statusMappingReverse[currentOrder.status.toLowerCase()] || 'diproses'; 

    // Tambahkan tanggal pembayaran saat lunas
    const paymentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const fullPayload = {
        nomor_meja: tableNum,
        total_harga: currentOrder.total,
        status_pesanan: currentStatusBackend, // Kirim ulang status yang ada
        status_pembayaran: payloadPayment,    // Yang kita ubah
        tanggal_pembayaran: paymentDate,      // Tambahan
        kasir_id: kasirUser ? kasirUser.id : null,
        catatan: currentOrder.note || '-'
    };

    try {
      console.log(`Mengirim payload lengkap ke /pesanan/${id}:`, fullPayload);
      await axios.put(`${API_BASE_URL}/pesanan/${id}`, fullPayload);

      await fetchOrders();
      alert("Berhasil update pembayaran! Pesanan telah lunas.");
      // handleNavigate('history'); // Dihapus agar tetap di halaman detail

    } catch (err) {
      console.error("Backend Error Full:", err.response);
      let errorDetail = "";
      if (err.response?.data?.errors) {
         errorDetail = JSON.stringify(err.response.data.errors);
      } else if (err.response?.data) {
         errorDetail = JSON.stringify(err.response.data);
      }
      alert(`Gagal update pembayaran!\nDetail: ${errorDetail}`);
      fetchOrders();
    }
  };

  // --- STATISTIK ---
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayOrders = orders.filter(o => o.date === todayStr); 
    
    return {
      totalToday: todayOrders.length,
              processing: orders.filter(o => ['pending', 'processing', 'diproses'].includes(o.status.toLowerCase())).length,      unpaid: orders.filter(o => ['unpaid', 'belum_dibayar'].includes(o.paymentStatus.toLowerCase().replace(' ', '_'))).length,
      revenue: todayOrders.reduce((acc, curr) => acc + curr.total, 0)
    };
  }, [orders]);

  // NAVIGATION
  const handleNavigate = (page, orderId = null) => {
    setActivePage(page);
    if (orderId) setSelectedOrderId(orderId);
  };

  const handleBack = (currentOrder) => {
    const payment = currentOrder?.paymentStatus?.toLowerCase().replace(' ', '_');
    if (['paid', 'lunas', 'sudah_bayar'].includes(payment)) {
        setActivePage('history');
    } else {
        setActivePage('dashboard');
    }
  };

  // --- RENDERING SUB-COMPONENTS ---

  const renderOrderList = (isHistory = false) => {
    const filteredOrders = orders.filter(o => {
      const p = o.paymentStatus.toLowerCase().replace(' ', '_');
      const isPaid = ['paid', 'lunas', 'sudah_bayar'].includes(p);
      return isHistory ? isPaid : !isPaid;
    });

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-stone-100">
          <Loader2 className="animate-spin text-[#5D4037] mb-2" size={32} />
          <p className="text-stone-500">Mengambil data...</p>
        </div>
      );
    }

    if (error && filteredOrders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 bg-red-50 rounded-xl border border-red-100 text-red-600">
              <AlertCircle size={32} className="mb-2" />
              <p>{error}</p>
              <button onClick={fetchOrders} className="mt-4 px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100">Coba Lagi</button>
            </div>
        );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden animate-in fade-in duration-500">
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-white">
             <div>
                <h3 className="font-serif font-bold text-lg text-stone-800">
                    {isHistory ? "Riwayat Pesanan Lunas" : "Pesanan Belum Dibayar"}
                </h3>
                <p className="text-sm text-stone-500">
                    {isHistory ? "Arsip pesanan yang telah lunas" : "Pesanan yang menunggu pembayaran"}
                </p>
             </div>
             {isHistory && (
                 <button onClick={() => handleNavigate('dashboard')} className="text-sm text-[#8D6E63] hover:underline">
                     Kembali ke Dashboard
                 </button>
             )}
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  <th className="p-4 text-xs font-bold text-stone-500 uppercase tracking-wider">ID</th>
                  <th className="p-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Meja</th>
                  <th className="p-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Waktu</th>
                  <th className="p-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Total</th>
                  <th className="p-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Pembayaran</th>
                  <th className="p-4 text-xs font-bold text-stone-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-stone-400 italic">
                      {isHistory ? "Belum ada riwayat pesanan selesai." : "Tidak ada pesanan aktif saat ini."}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4 font-medium text-stone-800">#{order.id}</td>
                      <td className="p-4">
                        <span className="bg-[#5D4037] text-white text-xs font-bold px-2 py-1 rounded-full">
                          {order.tableNumber}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-stone-600">
                        {order.time}
                      </td>
                      <td className="p-4 font-bold text-stone-800">{formatCurrency(order.total)}</td>
                      <td className="p-4"><StatusBadge type="status" status={order.status} /></td>
                      <td className="p-4"><StatusBadge type="payment" status={order.paymentStatus} /></td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleNavigate('detail', order.id)}
                              className="bg-[#5D4037] text-white px-3 py-2 rounded-md text-xs hover:bg-[#4E342E] transition-colors shadow-sm"
                            >
                              Detail
                            </button>
                            {!isHistory && ['processing', 'diproses'].includes(order.status.toLowerCase()) && (
                                <button
                                    onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                                >
                                    <Coffee size={14} />
                                    <span>Antar</span>
                                </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="mb-6">
        <h2 className="text-3xl font-serif font-bold text-stone-800">Dashboard Kasir</h2>
        <p className="text-stone-500">Halo, selamat bertugas! Kelola pesanan pelanggan di sini.</p>
      </div>

      {/* STATISTIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start mb-2">
            <p className="text-stone-500 text-xs uppercase font-bold">Total Order</p>
            <LayoutDashboard size={20} className="text-blue-500"/>
          </div>
          <h3 className="text-2xl font-bold font-serif text-stone-800">{stats.totalToday}</h3>
          <p className="text-xs text-stone-400">Hari ini</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100 border-l-4 border-l-orange-400">
          <div className="flex justify-between items-start mb-2">
            <p className="text-stone-500 text-xs uppercase font-bold">Diproses</p>
            <ChefHat size={20} className="text-orange-400"/>
          </div>
          <h3 className="text-2xl font-bold font-serif text-stone-800">{stats.processing}</h3>
          <p className="text-xs text-stone-400">Perlu tindakan</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100 border-l-4 border-l-red-500">
          <div className="flex justify-between items-start mb-2">
            <p className="text-stone-500 text-xs uppercase font-bold">Unpaid</p>
            <CreditCard size={20} className="text-red-500"/>
          </div>
          <h3 className="text-2xl font-bold font-serif text-stone-800">{stats.unpaid}</h3>
          <p className="text-xs text-stone-400">Belum lunas</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100 border-l-4 border-l-green-500">
          <div className="flex justify-between items-start mb-2">
            <p className="text-stone-500 text-xs uppercase font-bold">Omzet</p>
            <CheckCircle size={20} className="text-green-500"/>
          </div>
          <h3 className="text-lg font-bold font-serif text-stone-800 truncate">{formatCurrency(stats.revenue)}</h3>
          <p className="text-xs text-stone-400">Estimasi hari ini</p>
        </div>
      </div>

      <div>
        {renderOrderList(false)}
      </div>
    </div>
  );

  const renderHistory = () => (
      <div className="space-y-6 animate-in fade-in duration-500">
           <div className="mb-6">
            <h2 className="text-3xl font-serif font-bold text-stone-800">Riwayat Pesanan</h2>
            <p className="text-stone-500">Arsip pesanan yang sudah selesai dan lunas</p>
           </div>
           {renderOrderList(true)}
      </div>
  );

  const renderDetail = () => {
    const order = orders.find(o => o.id === selectedOrderId);
    if (!order) return <div className="p-8 text-center">Pesanan tidak ditemukan / loading...</div>;

    const statusLower = order.status.toLowerCase();
    const paymentLower = order.paymentStatus.toLowerCase();
    
    const isPaid = ['paid', 'lunas', 'sudah_bayar'].includes(paymentLower.replace(' ', '_')); 

    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-10">
        {/* HEADER DETAIL */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
             <button onClick={() => handleBack(order)} className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-50 text-[#5D4037]">
                <ArrowLeft size={20} />
             </button>
             <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800">Order #{order.id}</h2>
                <p className="text-stone-500 text-sm">Detail & Aksi</p>
             </div>
          </div>
          <button onClick={() => handleBack(order)} className="bg-[#8D6E63] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#795548] transition-colors">
            Kembali
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* INFO CARD */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
              <h3 className="font-serif text-xl font-bold text-stone-800 mb-6 border-b border-stone-100 pb-2">Informasi Meja</h3>
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#5D4037] rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-md">
                       {order.tableNumber}
                    </div>
                    <div>
                        <p className="text-xs text-stone-500 uppercase tracking-wide">Nomor Meja</p>
                        <p className="font-bold text-stone-800">{order.customerName}</p>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-stone-50 p-3 rounded-lg">
                        <p className="text-xs text-stone-500 mb-1">Tanggal</p>
                        <p className="font-medium text-stone-800 flex items-center gap-1">
                            {formatDate(order.date)}
                        </p>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-lg">
                        <p className="text-xs text-stone-500 mb-1">Jam Order</p>
                        <p className="font-medium text-stone-800 flex items-center gap-1">
                            <Clock size={14} className="text-stone-400"/> {order.time}
                        </p>
                    </div>
                 </div>
                 {order.kasirId && (
                    <div className="bg-stone-50 p-3 rounded-lg col-span-2 mt-4">
                        <p className="text-xs text-stone-500 mb-1 uppercase">Kasir Bertugas</p>
                        <p className="font-medium text-stone-800">
                            ID: {order.kasirId} ({order.kasirName})
                        </p>
                    </div>
                 )}
                 {order.note && order.note !== '-' && (
                    <div className="mt-6 pt-4 border-t border-stone-100">
                        <p className="text-xs text-stone-500 mb-2 uppercase">Catatan Pesanan</p>
                        <p className="text-sm text-stone-700 bg-yellow-50/50 p-3 rounded-lg border border-yellow-200/80">{order.note}</p>
                    </div>
                 )}
              </div>
           </div>

           {/* STATUS ACTIONS CARD */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
              <h3 className="font-serif text-xl font-bold text-stone-800 mb-6 border-b border-stone-100 pb-2">Status Pesanan</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div>
                    <p className="text-xs text-stone-500 mb-2 uppercase">Proses</p>
                    <StatusBadge type="status" status={order.status} />
                 </div>
                 <div>
                    <p className="text-xs text-stone-500 mb-2 uppercase">Pembayaran</p>
                    <StatusBadge type="payment" status={order.paymentStatus} />
                 </div>
              </div>
                 
              <div className="space-y-3">
                {['processing', 'diproses'].includes(statusLower) && (
                    <button 
                        onClick={() => handleUpdateStatus(order.id, 'delivered')} 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                        <Coffee size={18} /> Tandai Sudah Diantar
                    </button>
                )}

                {['unpaid', 'belum_dibayar'].includes(paymentLower.replace(' ', '_')) && (
                    <button 
                        onClick={() => handleUpdatePayment(order.id, 'paid')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                        <CreditCard size={18} /> Terima Pembayaran (Lunas)
                    </button>
                )}
                
                {isPaid && (
                    <div className="text-center text-sm text-green-700 bg-green-50 py-3 rounded-lg border border-green-200 font-medium flex items-center justify-center gap-2">
                        <CheckCircle size={16}/> Pesanan Sudah Lunas
                    </div>
                )}
              </div>
           </div>
        </div>

        {/* LIST ITEM */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
           <h3 className="font-serif text-xl font-bold text-stone-800 mb-6">Rincian Menu</h3>
           <div className="bg-stone-50 rounded-lg p-4 border border-stone-100">
              {order.items && order.items.length > 0 ? order.items.map((item, index) => (
                 <div key={index} className="flex justify-between items-start py-4 border-b border-stone-200 last:border-0 border-dashed">
                    <div className="flex items-start gap-4">
                       <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center text-stone-500 mt-1">
                          <Coffee size={16} />
                       </div>
                       <div>
                          <p className="font-bold text-stone-800 text-lg">{item.name}</p>
                          <p className="text-sm text-stone-500">{item.quantity} x {formatCurrency(item.price)}</p>
                          {item.note && (
                              <div className="mt-1 inline-block bg-yellow-50 text-yellow-800 text-xs px-2 py-1 rounded border border-yellow-100">
                                Catatan: {item.note}
                              </div>
                          )}
                       </div>
                    </div>
                    <p className="font-bold text-stone-800 text-lg">{formatCurrency(item.price * item.quantity)}</p>
                 </div>
              )) : (
                  <p className="text-center text-stone-500 italic py-4">Tidak ada item detail.</p>
              )}
           </div>
        </div>

        {/* PAYMENT SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
           <h3 className="font-serif text-xl font-bold text-stone-800 mb-6">Ringkasan Pembayaran</h3>
           <div className="space-y-3 text-stone-600">
              <div className="flex justify-between">
                 <span>Subtotal</span>
                 <span className="font-medium">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.stampDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                   <span>Potongan Stamp</span>
                   <span className="font-medium">-{formatCurrency(order.stampDiscount)}</span>
                </div>
              )}
              <div className="h-px bg-stone-200 my-4"></div>
              <div className="flex justify-between text-2xl font-bold text-stone-800">
                 <span>Total Bayar</span>
                 <span>{formatCurrency(order.total)}</span>
              </div>
           </div>

           <button 
             onClick={() => setShowReceipt(true)}
             className="w-full mt-8 bg-[#5D4037] hover:bg-[#4E342E] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-stone-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
           >
             <Printer size={22} /> Cetak Struk
           </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#FDFBF7]">
      <Sidebar activePage={activePage} navigate={handleNavigate} />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          {activePage === 'dashboard' && renderDashboard()}
          {activePage === 'history' && renderHistory()}
          {activePage === 'detail' && renderDetail()}
        </div>
      </main>

      {showReceipt && (
        <ReceiptModal 
          order={orders.find(o => o.id === selectedOrderId)} 
          onClose={() => setShowReceipt(false)} 
        />
      )}
    </div>
  );
}