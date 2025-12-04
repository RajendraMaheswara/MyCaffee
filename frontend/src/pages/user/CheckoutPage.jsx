// src/pages/CheckoutPage.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthProvider";
import api from "../../api/axios";

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [catatan, setCatatan] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const nomorMeja = searchParams.get("table");

  // stamp UI
  const [useStamp, setUseStamp] = useState(false);
  const [stampAmount, setStampAmount] = useState(10);
  const [userTotalStamp, setUserTotalStamp] = useState(0);
  const [stampError, setStampError] = useState("");

  useEffect(() => {
    if (!nomorMeja) {
      alert("Nomor meja tidak ditemukan. Silakan scan QR Code meja Anda.");
      navigate("/");
    }
  }, [nomorMeja, navigate]);

  useEffect(() => {
    // ambil info stamp user (jika login)
    if (user) {
      setUserTotalStamp(user.total_stamp ?? 0);
    } else {
      setUserTotalStamp(0);
    }
  }, [user]);

  const validateStamp = () => {
    setStampError("");
    if (!useStamp) return true;
    if (!user) {
      setStampError("Anda harus login untuk memakai stamp.");
      return false;
    }
    const amt = Number(stampAmount || 0);
    if (!Number.isInteger(amt) || amt < 10 || amt % 10 !== 0) {
      setStampError("Stamp harus minimal 10 dan kelipatan 10.");
      return false;
    }
    if (amt > userTotalStamp) {
      setStampError("Stamp tidak cukup.");
      return false;
    }
    // cek maksimal stamp: 10 per item kopi — lakukan check di backend juga
    return true;
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Keranjang kosong.");
      return;
    }

    if (!validateStamp()) return;

    setLoading(true);

    try {
      // Prepare items payload
      const items = cart.map((c) => ({
        menu_id: c.id,
        jumlah: c.quantity,
        harga_satuan: Number(c.harga),
      }));

      // Request body
      const body = {
        user_id: user?.id || null,
        nomor_meja: parseInt(nomorMeja),
        catatan: catatan || null,
        status_pesanan: "diproses",
        status_pembayaran: "belum_dibayar",
        items: items,
        use_stamp: !!useStamp,
        stamp_amount: useStamp ? Number(stampAmount) : 0,
      };

      const res = await api.post("/api/checkout", body);

      if (res.data && res.data.success) {
        const pesanan = res.data.data;
        // Simpan transaksi lokal untuk confirmation page (mirip implementasi sebelumnya)
        const transaksi = {
          id: pesanan.id,
          nomor_meja: pesanan.nomor_meja,
          catatan: pesanan.catatan,
          items: pesanan.detail_pesanan?.map((d) => ({
            id_menu: d.menu_id,
            nama_menu: d.menu?.nama_menu ?? d.menu_id,
            quantity: d.jumlah,
            harga_satuan: Number(d.harga_satuan),
            subtotal: Number(d.subtotal_setelah_diskon ?? d.subtotal),
            gambar: d.menu?.gambar ?? null,
          })),
          total_harga: Number(pesanan.total_harga),
          status_pesanan: pesanan.status_pesanan,
          created_at: pesanan.created_at,
        };

        localStorage.setItem("current_transaction", JSON.stringify(transaksi));

        clearCart();
        navigate(`/confirmation/${pesanan.id}?table=${nomorMeja}`);
      } else {
        alert("Checkout gagal: " + (res.data?.message ?? "Unknown"));
      }
    } catch (err) {
      console.error("Checkout error:", err);
      const msg = err?.response?.data?.message || "Checkout gagal. Silakan coba lagi.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Keranjang Kosong</h2>
          <p className="text-gray-600 mb-6">Belum ada item di keranjang Anda</p>
          <Link to={`/?table=${nomorMeja}`} className="inline-block bg-[#6d503b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5c4033] transition">
            Kembali ke Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#6d503b] text-white py-6 px-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to={`/?table=${nomorMeja}`} className="text-white hover:text-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">Checkout</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Table Info Card */}
        <div className="bg-gradient-to-r from-[#6d503b] to-[#8b6a4f] text-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Nomor Meja</p>
              <p className="text-3xl sm:text-4xl font-bold">#{nomorMeja}</p>
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="bg-[#6d503b] text-white px-4 sm:px-6 py-4">
            <h3 className="text-lg sm:text-xl font-bold">Informasi Pesanan</h3>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Pesanan (Opsional)</label>
              <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Contoh: Tidak pakai es, pedas sedang..." rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6d503b]"></textarea>
              <p className="text-xs text-gray-500 mt-2">Catatan akan disampaikan ke dapur untuk pesanan Anda</p>
            </div>

            {/* Stamp option */}
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Gunakan Stamp</p>
                  <p className="text-xs text-gray-500">10 stamp = Rp 20.000 (hanya untuk kategori Kopi)</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={useStamp} onChange={(e) => setUseStamp(e.target.checked)} />
                  <span></span>
                </label>
              </div>

              {useStamp && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-600">Stamp tersedia: <span className="font-semibold">{userTotalStamp}</span></p>
                  <div className="flex items-center gap-2">
                    <input type="number" min="10" step="10" value={stampAmount} onChange={(e) => setStampAmount(e.target.value)} className="w-40 px-3 py-2 border rounded-lg" />
                    <button onClick={() => setStampAmount(10)} className="px-3 py-2 bg-gray-100 rounded">10</button>
                    <button onClick={() => setStampAmount(20)} className="px-3 py-2 bg-gray-100 rounded">20</button>
                    <button onClick={() => setStampAmount(userTotalStamp)} className="px-3 py-2 bg-gray-100 rounded">Max</button>
                  </div>
                  {stampError && <p className="text-sm text-red-600">{stampError}</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cart Items Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="bg-[#6d503b] text-white px-4 sm:px-6 py-4">
            <h3 className="text-lg sm:text-xl font-bold">Ringkasan Pesanan</h3>
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex gap-3 flex-1 min-w-0">
                    <img src={item.gambar} alt={item.nama_menu} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" onError={(e)=>{e.target.src='https://via.placeholder.com/80'}} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">{item.nama_menu}</h3>
                      <p className="text-xs text-gray-600">{item.quantity} x Rp {Math.round(item.harga).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-sm text-[#6d503b]">Rp {Math.round(item.quantity * item.harga).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal */}
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Subtotal ({cart.length} item)</span>
                <span>Rp {Math.round(getTotalPrice()).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Pajak & Biaya Layanan</span>
                <span>Rp 0</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold text-gray-900">Total Pembayaran</span>
              <span className="text-xl font-bold text-green-600">Rp {Math.round(getTotalPrice()).toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button onClick={handleCheckout} disabled={loading} className="w-full bg-[#6d503b] text-white py-4 px-6 rounded-xl font-bold text-base hover:bg-[#5c4033] disabled:bg-gray-400">
          {loading ? "Memproses..." : `Konfirmasi Pesanan - Rp ${Math.round(getTotalPrice()).toLocaleString('id-ID')}`}
        </button>
      </div>
    </div>
  );
}
