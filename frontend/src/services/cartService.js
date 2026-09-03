// Backend cart API calls - only ever used for a logged-in user; guests use
// the localStorage-backed cart in CartContext instead.
import api from './api';

export const cartService = {
  getCart: async () => {
    const res = await api.get('/cart');
    return res.data.data; // null when the user has no cart yet
  },
  addItem: async ({ foodItemId, restaurantId, quantity = 1 }) => {
    const res = await api.post('/cart/items', { foodItemId, restaurantId, quantity });
    return res.data.data;
  },
  updateItemQuantity: async (foodItemId, quantity) => {
    const res = await api.patch(`/cart/items/${foodItemId}`, { quantity });
    return res.data.data;
  },
  removeItem: async (foodItemId) => {
    const res = await api.delete(`/cart/items/${foodItemId}`);
    return res.data.data;
  },
  clearCart: async () => {
    await api.delete('/cart');
  },
};

// Flattens the backend's populated cart (restaurant + items.foodItem docs)
// into the flat shape the cart UI already works with.
export function normalizeServerCart(cart) {
  if (!cart || !cart.items) return [];
  return cart.items
    .filter((item) => item.foodItem) // drop refs to since-deleted food items
    .map((item) => ({
      id: item.foodItem._id,
      restaurantId: cart.restaurant?._id,
      name: item.foodItem.name,
      price: item.foodItem.price,
      image: item.foodItem.images?.[0]?.url,
      qty: item.quantity,
    }));
}
