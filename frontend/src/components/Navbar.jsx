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
            {/* Show "Menu" link only if the user is not an admin or kasir */}
            {!user || (user.peran !== 'admin' && user.peran !== 'kasir') ? (
              <Link to={getUrlWithTable("/")} className="text-gray-700 hover:text-[#6d503b] font-medium text-base">
                Menu
              </Link>
            ) : null}

            {/* Conditional Auth Links */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={`/${user.peran}/dashboard`}
                  className="text-gray-700 hover:text-[#6d503b] font-medium text-base"
                >
                  Dashboard
                </Link>
                {/* Separator */}
                <div className="h-6 w-px bg-gray-300"></div>
                <span className="text-gray-700 font-medium text-base">Halo, {user.username}</span>
                <button 
                  onClick={logout}
                  className="text-gray-700 hover:text-[#6d503b] font-medium text-base"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-[#6d503b] font-medium text-base">
                  Login
                </Link>
                <Link to="/register" className="text-gray-700 hover:text-[#6d503b] font-medium text-base">
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