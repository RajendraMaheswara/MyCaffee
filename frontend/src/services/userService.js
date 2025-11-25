// src/services/userService.js
import axios from 'axios';

const USER_BASE_URL = 'http://127.0.0.1:8000/api/user';

export const userService = {
  // Get all users
  getUsers: () => axios.get(USER_BASE_URL),
  
  // Get single user
  getUser: (id) => axios.get(`${USER_BASE_URL}/${id}`),
  
  // Create user
  createUser: (userData) => axios.post(USER_BASE_URL, userData),
  
  // Update user
  updateUser: (id, userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        formData.append(key, userData[key]);
      }
    });
    formData.append('_method', 'PUT');
    
    return axios.post(`${USER_BASE_URL}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Delete user
  deleteUser: (id) => axios.delete(`${USER_BASE_URL}/${id}`),
};