// API Client Setup to centralize api
// axios instance (baseURL, interceptors)
//Configures Axios with a base URL and an interceptor to automatically attach the JWT token from localStorage to outgoing requests.

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ||'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getRestaurants = async () => {
  const res = await api.get('/restaurant');
  return res.data;
};

export const getRestaurantById = async (id) => {
  const res = await api.get(`/restaurant/${id}`);
  return res.data;
};

export const placeOrder = async (orderData) => {
  const res = await api.post('/restaurant/orders', orderData);
  return res.data;
};

export default api;