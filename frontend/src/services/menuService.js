// src/services/menuService.js
import axios from 'axios';

// URL langsung ke endpoint menu - TANPA /api
const MENU_BASE_URL = 'http://127.0.0.1:8000/api/menu';

export const menuService = {
  // Get all menus
  getMenus: () => axios.get(MENU_BASE_URL),
  
  // Get single menu
  getMenu: (id) => axios.get(`${MENU_BASE_URL}/${id}`),
  
  // Create menu
  createMenu: (formData) => axios.post(MENU_BASE_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Update menu
  updateMenu: (id, formData) => {
    formData.append('_method', 'PUT');
    return axios.post(`${MENU_BASE_URL}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Delete menu
  deleteMenu: (id) => axios.delete(`${MENU_BASE_URL}/${id}`),
};