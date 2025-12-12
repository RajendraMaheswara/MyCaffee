import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import api from "../../api/axios";

export default function MenuList() {
  const [menus, setMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableNumber = searchParams.get('table');
  // Cart context helpers
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    openCart,
    getTotalItems,
    getTotalPrice,
  } = useCart();
  
  // Filter & Sort States
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [categories, setCategories] = useState([]);
  // Helper: dapatkan item keranjang berdasarkan id menu
  const getCartItem = (menuId) => cart.find((c) => c.id === menuId);

  // Simpan dan ambil nomor meja dari localStorage
  useEffect(() => {
    if (tableNumber) {
      localStorage.setItem('table_number', tableNumber);
    } else {
      const savedTable = localStorage.getItem('table_number');
      if (savedTable) {
        navigate(`/?table=${savedTable}`, { replace: true });
      }
    }
  }, [tableNumber, navigate]);

  useEffect(() => {
    api.get("api/menu")
      .then((res) => {
        const menuData = res.data.data.data;
        setMenus(menuData);
        setFilteredMenus(menuData);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(menuData.map(m => m.kategori))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching menu:", err);
        setLoading(false);
      });
  }, []);

  // Apply Filter & Sort
  useEffect(() => {
    let result = [...menus];

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter(menu => selectedCategories.includes(menu.kategori));
    }

    // Sort
    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.nama_menu.localeCompare(b.nama_menu));
        break;
      case "name-desc":
        result.sort((a, b) => b.nama_menu.localeCompare(a.nama_menu));
        break;
      case "price-high":
        result.sort((a, b) => b.harga - a.harga);
        break;
      case "price-low":
        result.sort((a, b) => a.harga - b.harga);
        break;
      case "stock-high":
        result.sort((a, b) => b.stok - a.stok);
        break;
      case "stock-low":
        result.sort((a, b) => a.stok - b.stok);
        break;
      default:
        break;
    }

    setFilteredMenus(result);
  }, [selectedCategories, sortBy, menus]);

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSortBy("default");
  };

  const handleAddToCart = (menu) => {
    if (menu.stok > 0) {
      addToCart(menu, 1);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6d503b] mx-auto mb-4"></div>
        <p className="text-gray-500">Memuat menu...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#6d503b] text-white py-6 px-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
            MYCAFFEE
          </h1>
          {tableNumber && (
            <div className="text-center mt-3">
              <p className="text-sm sm:text-base opacity-90 mb-1">
                Anda sedang berada di
              </p>
              <p className="text-2xl sm:text-3xl font-bold">
                Meja #{tableNumber}
              </p>
            </div>
          )}
          {!tableNumber && (
            <p className="text-center text-sm sm:text-base opacity-90 mt-2">
              Selamat Datang
            </p>
          )}
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-[108px] sm:top-[124px] z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {/* Filter Button */}
              <button
                onClick={() => setShowFilterModal(true)}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="hidden sm:inline">Filter</span>
                {selectedCategories.length > 0 && (
                  <span className="bg-[#6d503b] text-white text-xs px-2 py-0.5 rounded-full">
                    {selectedCategories.length}
                  </span>
                )}
              </button>

              {/* Sort Button */}
              <button
                onClick={() => setShowSortModal(true)}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                <span className="hidden sm:inline">Urutkan</span>
              </button>

              {/* Clear Button */}
              {(selectedCategories.length > 0 || sortBy !== "default") && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#6d503b] text-white hover:bg-[#5c4033] rounded-lg transition text-sm font-medium relative"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
              </svg>
              <span className="hidden sm:inline">Keranjang</span>
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {filteredMenus.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-5xl sm:text-6xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
              Tidak Ada Menu
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              Coba ubah filter atau sortir yang Anda pilih.
            </p>
            <button
              onClick={clearFilters}
              className="text-[#6d503b] hover:underline font-medium"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {filteredMenus.map((menu) => (
              <div
                key={menu.id}
                className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="h-32 sm:h-40 md:h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={menu.gambar || 'https://via.placeholder.com/300x200/FFE4E6/FF6B6B?text=No+Image'}
                    alt={menu.nama_menu}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200/FFE4E6/FF6B6B?text=Error';
                    }}
                  />
                </div>
                
                {/* Content */}
                <div className="p-2 sm:p-3 md:p-4">
                  {/* Category Badge */}
                  <span className="inline-block bg-[#6d503b] text-white text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:py-1 rounded-full mb-1 sm:mb-2">
                    {menu.kategori || 'Umum'}
                  </span>

                  {/* Title */}
                  <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 line-clamp-1 mb-1 sm:mb-2">
                    {menu.nama_menu || 'Menu'}
                  </h3>
                  
                  {/* Description - Hidden on mobile */}
                  <p className="hidden sm:block text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
                    {menu.deskripsi || "Tidak ada deskripsi"}
                  </p>
                  
                  {/* Price & Stock */}
                  <div className="flex justify-between items-center mb-2 sm:mb-3">
                    <span className="font-bold text-sm sm:text-base md:text-lg text-[#6d503b]">
                      Rp {menu.harga ? Math.round(menu.harga).toLocaleString('id-ID') : '0'}
                    </span>
                    <span className={`text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded ${
                      (menu.stok > 0) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {menu.stok > 0 ? `${menu.stok}` : 'Habis'}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-2">
                    <div className="min-h-[52px] flex">
                      {(() => {
                        const cartItem = getCartItem(menu.id);
                        if (!cartItem) {
                          // Belum ada di keranjang
                          return (
                            <button
                              onClick={() => handleAddToCart(menu)}
                              disabled={menu.stok <= 0}
                              className={`flex items-center justify-center w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-md sm:rounded-lg font-medium text-sm sm:text-base transition-colors ${
                                menu.stok > 0
                                  ? 'bg-white border-2 border-[#6d503b] text-[#6d503b] hover:bg-[#6d503b] hover:text-white active:bg-[#5c4033]'
                                  : 'bg-gray-100 border-2 border-gray-300 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              + Keranjang
                            </button>
                          );
                        }
                        // Sudah ada di keranjang -> tampilkan kontrol jumlah
                        return (
                          <div className="flex items-center justify-center gap-2 bg-white border-2 border-[#6d503b] rounded-md sm:rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 w-full">
                            <button
                              onClick={() => {
                                const newQty = cartItem.quantity - 1;
                                if (newQty <= 0) {
                                  removeFromCart(cartItem.id);
                                } else {
                                  updateQuantity(cartItem.id, newQty);
                                }
                              }}
                              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded bg-gray-100 hover:bg-[#6d503b] hover:text-white text-[#6d503b] transition text-lg sm:text-xl font-bold"
                            >
                              −
                            </button>
                            <span className="font-bold text-[#6d503b] text-base sm:text-lg min-w-[30px] text-center">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => {
                                if (cartItem.quantity < menu.stok) {
                                  updateQuantity(cartItem.id, cartItem.quantity + 1);
                                }
                              }}
                              disabled={cartItem.quantity >= menu.stok}
                              className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded transition text-lg sm:text-xl font-bold ${
                                cartItem.quantity < menu.stok
                                  ? 'bg-gray-100 hover:bg-[#6d503b] hover:text-white text-[#6d503b]'
                                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              +
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                    <Link
                      to={`/menu/${menu.id}${window.location.search}`}
                      className="flex items-center justify-center w-full bg-[#6d503b] text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-md sm:rounded-lg hover:bg-[#5c4033] active:bg-[#4a3329] transition-colors font-medium text-sm sm:text-base"
                    >
                      Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Cart Summary Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#6d503b] text-white shadow-2xl px-4 py-3 flex items-center justify-between z-30">
          <div className="text-sm sm:text-base font-semibold">
            Total: Rp {Math.round(getTotalPrice()).toLocaleString('id-ID')}
          </div>
          <button
            onClick={openCart}
            className="bg-white text-[#6d503b] font-semibold px-4 py-2 rounded-lg text-sm sm:text-base hover:bg-gray-100 active:scale-95 transition"
          >
            Buka Keranjang
          </button>
        </div>
      )}
      {/* Spacer agar konten tidak tertutup bar bawah */}
      {cart.length > 0 && <div className="h-16"></div>}

      {/* Filter Modal - CENTERED ON MOBILE */}
      {showFilterModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowFilterModal(false)}
          ></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-[90%] max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Filter Kategori</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {categories.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Tidak ada kategori</p>
              ) : (
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-5 h-5 text-[#6d503b] rounded focus:ring-2 focus:ring-[#6d503b] cursor-pointer"
                      />
                      <span className="ml-3 text-gray-900 font-medium">{category}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 flex gap-2">
              <button
                onClick={() => {
                  setSelectedCategories([]);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 px-4 py-2 bg-[#6d503b] text-white rounded-lg hover:bg-[#5c4033] transition font-medium"
              >
                Terapkan
              </button>
            </div>
          </div>
        </>
      )}

      {/* Sort Modal - CENTERED ON MOBILE */}
      {showSortModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowSortModal(false)}
          ></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-[90%] max-w-md">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Urutkan</h3>
              <button
                onClick={() => setShowSortModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
              {[
                { value: "default", label: "Default" },
                { value: "name-asc", label: "Nama (A-Z)" },
                { value: "name-desc", label: "Nama (Z-A)" },
                { value: "price-high", label: "Harga Tertinggi" },
                { value: "price-low", label: "Harga Terendah" },
                { value: "stock-high", label: "Stok Terbanyak" },
                { value: "stock-low", label: "Stok Tersedikit" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setShowSortModal(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    sortBy === option.value
                      ? 'bg-[#6d503b] text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}