import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

export default function UserDashboard() {
  const { user, logout } = useContext(AuthContext);

  // HANYA UBAH BAGIAN INI - RETURN JSX
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-[#6d503b] mb-4">Dashboard User</h1>
          <div className="mb-6">
            <p className="text-gray-600">Anda login sebagai:</p>
            <p className="text-lg font-semibold text-[#5c4033]">
              {user?.username} ({user?.peran})
            </p>
          </div>

          <button 
            onClick={logout}
            className="bg-[#6d503b] text-white px-6 py-2 rounded-lg hover:bg-[#5c4033] transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}