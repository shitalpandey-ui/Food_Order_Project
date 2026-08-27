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

// Fired when a request comes back 401 so AuthContext can clear stale login state.
export const AUTH_EVENT = 'auth:unauthorized';

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Backend's dev error middleware puts the message under `errMessage`, not `message`.
    if (error.response?.data && !error.response.data.message && error.response.data.errMessage) {
      error.response.data.message = error.response.data.errMessage;
    }

    if (typeof window !== 'undefined' && error.response?.status === 401) {
      const url = error.config?.url || '';
      const isAuthEndpoint = url.includes('/user/login') || url.includes('/user/signup');
      if (!isAuthEndpoint) {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event(AUTH_EVENT));
      }
    }

    return Promise.reject(error);
  }
);

export const getRestaurants = async () => {
  const res = await api.get('/restaurants');
  return res.data.restaurants;   // unwrap the array here
};

export const getRestaurantById = async (id) => {
  const res = await api.get(`/restaurants/${id}`);
  return res.data;
};

export const placeOrder = async (orderData) => {
  const res = await api.post('/restaurant/orders', orderData);
  return res.data;
};

export default api;