"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminService } from "@/services/adminService";

const emptyItemForm = { name: "", price: "", description: "", stock: "", imageUrl: "" };

export default function AdminRestaurantDetailPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [restaurantForm, setRestaurantForm] = useState({ name: "", address: "", isVeg: false });
  const [foodItems, setFoodItems] = useState([]);
  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [editingItemId, setEditingItemId] = useState(null); // start true instead of setting it in the effect
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);


const isFirstLoad = useRef(true);

const loadData = useCallback(async () => {
  if (!isFirstLoad.current) {
    setLoading(true);
  }
  try {
    const [restaurantData, itemsData] = await Promise.all([
      adminService.getRestaurant(id),
      adminService.getFoodItems(id),
    ]);
    setRestaurant(restaurantData);
    setRestaurantForm({
      name: restaurantData.name,
      address: restaurantData.address,
      isVeg: restaurantData.isVeg,
    });
    setFoodItems(itemsData);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to load restaurant");
  } finally {
    setLoading(false);
    isFirstLoad.current = false;
  }
}, [id]);

useEffect(() => {
  if (id) {
    Promise.resolve().then(() => loadData());
  }
}, [id, loadData]);

  const handleRestaurantUpdate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const updated = await adminService.updateRestaurant(id, restaurantForm);
      setRestaurant(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update restaurant");
    }
  };

  const resetItemForm = () => {
    setItemForm(emptyItemForm);
    setEditingItemId(null);
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        name: itemForm.name,
        price: Number(itemForm.price),
        description: itemForm.description,
        stock: Number(itemForm.stock),
        imageUrl: itemForm.imageUrl || undefined,
        restaurant: id,
      };

      if (editingItemId) {
        const updated = await adminService.updateFoodItem(editingItemId, payload);
        setFoodItems((prev) => prev.map((f) => (f._id === editingItemId ? updated : f)));
      } else {
        const created = await adminService.createFoodItem(payload);
        setFoodItems((prev) => [...prev, created]);
      }
      resetItemForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save food item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingItemId(item._id);
    setItemForm({
      name: item.name,
      price: item.price,
      description: item.description,
      stock: item.stock,
      imageUrl: item.images?.[0]?.url || "",
    });
  };

  const handleDeleteItem = async (foodId) => {
    if (!confirm("Delete this food item?")) return;
    try {
      await adminService.deleteFoodItem(foodId);
      setFoodItems((prev) => prev.filter((f) => f._id !== foodId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete food item");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!restaurant) return <p>Restaurant not found.</p>;

  return (
    <div>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleRestaurantUpdate} className="border rounded p-4 mb-8 grid gap-3 max-w-md">
        <h3 className="font-medium">Restaurant Details</h3>
        <input
          type="text"
          value={restaurantForm.name}
          onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          value={restaurantForm.address}
          onChange={(e) => setRestaurantForm({ ...restaurantForm, address: e.target.value })}
          required
          className="border rounded px-3 py-2"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={restaurantForm.isVeg}
            onChange={(e) => setRestaurantForm({ ...restaurantForm, isVeg: e.target.checked })}
          />
          Veg only
        </label>
        <button
          type="submit"
          className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 w-fit"
        >
          Save Changes
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Food Items</h2>

      <form onSubmit={handleItemSubmit} className="border rounded p-4 mb-8 grid gap-3 max-w-md">
        <h3 className="font-medium">{editingItemId ? "Edit Food Item" : "Add Food Item"}</h3>
        <input
          type="text"
          placeholder="Name"
          value={itemForm.name}
          onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
          required
          className="border rounded px-3 py-2"
        />
        <textarea
          placeholder="Description"
          value={itemForm.description}
          onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
          required
          className="border rounded px-3 py-2"
        />
        <div className="flex gap-3">
          <input
            type="number"
            step="any"
            placeholder="Price"
            value={itemForm.price}
            onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
            required
            className="border rounded px-3 py-2 flex-1"
          />
          <input
            type="number"
            placeholder="Stock"
            value={itemForm.stock}
            onChange={(e) => setItemForm({ ...itemForm, stock: e.target.value })}
            required
            className="border rounded px-3 py-2 flex-1"
          />
        </div>
        <input
          type="text"
          placeholder="Image URL (optional)"
          value={itemForm.imageUrl}
          onChange={(e) => setItemForm({ ...itemForm, imageUrl: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 disabled:opacity-50"
          >
            {submitting ? "Saving..." : editingItemId ? "Update Item" : "Add Item"}
          </button>
          {editingItemId && (
            <button
              type="button"
              onClick={resetItemForm}
              className="px-4 py-2 rounded border hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Name</th>
            <th className="py-2">Price</th>
            <th className="py-2">Stock</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {foodItems.map((item) => (
            <tr key={item._id} className="border-b">
              <td className="py-2">{item.name}</td>
              <td className="py-2">{item.price}</td>
              <td className="py-2">{item.stock}</td>
              <td className="py-2 flex gap-3">
                <button
                  onClick={() => handleEditItem(item)}
                  className="text-amber-700 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteItem(item._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {foodItems.length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-gray-500">
                No food items yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
