import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";

export default function Navbar() {
  const { getTotalItems } = useCart();
  const { user, logout } = useContext(AuthContext);
  const [tableNumber, setTableNumber] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <nav className="relative bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to={getUrlWithTable("/")} className="text-xl font-bold text-[#6d503b]">
            MYCAFFEE
          </Link>


          {/* Navigation Links */}
          <div className="flex items-center">
            {/* Desktop links */}
            <div className="hidden md:flex items-center space-x-4">
              {!user || (user.peran !== 'admin' && user.peran !== 'kasir') ? (
                <Link to={getUrlWithTable("/")} className="text-gray-700 hover:text-[#6d503b] font-medium text-base">
                  Menu
                </Link>
              ) : null}

              {user ? (
                <>
                  <Link 
                    to={`/${user.peran}/dashboard`}
                    className="text-gray-700 hover:text-[#6d503b] font-medium text-base"
                  >
                    Dashboard
                  </Link>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <span className="text-gray-700 font-medium text-base">Halo, {user.username}</span>
                  <button 
                    onClick={logout}
                    className="text-gray-700 hover:text-[#6d503b] font-medium text-base"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-[#6d503b] font-medium text-base">
                    Login
                  </Link>
                  <Link to="/register" className="text-gray-700 hover:text-[#6d503b] font-medium text-base">
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden ml-2">
              <button
                onClick={() => setMobileOpen((s) => !s)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
                aria-expanded={mobileOpen}
                aria-label="Open menu"
              >
                {mobileOpen ? (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden absolute right-4 top-full mt-2 w-44 bg-white border border-gray-200 shadow-lg rounded-md z-50">
          <div className="py-2">
            {!user || (user.peran !== 'admin' && user.peran !== 'kasir') ? (
              <Link
                to={getUrlWithTable("/")}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Menu
              </Link>
            ) : null}

            {user ? (
              <>
                <Link
                  to={`/${user.peran}/dashboard`}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                <div className="px-4 py-2 text-sm text-gray-600">Halo, {user.username}</div>
                <button
                  onClick={() => { setMobileOpen(false); logout(); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}