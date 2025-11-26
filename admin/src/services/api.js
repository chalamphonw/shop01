import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = {
  // Auth
  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },
  register: (email, password) => {
    return api.post('/auth/register', { email, password });
  },

  // Products
  getProducts: (filters = {}) => {
    return api.get('/products', { params: filters });
  },
  getProductById: (id) => {
    return api.get(`/products/${id}`);
  },
  createProduct: (data) => {
    return api.post('/products', data);
  },
  updateProduct: (id, data) => {
    return api.put(`/products/${id}`, data);
  },
  deleteProduct: (id) => {
    return api.delete(`/products/${id}`);
  },

  // Upload
  uploadFiles: (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Orders
  getOrders: () => {
    return api.get('/orders');
  },
  getOrderById: (id) => {
    return api.get(`/orders/${id}`);
  }
};

export default api;
