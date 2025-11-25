import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";

export default function Navbar() {
  const { getTotalItems } = useCart();
  const { user, logout } = useContext(AuthContext);
  const [tableNumber, setTableNumber] = useState(null);

  // Ambil nomor meja dari localStorage
  useEffect(() => {
    const savedTable = localStorage.getItem('table_number');
    if (savedTable) {
      setTableNumber(savedTable);
    }
  }, []);

  // Helper untuk menambahkan table parameter ke URL
  const getUrlWithTable = (path) => {
    return tableNumber ? `${path}?table=${tableNumber}` : path;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to={getUrlWithTable("/")} className="text-xl font-bold text-[#6d503b]">
            MYCAFFEE
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link to={getUrlWithTable("/")} className="text-gray-700 hover:text-[#6d503b] font-medium">
              Menu
            </Link>

            {/* Conditional Auth Links */}
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="text-gray-700 text-sm hidden sm:block">Halo, {user.username}</span>
                <Link 
                  to={`/${user.peran}/dashboard`}
                  className="p-2 text-gray-700 hover:text-[#6d503b]"
                  title="Dashboard"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-700 hover:text-[#6d503b]"
                  title="Logout"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-[#6d503b] font-medium text-sm sm:text-base">
                  Login
                </Link>
                <Link to="/register" className="text-gray-700 hover:text-[#6d503b] font-medium text-sm sm:text-base">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}