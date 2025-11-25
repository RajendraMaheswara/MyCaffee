import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import api from "../../api/axios";

export default function MenuDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableNumber = searchParams.get('table');
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart, openCart } = useCart();

  // Simpan dan ambil nomor meja dari localStorage
  useEffect(() => {
    if (tableNumber) {
      localStorage.setItem('table_number', tableNumber);
    } else {
      const savedTable = localStorage.getItem('table_number');
      if (savedTable) {
        navigate(`/menu/${id}/?table=${savedTable}`, { replace: true });
      }
    }
  }, [tableNumber, id, navigate]);

  useEffect(() => {
    api
      .get(`/api/menu/${id}`)
      .then((res) => {
        setMenu(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);
  
  const incrementQuantity = () => {
    if (quantity < menu.stok) setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    addToCart(menu, quantity);
    openCart();
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6d503b]"></div>
    </div>
  );
  
  if (!menu) return (
    <div className="text-center py-16 px-4">
      <p className="text-red-500 mb-4">Menu tidak ditemukan</p>
      <Link to={tableNumber ? `/?table=${tableNumber}` : "/"} className="text-[#6d503b] underline">Kembali ke Menu</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation - Sticky on mobile */}
      <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 sm:py-4">
        <Link
          to={tableNumber ? `/?table=${tableNumber}` : "/"}
          className="inline-flex items-center text-[#6d503b] hover:text-[#5c4033] font-medium text-sm sm:text-base"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </Link>
      </nav>

      {/* Content */}
      <div className="bg-white">
        {/* Image - Full width on mobile */}
        <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-200">
          <img
            src={menu.gambar}
            alt={menu.nama_menu}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x600/FFE4E6/FF6B6B?text=No+Image';
            }}
          />
        </div>

        {/* Details */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* Category */}
          <span className="inline-block bg-[#6d503b] text-white text-xs sm:text-sm font-medium px-3 py-1 rounded-full mb-3">
            {menu.kategori}
          </span>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {menu.nama_menu}
          </h1>

          {/* Description */}
          <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6">
            {menu.deskripsi || "Tidak ada deskripsi tersedia."}
          </p>

          {/* Price & Stock */}
          <div className="mb-6 sm:mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#6d503b]">
                Rp {menu.harga ? Math.round(menu.harga).toLocaleString('id-ID') : '0'}
              </span>
              <span className={`text-sm sm:text-base font-semibold px-3 py-1 rounded-full ${
                menu.stok > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {menu.stok > 0 ? `Stok: ${menu.stok}` : 'Habis'}
              </span>
            </div>
          </div>

          {/* Quantity Selector - Mobile Optimized */}
          {menu.stok > 0 && (
            <div className="mb-6">
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
                Jumlah Pesanan
              </label>
              <div className="flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <span className="text-base sm:text-lg font-semibold">−</span>
                </button>
                <span className="text-xl sm:text-2xl font-bold min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= menu.stok}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <span className="text-base sm:text-lg font-semibold">+</span>
                </button>
              </div>
              <p className="text-center sm:text-left text-xs sm:text-sm text-gray-500 mt-3">
                Maksimal: {menu.stok} item
              </p>
            </div>
          )}

          {/* Add to Cart Button - Fixed on mobile */}
          <div className="fixed sm:static bottom-0 left-0 right-0 p-4 bg-white border-t sm:border-0 shadow-lg sm:shadow-none">
            <button
              onClick={handleAddToCart}
              disabled={menu.stok <= 0}
              className={`w-full py-4 sm:py-3 px-6 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all ${
                menu.stok > 0
                  ? 'bg-[#6d503b] text-white hover:bg-[#5c4033] active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {menu.stok > 0 ? (
                <>
                  <span className="block sm:inline">Tambah ke Keranjang</span>
                  <span className="block sm:inline sm:ml-2 text-sm sm:text-base">
                    - Rp {Math.round(menu.harga * quantity).toLocaleString('id-ID')}
                  </span>
                </>
              ) : (
                'Stok Habis'
              )}
            </button>
          </div>

          {/* Spacer for fixed button on mobile */}
          <div className="h-20 sm:hidden"></div>
        </div>
      </div>
    </div>
  );
}