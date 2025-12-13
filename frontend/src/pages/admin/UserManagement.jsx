// src/pages/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/userService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers();
      console.log('Users data:', response.data);
      setUsers(response.data.data.data);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Gagal memuat data pengguna. Pastikan backend Laravel berjalan di http://127.0.0.1:8000');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus pengguna ini?')) {
      try {
        await userService.deleteUser(id);
        alert('Pengguna berhasil dihapus!');
        loadUsers();
      } catch (error) {
        alert('Gagal menghapus pengguna');
      }
    }
  };

  const getRoleBadgeColor = (peran) => {
    switch (peran) {
      case 'admin':
        return { bg: '#5C4033', text: 'Admin' };
      case 'kasir':
        return { bg: '#8B6B47', text: 'Kasir' };
      default:
        return { bg: '#C4A574', text: 'User' };
    }
  };

  const formatStamp = (peran, stamp) => {
    if (!peran) return stamp || 0;
    const role = peran.toString().toLowerCase();
    if (role === 'admin' || role === 'kasir') return '-';
    return stamp || 0;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1ED' }}>
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#5C4033', color: '#F5F1ED' }}>
                <span className="text-2xl font-bold">J</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Kelola Pengguna</h1>
                <p className="text-xs text-gray-500">Manajemen Pengguna MyCaffee</p>
              </div>
            </div>
            <Link 
              to="/admin/dashboard" 
              className="px-4 py-2 rounded-lg text-sm transition"
              style={{ backgroundColor: '#8B6B47', color: '#F5F1ED' }}
            >
              ← Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header dan Tombol Tambah */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-gray-800">Daftar Pengguna</h2>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: '#5C4033' }}
          >
            + Tambah Pengguna Baru
          </button>
        </div>

        {/* Tabel Pengguna */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-gray-600">Memuat data pengguna...</p>
          </div>
        ) : (
          <>
            {users.length > 0 ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Mobile list */}
                <div className="block sm:hidden p-4 space-y-4">
                  {users.map((u) => {
                    const roleBadge = getRoleBadgeColor(u.peran);
                    return (
                      <div key={u.id} className="border rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">👤</div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">{u.username}</div>
                            <div className="text-xs text-gray-500 truncate">{u.email}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className="text-xs text-gray-600">
                            {roleBadge.text} • {formatStamp(u.peran, u.total_stamp)}{formatStamp(u.peran, u.total_stamp) !== '-' ? ' stamp' : ''}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => { setEditingUser(u); setShowForm(true); }}
                              className="text-blue-600 hover:text-blue-800 transition text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(u.id)}
                              className="text-red-600 hover:text-red-800 transition text-sm"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Telp</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peran</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Stamp</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => {
                        const roleBadge = getRoleBadgeColor(user.peran);
                        return (
                          <tr key={user.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {user.nama_lengkap || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.no_telp}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span 
                                className="px-3 py-1 rounded-full text-xs font-medium text-white capitalize"
                                style={{ backgroundColor: roleBadge.bg }}
                              >
                                {roleBadge.text}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: '#5C4033' }}>
                              {formatStamp(user.peran, user.total_stamp)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => {
                                    setEditingUser(user);
                                    setShowForm(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 transition"
                                >
                                  Edit
                                </button>
                                <span className="text-gray-300">|</span>
                                <button
                                  onClick={() => handleDelete(user.id)}
                                  className="text-red-600 hover:text-red-800 transition"
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-serif text-gray-700 mb-2">Belum ada pengguna</h3>
                <p className="text-gray-500 mb-6">Mulai dengan menambahkan pengguna pertama</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: '#5C4033' }}
                >
                  + Tambah Pengguna Pertama
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal Form */}
        {showForm && (
          <UserForm 
            user={editingUser}
            onClose={() => {
              setShowForm(false);
              setEditingUser(null);
            }}
            onSuccess={() => {
              setShowForm(false);
              setEditingUser(null);
              loadUsers();
            }}
          />
        )}
      </div>

      {/* Custom Fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
          body { font-family: 'Inter', sans-serif; }
          .font-serif { font-family: 'Playfair Display', serif; }
        `}
      </style>
    </div>
  );
};

// Form Component
const UserForm = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    nama_lengkap: '',
    no_telp: '',
    peran: 'user',
    total_stamp: 0
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '', // Kosongkan password saat edit
        nama_lengkap: user.nama_lengkap || '',
        no_telp: user.no_telp || '',
        peran: user.peran || 'user',
        total_stamp: user.total_stamp || 0
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Hapus password dari data jika kosong (saat update)
      const submitData = { ...formData };
      if (user && !submitData.password) {
        delete submitData.password;
      }

      if (user) {
        // Update user
        await userService.updateUser(user.id, submitData);
        alert('Pengguna berhasil diupdate!');
      } else {
        // Create user
        await userService.createUser(submitData);
        alert('Pengguna berhasil ditambahkan!');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Save error:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
        alert(`Error: ${errorMessages}`);
      } else {
        alert('Terjadi kesalahan saat menyimpan pengguna. Cek console untuk detail.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-gray-800">
            {user ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#5C4033' }}
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#5C4033' }}
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password {user ? '(kosongkan jika tidak diubah)' : '*'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required={!user} // Required hanya untuk create
                minLength="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent pr-10"
                style={{ '--tw-ring-color': '#5C4033' }}
                placeholder="Masukkan password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
            <input
              type="text"
              value={formData.nama_lengkap}
              onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#5C4033' }}
              placeholder="Nama lengkap pengguna"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Peran *</label>
            <select
              value={formData.peran}
              onChange={(e) => setFormData({...formData, peran: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#5C4033' }}
            >
              <option value="admin">Admin</option>
              <option value="kasir">Kasir</option>
              <option value="user">User</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telp</label>
            <input
                type="text"
                value={formData.no_telp}
                onChange={(e) => setFormData({...formData, no_telp: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': '#5C4033' }}
                placeholder="Masukkan nomor telepon"
            />
        </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Stamp</label>
            <input
              type="number"
              value={formData.total_stamp}
              onChange={(e) => setFormData({...formData, total_stamp: parseInt(e.target.value) || 0})}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#5C4033' }}
              placeholder="0"
            />
          </div>

          <div className="md:col-span-2 flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#5C4033' }}
            >
              {loading ? 'Menyimpan...' : (user ? 'Update Pengguna' : '+ Tambah Pengguna')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg font-semibold bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;