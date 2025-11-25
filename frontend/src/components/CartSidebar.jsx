import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CartSidebar() {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const [tableNumber, setTableNumber] = useState(null);

  // Ambil nomor meja dari localStorage
  useEffect(() => {
    const savedTable = localStorage.getItem('table_number');
    if (savedTable) {
      setTableNumber(savedTable);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={closeCart}
      ></div>

      {/* Sidebar - Full width on mobile, 384px on desktop */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex justify-between items-center bg-[#6d503b] text-white">
          <h2 className="text-lg sm:text-xl font-bold">Keranjang Belanja</h2>
          <button
            onClick={closeCart}
            className="p-1 hover:bg-white/20 rounded-full transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="text-gray-300 text-6xl mb-4">🛒</div>
              <p className="text-gray-500 text-lg mb-2">Keranjang Kosong</p>
              <p className="text-gray-400 text-sm">Tambahkan menu favoritmu!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {/* Image */}
                  <img
                    src={item.gambar}
                    alt={item.nama_menu}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    {/* Title & Price */}
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                      {item.nama_menu}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      Rp {Math.round(item.harga).toLocaleString('id-ID')}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition"
                      >
                        <span className="text-sm sm:text-base">−</span>
                      </button>
                      <span className="text-sm sm:text-base font-semibold min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stok}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <span className="text-sm sm:text-base">+</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 p-1 self-start"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-white shadow-lg">
            <div className="flex justify-between mb-4 text-base sm:text-lg">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-[#6d503b] text-lg sm:text-xl">
                Rp {Math.round(getTotalPrice()).toLocaleString('id-ID')}
              </span>
            </div>
            <Link
              to={tableNumber ? `/checkout?table=${tableNumber}` : '/checkout'}
              onClick={closeCart}
              className="block w-full bg-[#6d503b] text-white text-center py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-[#5c4033] active:scale-95 transition-all"
            >
              Checkout ({cart.length} item)
            </Link>
          </div>
        )}
      </div>
    </>
  );
}