// to centralize api

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const getRestaurants = async () => {
  const res = await api.get('/restaurants');
  return res.data;
};

export const getRestaurantById = async (id) => {
  const res = await api.get(`/restaurants/${id}`);
  return res.data;
};

export const placeOrder = async (orderData) => {
  const res = await api.post('/restaurants/orders', orderData);
  return res.data;
};

export default api;