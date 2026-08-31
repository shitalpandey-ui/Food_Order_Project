// Admin panel CRUD calls for restaurants and food items
import api, { API_BASE_URL } from './api';

// Builds a multipart/form-data body so restaurant images/media can ride
// alongside the regular fields in one request to multer on the backend.
// `location` is nested, so it needs to be JSON-stringified for transport.
function buildRestaurantFormData(payload, images) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === 'location') {
      formData.append('location', JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  (images || []).forEach((file) => formData.append('images', file));

  return formData;
}

// Sends a FormData body via the native fetch API instead of axios. Axios has
// to *detect* FormData and strip its own default Content-Type so the browser
// can set the multipart boundary itself - fetch never has that ambiguity, it
// always sends a FormData body as real multipart/form-data.
async function sendForm(method, path, formData) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || data.errMessage || 'Request failed');
    error.response = { status: res.status, data };
    throw error;
  }

  return data;
}

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
  createRestaurant: async (payload, images) => {
    const formData = buildRestaurantFormData(payload, images);
    const data = await sendForm('POST', '/restaurants', formData);
    return data.data;
  },
  updateRestaurant: async (id, payload, images) => {
    const formData = buildRestaurantFormData(payload, images);
    const data = await sendForm('PATCH', `/restaurants/${id}`, formData);
    return data.data;
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

  // Menus - one menu document per restaurant, grouping FoodItem refs by category
  getMenu: async (restaurantId) => {
    const res = await api.get(`/menus/restaurant/${restaurantId}`);
    return res.data.data; // null if the restaurant has no menu yet
  },
  createMenu: async (restaurantId) => {
    const res = await api.post('/menus', { restaurant: restaurantId, menu: [] });
    return res.data.data;
  },
  addMenuItems: async (menuId, category, itemIds) => {
    const res = await api.post(`/menus/${menuId}/items`, { category, items: itemIds });
    return res.data.data;
  },
  removeMenuItem: async (menuId, foodId) => {
    const res = await api.delete(`/menus/${menuId}/items/${foodId}`);
    return res.data.data;
  },
};
