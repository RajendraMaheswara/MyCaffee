// src/services/api.js - Update dengan interceptor
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Tambahkan interceptor untuk error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data);
        return Promise.reject(error);
    }
);

export default api;