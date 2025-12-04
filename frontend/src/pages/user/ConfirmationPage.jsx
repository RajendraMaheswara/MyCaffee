// pages/ConfirmationPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";

export default function ConfirmationPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table');
  const [transaksi, setTransaksi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data dari localStorage
    const savedTransaction = localStorage.getItem('current_transaction');
    
    if (savedTransaction) {
      const data = JSON.parse(savedTransaction);
      
      // Verifikasi ID transaksi
      if (data.id === parseInt(id)) {
        setTransaksi(data);
      }
    }
    
    setLoading(false);
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6d503b] mx-auto mb-4"></div>
        <p className="text-gray-500">Memuat data...</p>
      </div>
    </div>
  );

  if (!transaksi) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">✕</div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Transaksi Tidak Ditemukan
        </h2>
        <p className="text-gray-600 mb-6">
          Maaf, data transaksi tidak dapat ditemukan.
        </p>
        <Link
          to={`/?table=${tableNumber}`}
          className="inline-block bg-[#6d503b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5c4033] transition"
        >
          Kembali ke Menu
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#6d503b] text-white py-6 px-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Konfirmasi Pesanan
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        {/* Success Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6 sm:p-8 text-center mb-6 shadow-lg">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">
            Pesanan Berhasil!
          </h2>
          <p className="text-green-700 text-sm sm:text-base">
            Pesanan Anda telah diterima dan sedang diproses
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-[#6d503b] text-white px-4 sm:px-6 py-4">
            <h3 className="text-lg sm:text-xl font-bold">Detail Pesanan</h3>
          </div>

          {/* Info Grid */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Nomor Pesanan</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  #{transaksi.id}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Nomor Meja</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  {transaksi.nomor_meja || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Status Pesanan</p>
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full capitalize">
                  {transaksi.status_pesanan || 'Menunggu'}
                </span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Pembayaran</p>
                <p className="text-base sm:text-lg font-bold text-green-600">
                  Rp {transaksi.total_harga ? Math.round(transaksi.total_harga).toLocaleString('id-ID') : '0'}
                </p>
              </div>
            </div>

            {transaksi.redeem_stamp && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">Redeem Stamp: <strong>{transaksi.redeem_stamp_amount}</strong></p>
                <p className="text-sm text-gray-700">Nilai Redeem: <strong>Rp {Math.round(transaksi.redeem_value).toLocaleString('id-ID')}</strong></p>
              </div>
            )}

            {transaksi.catatan && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Catatan</p>
                <p className="text-sm sm:text-base text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {transaksi.catatan}
                </p>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="p-4 sm:p-6">
            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
              Items Pesanan
            </h4>
            
            <div className="space-y-3">
              {transaksi.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
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
                      <h5 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 truncate">
                        {item.nama_menu}
                      </h5>
                      <p className="text-xs sm:text-sm text-gray-700 mt-1">
                        {item.quantity} x Rp {Math.round(item.harga_satuan).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm sm:text-base text-[#6d503b]">
                      Rp {Math.round(item.subtotal_setelah_diskon ?? item.subtotal).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-4 border-t-2 border-gray-300">
              <div className="flex justify-between items-center">
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  Total
                </span>
                <span className="text-xl sm:text-2xl font-bold text-green-600">
                  Rp {transaksi.total_harga ? Math.round(transaksi.total_harga).toLocaleString('id-ID') : '0'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm sm:text-base text-blue-800 font-medium">
                Silakan menunggu, pesanan Anda akan segera diantar ke meja {transaksi.nomor_meja || 'Anda'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/?table=${tableNumber}`}
            className="flex-1 bg-[#6d503b] text-white text-center py-3 sm:py-4 px-6 rounded-lg font-bold text-sm sm:text-base hover:bg-[#5c4033] active:scale-95 transition-all shadow-md"
          >
            Pesan Lagi
          </Link>
        </div>
      </div>
    </div>
  );
}