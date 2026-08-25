// Admin panel CRUD calls for restaurants and food items
import api from './api';

export const adminService = {
  // Restaurants
  getRestaurants: async () => {
    const res = await api.get('/restaurants');
    return res.data.restaurants;
  },
  getRestaurant: async (id) => {
    const res = await api.get(`/restaurants/${id}`);
    return res.data.data;
  },
  createRestaurant: async (payload) => {
    const res = await api.post('/restaurants', payload);
    return res.data.data;
  },
  updateRestaurant: async (id, payload) => {
    const res = await api.patch(`/restaurants/${id}`, payload);
    return res.data.data;
  },
  deleteRestaurant: async (id) => {
    await api.delete(`/restaurants/${id}`);
  },

  // Food items
  getFoodItems: async (restaurantId) => {
    const res = await api.get(`/fooditems/items/${restaurantId}`);
    return res.data.data;
  },
  createFoodItem: async (payload) => {
    const res = await api.post('/fooditems/item', payload);
    return res.data.data;
  },
  updateFoodItem: async (foodId, payload) => {
    const res = await api.patch(`/fooditems/item/${foodId}`, payload);
    return res.data.data;
  },
  deleteFoodItem: async (foodId) => {
    await api.delete(`/fooditems/item/${foodId}`);
  },
};
