// src/pages/admin/MenuManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { menuService } from '../../services/menuService';

const MenuManagement = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const response = await menuService.getMenus();
      setMenus(response.data.data.data);
    } catch (error) {
      console.error('Error loading menus:', error);
      alert('Gagal memuat data menu. Pastikan backend Laravel berjalan di http://127.0.0.1:8000');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus menu ini?')) {
      try {
        await menuService.deleteMenu(id);
        alert('Menu berhasil dihapus!');
        loadMenus();
      } catch (error) {
        alert('Gagal menghapus menu');
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
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
                <h1 className="text-xl font-bold text-gray-800">Kelola Menu</h1>
                <p className="text-xs text-gray-500">Manajemen Menu MyCaffee</p>
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
          <h2 className="text-2xl font-serif text-gray-800">Daftar Menu</h2>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: '#5C4033' }}
          >
            + Tambah Menu Baru
          </button>
        </div>

        {/* Tabel Menu */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-4xl mb-4">☕</div>
            <p className="text-gray-600">Memuat data menu...</p>
          </div>
        ) : (
          <>
            {menus.length > 0 ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Mobile list (visible on small screens) */}
                <div className="block sm:hidden p-4 space-y-4">
                  {menus.map((menu) => (
                    <div key={menu.id} className="border rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          {menu.gambar ? (
                            <img src={menu.gambar} alt={menu.nama_menu} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-gray-400">☕</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{menu.nama_menu}</div>
                          <div className="text-xs text-gray-500 truncate">{menu.kategori} • {formatPrice(menu.harga)}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="text-sm text-gray-600">Stok: {menu.stok}</div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => { setEditingMenu(menu); setShowForm(true); }}
                            className="text-blue-600 hover:text-blue-800 transition text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(menu.id)}
                            className="text-red-600 hover:text-red-800 transition text-sm"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table (hidden on small screens) */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Menu</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {menus.map((menu) => (
                        <tr key={menu.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{menu.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{menu.nama_menu}</div>
                            <div className="text-sm text-gray-500">{menu.deskripsi}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span 
                              className="px-3 py-1 rounded-full text-xs font-medium text-white capitalize"
                              style={{ backgroundColor: '#8B6B47' }}
                            >
                              {menu.kategori}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: '#5C4033' }}>
                            {formatPrice(menu.harga)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{menu.stok}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {menu.gambar ? (
                              <img 
                                src={menu.gambar} 
                                alt={menu.nama_menu} 
                                className="w-12 h-12 object-cover rounded-lg border border-gray-300"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                ☕
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-3">
                              <button
                                onClick={() => {
                                  setEditingMenu(menu);
                                  setShowForm(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 transition"
                              >
                                Edit
                              </button>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() => handleDelete(menu.id)}
                                className="text-red-600 hover:text-red-800 transition"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">☕</div>
                <h3 className="text-xl font-serif text-gray-700 mb-2">Belum ada menu</h3>
                <p className="text-gray-500 mb-6">Mulai dengan menambahkan menu pertama Anda</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: '#5C4033' }}
                >
                  + Tambah Menu Pertama
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal Form */}
        {showForm && (
          <MenuForm 
            menu={editingMenu}
            onClose={() => {
              setShowForm(false);
              setEditingMenu(null);
            }}
            onSuccess={() => {
              setShowForm(false);
              setEditingMenu(null);
              loadMenus();
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
const MenuForm = ({ menu, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nama_menu: '',
    deskripsi: '',
    harga: '',
    stok: '',
    kategori: 'Kopi',
    gambar: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (menu) {
      setFormData({
        nama_menu: menu.nama_menu || '',
        deskripsi: menu.deskripsi || '',
        harga: menu.harga || '',
        stok: menu.stok || '',
        kategori: menu.kategori || 'Kopi',
        gambar: null
      });
    }
  }, [menu]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('nama_menu', formData.nama_menu);
      submitData.append('deskripsi', formData.deskripsi);
      submitData.append('harga', formData.harga);
      submitData.append('stok', formData.stok);
      submitData.append('kategori', formData.kategori);
      
      if (formData.gambar) {
        submitData.append('gambar', formData.gambar);
      }

      if (menu) {
        // Update
        submitData.append('_method', 'PUT');
        await menuService.updateMenu(menu.id, submitData);
        alert('Menu berhasil diupdate!');
      } else {
        // Create
        await menuService.createMenu(submitData);
        alert('Menu berhasil ditambahkan!');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Save error:', error);
      alert('Terjadi kesalahan saat menyimpan menu, Cek Lagi woy.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-gray-800">
            {menu ? 'Edit Menu' : 'Tambah Menu Baru'}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Menu</label>
            <input
              type="text"
              name="nama_menu"
              value={formData.nama_menu}
              onChange={(e) => setFormData({...formData, nama_menu: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#5C4033' }}
              placeholder="Contoh: Kopi Gayo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={(e) => setFormData({...formData, kategori: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#5C4033' }}
            >
              <option value="Kopi">Kopi</option>
              <option value="Snack">Snack</option>
              <option value="Makanan">Makanan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Harga (Rp)</label>
            <input
              type="number"
              name="harga"
              value={formData.harga}
              onChange={(e) => setFormData({...formData, harga: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#5C4033' }}
              placeholder="25000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stok</label>
            <input
              type="number"
              name="stok"
              value={formData.stok}
              onChange={(e) => setFormData({...formData, stok: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#5C4033' }}
              placeholder="100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <textarea
              name="deskripsi"
              rows="3"
              value={formData.deskripsi}
              onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#5C4033' }}
              placeholder="Deskripsi menu..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Gambar</label>
            <input
              type="file"
              name="gambar"
              accept="image/*"
              onChange={(e) => setFormData({...formData, gambar: e.target.files[0]})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#5C4033' }}
            />
          </div>

          <div className="md:col-span-2 flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#5C4033' }}
            >
              {loading ? 'Menyimpan...' : (menu ? 'Update Menu' : '+ Tambah Menu')}
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

export default MenuManagement;