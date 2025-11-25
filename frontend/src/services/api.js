import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const apiClient = {
  // Products
  getProducts: (filters = {}) => {
    return api.get('/products', { params: filters });
  },
  getProductById: (id) => {
    return api.get(`/products/${id}`);
  },
  getRecommendedProducts: (id) => {
    return api.get(`/products/${id}/recommended`);
  },

  // Orders
  createOrder: (orderData) => {
    return api.post('/orders', orderData);
  },
  getOrders: () => {
    return api.get('/orders');
  },

  // Auth
  loginAdmin: (email, password) => {
    return api.post('/auth/login', { email, password });
  },
  registerAdmin: (email, password) => {
    return api.post('/auth/register', { email, password });
  }
};

export default api;
