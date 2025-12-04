// pages/CheckoutPage.jsx
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
  
  const nomorMeja = searchParams.get('table');

  // Stamp states
  const [useStamp, setUseStamp] = useState(false);
  const [stampAmount, setStampAmount] = useState(0);
  const [redeemLoading, setRedeemLoading] = useState(false);

  // Final total after redeem (initial = subtotal)
  const [finalTotal, setFinalTotal] = useState(() => getTotalPrice());

  useEffect(() => {
    if (!nomorMeja) {
      alert("Nomor meja tidak ditemukan. Silakan scan QR Code meja Anda.");
      navigate("/");
    }
  }, [nomorMeja, navigate]);

  // Recompute final total when cart changes and no redeem applied
  useEffect(() => {
    setFinalTotal(getTotalPrice());
  }, [cart]);

  // helper: compute kopi total value and qty (case-insensitive kategori)
  const computeKopiTotals = () => {
    let value = 0;
    let qty = 0;
    for (const item of cart) {
      const kategori = (item.kategori || "").toString().toLowerCase();
      if (kategori === "kopi") {
        value += item.harga * item.quantity;
        qty += item.quantity;
      }
    }
    return { value, qty };
  };

  const handleCheckout = async () => {
    setLoading(true);
    
    try {
      // 1) Update stok di backend untuk setiap item (keep this existing behavior)
      for (const item of cart) {
        try {
          // Ambil data menu terbaru untuk mendapatkan stok saat ini
          const menuResponse = await api.get(`/api/menu/${item.id}`);
          const currentMenu = menuResponse.data.data;
          
          // Hitung stok baru
          const newStok = currentMenu.stok - item.quantity;
          
          // Update stok - kirim hanya field yang diperlukan
          await api.put(`/api/menu/${item.id}`, {
            nama_menu: currentMenu.nama_menu,
            deskripsi: currentMenu.deskripsi,
            harga: currentMenu.harga,
            stok: newStok,
            kategori: currentMenu.kategori
          });
          
        } catch (error) {
          console.error(`Gagal update stok untuk ${item.nama_menu}:`, error);
          alert(`Gagal update stok untuk ${item.nama_menu}`);
          throw error; // Stop checkout jika update stok gagal
        }
      }

      // 2) Buat pesanan (initial total = subtotal)
      const pesananResponse = await api.post('/api/pesanan', {
        user_id: user?.id || null,
        nomor_meja: parseInt(nomorMeja),
        total_harga: getTotalPrice(),
        status_pesanan: 'diproses',
        status_pembayaran: 'belum_dibayar',
        catatan: catatan || null
      });

      const pesananId = pesananResponse.data.data.id;

      // 3) Simpan detail pesanan (items) ke database -> harus dilakukan sebelum redeem
      for (const item of cart) {
        try {
          await api.post('/api/detail-pesanan', {
            pesanan_id: pesananId,
            menu_id: item.id,
            jumlah: item.quantity,
            harga_satuan: parseFloat(item.harga),
            subtotal: parseFloat(item.harga) * item.quantity
          });
        } catch (error) {
          console.error(`Gagal simpan detail pesanan untuk ${item.nama_menu}:`, error);
        }
      }

      // 4) Jika user memilih pakai stamp -> panggil endpoint redeem
      let finalPesanan = null;
      if (useStamp && user && stampAmount > 0) {
        try {
          setRedeemLoading(true);

          // call redeem endpoint (server akan validasi kelipatan/dibatasi)
          const redeemRes = await api.post(`/api/pesanan/${pesananId}/redeem-stamp`, {
            stamp_amount: stampAmount
          });

          // server returns updated pesanan in `pesanan`
          finalPesanan = redeemRes.data.pesanan ?? redeemRes.data.data?.pesanan ?? null;
          if (!finalPesanan) {
            // fallback: refetch pesanan
            const ref = await api.get(`/api/pesanan/${pesananId}`);
            finalPesanan = ref.data.data;
          }
        } catch (err) {
          // redeem gagal — beritahu user tapi lanjutkan (pesanan tetap tersimpan tanpa redeem)
          const msg = err?.response?.data?.message || "Gagal menggunakan stamp. Pesanan dibuat tanpa redeem.";
          alert(msg);
          finalPesanan = null;
        } finally {
          setRedeemLoading(false);
        }
      }

      // 5) Ambil pesanan akhir untuk disimpan ke localStorage (jika redeem sukses, gunakan data finalPesanan)
      let pesananData = null;
      if (finalPesanan) {
        pesananData = finalPesanan;
        setFinalTotal(parseFloat(finalPesanan.total_harga || getTotalPrice()));
      } else {
        // fetch current pesanan from server
        const fetchRes = await api.get(`/api/pesanan/${pesananId}`);
        pesananData = fetchRes.data.data;
        setFinalTotal(parseFloat(pesananData.total_harga || getTotalPrice()));
      }

      // 6) Simpan transaksi lokal untuk confirmation page
      const transaksi = {
        id: pesananId,
        nomor_meja: nomorMeja,
        catatan: catatan,
        items: cart.map(item => ({
          id_menu: item.id,
          nama_menu: item.nama_menu,
          quantity: item.quantity,
          harga: parseFloat(item.harga),
          gambar: item.gambar,
          kategori: item.kategori
        })),
        total_harga: parseFloat(pesananData.total_harga || getTotalPrice()),
        redeem_stamp: pesananData.redeem_stamp ?? false,
        redeem_stamp_amount: pesananData.redeem_stamp_amount ?? 0,
        redeem_value: pesananData.redeem_value ?? 0,
        status_pesanan: pesananData.status_pesanan || 'diproses',
        created_at: new Date().toISOString()
      };

      localStorage.setItem('current_transaction', JSON.stringify(transaksi));
      
      // 7) Bersihkan cart dan navigasi ke confirmation
      clearCart();
      navigate(`/confirmation/${pesananId}?table=${nomorMeja}`);
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Keranjang Kosong
          </h2>
          <p className="text-gray-600 mb-6">
            Belum ada item di keranjang Anda
          </p>
          <Link
            to={`/?table=${nomorMeja}`}
            className="inline-block bg-[#6d503b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5c4033] transition"
          >
            Kembali ke Menu
          </Link>
        </div>
      </div>
    );
  }

  // compute kopi quantities for UI guidance
  const { value: totalKopiValue, qty: totalKopiQty } = computeKopiTotals();
  const maxStampAllowed = totalKopiQty * 10;
  const userStamps = user?.total_stamp ?? 0;

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

          <div className="p-4 sm:p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan Pesanan (Opsional)
              </label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Contoh: Tidak pakai es, pedas sedang, extra sambal..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6d503b] focus:border-transparent text-base resize-none"
              ></textarea>
              <p className="text-xs text-gray-500 mt-2">
                💡 Catatan akan disampaikan ke dapur untuk pesanan Anda
              </p>
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
                    <img
                      src={item.gambar}
                      alt={item.nama_menu}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80/FFE4E6/FF6B6B?text=No+Image';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                        {item.nama_menu}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {item.quantity} x Rp {Math.round(item.harga).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-sm sm:text-base text-[#6d503b]">
                      Rp {Math.round(item.quantity * item.harga).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal */}
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between text-sm sm:text-base text-gray-700">
                <span>Subtotal ({cart.length} item)</span>
                <span>Rp {Math.round(getTotalPrice()).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base text-gray-700">
                <span>Pajak & Biaya Layanan</span>
                <span>Rp 0</span>
              </div>
            </div>

            {/* STAMP UI */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-800">Gunakan Stamp</p>
                  <p className="text-xs text-gray-500">Stamp dapat ditukarkan untuk diskon pada menu kategori Kopi</p>
                </div>
                <div className="text-sm text-gray-700 font-semibold">
                  {user ? `${user.total_stamp ?? 0} stamp` : "Harus login"}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useStamp}
                    onChange={(e) => {
                      setUseStamp(e.target.checked);
                      if (!e.target.checked) {
                        setStampAmount(0);
                        setFinalTotal(getTotalPrice());
                      }
                    }}
                    className="w-5 h-5"
                  />
                  <span className="text-sm text-gray-700">Pakai stamp</span>
                </label>

                {useStamp && (
                  <div className="flex-1">
                    <input
                      type="number"
                      min={10}
                      step={10}
                      value={stampAmount}
                      onChange={(e) => {
                        let v = parseInt(e.target.value || 0, 10);
                        if (Number.isNaN(v)) v = 0;
                        // clamp min 0
                        if (v < 0) v = 0;
                        setStampAmount(v);
                      }}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder={`Masukkan jumlah stamp (min 10, kelipatan 10). Max ${Math.min(userStamps, maxStampAllowed)} `}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max yang bisa digunakan untuk pesanan ini: {maxStampAllowed} stamp. Anda punya {userStamps} stamp.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                Total Pembayaran
              </span>
              <span className="text-xl sm:text-2xl font-bold text-green-600">
                Rp {Math.round(finalTotal).toLocaleString('id-ID')}
              </span>
            </div>

            {useStamp && stampAmount > 0 && (
              <div className="mt-3 text-sm text-gray-700">
                <p>Jika Anda klik Konfirmasi, sistem akan mencoba menggunakan <strong>{stampAmount} stamp</strong>. Jika redeem berhasil, diskon akan diterapkan (20.000 per 10 stamp, dibatasi oleh jumlah Kopi di keranjang).</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-800">
                Pesanan akan langsung dikirim ke <span className="font-bold">Meja #{nomorMeja}</span> setelah konfirmasi.
              </p>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={loading || (useStamp && redeemLoading)}
          className="w-full bg-[#6d503b] text-white py-4 px-6 rounded-xl font-bold text-base sm:text-lg hover:bg-[#5c4033] disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95 transition-all shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </span>
          ) : (
            `Konfirmasi Pesanan - Rp ${Math.round(finalTotal).toLocaleString('id-ID')}`
          )}
        </button>
      </div>
    </div>
  );
}