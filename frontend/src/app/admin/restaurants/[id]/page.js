"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { adminService } from "@/services/adminService";

const emptyItemForm = { name: "", price: "", description: "", stock: "", category: "" };

// Builds { foodItemId: categoryName } from a Menu doc so the food item list
// can show/edit which category each item currently belongs to.
function buildCategoryLookup(menu) {
  const lookup = {};
  (menu?.menu || []).forEach((cat) => {
    (cat.items || []).forEach((item) => {
      const itemId = typeof item === "string" ? item : item._id;
      lookup[itemId] = cat.category || "Other";
    });
  });
  return lookup;
}

export default function AdminRestaurantDetailPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [restaurantForm, setRestaurantForm] = useState({ name: "", address: "", isVeg: false });
  const [restaurantImages, setRestaurantImages] = useState([]);
  const [restaurantPreviews, setRestaurantPreviews] = useState([]);
  const [savingRestaurant, setSavingRestaurant] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const [menu, setMenu] = useState(null);
  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [itemImages, setItemImages] = useState([]);
  const [itemPreviews, setItemPreviews] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemCategory, setEditingItemCategory] = useState("");
  const [editingItemImage, setEditingItemImage] = useState("");
  const [renamingCategoryId, setRenamingCategoryId] = useState(null);
  const [renamingCategoryName, setRenamingCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isFirstLoad = useRef(true);
  const categoryByItemId = buildCategoryLookup(menu);

  const loadData = useCallback(async () => {
    if (!isFirstLoad.current) {
      setLoading(true);
    }
    try {
      const [restaurantData, itemsData, menuData] = await Promise.all([
        adminService.getRestaurant(id),
        adminService.getFoodItems(id),
        adminService.getMenu(id),
      ]);
      setRestaurant(restaurantData);
      setRestaurantForm({
        name: restaurantData.name,
        address: restaurantData.address,
        isVeg: restaurantData.isVeg,
      });
      setFoodItems(itemsData);
      setMenu(menuData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load restaurant");
    } finally {
      setLoading(false);
      isFirstLoad.current = false;
    }
  }, [id]);

  const ensureMenu = async () => {
    if (menu) return menu;
    const created = await adminService.createMenu(id);
    setMenu(created);
    return created;
  };

  useEffect(() => {
    if (id) {
      Promise.resolve().then(() => loadData());
    }
  }, [id, loadData]);

  const handleRestaurantImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setRestaurantImages(files);
    restaurantPreviews.forEach((url) => URL.revokeObjectURL(url));
    setRestaurantPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleItemImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setItemImages(files);
    itemPreviews.forEach((url) => URL.revokeObjectURL(url));
    setItemPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleRestaurantUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSavingRestaurant(true);
    try {
      const updated = await adminService.updateRestaurant(
        id,
        {
          name: restaurantForm.name,
          address: restaurantForm.address,
          isVeg: restaurantForm.isVeg,
        },
        restaurantImages
      );
      setRestaurant(updated);
      restaurantPreviews.forEach((url) => URL.revokeObjectURL(url));
      setRestaurantImages([]);
      setRestaurantPreviews([]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update restaurant");
    } finally {
      setSavingRestaurant(false);
    }
  };

  const resetItemForm = () => {
    setItemForm(emptyItemForm);
    setEditingItemId(null);
    setEditingItemCategory("");
    setEditingItemImage("");
    itemPreviews.forEach((url) => URL.revokeObjectURL(url));
    setItemImages([]);
    setItemPreviews([]);
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
        restaurant: id,
      };
      const category = itemForm.category.trim() || "Other";

      if (editingItemId) {
        const updated = await adminService.updateFoodItem(editingItemId, payload, itemImages);
        setFoodItems((prev) => prev.map((f) => (f._id === editingItemId ? updated : f)));

        if (category !== editingItemCategory) {
          const activeMenu = await ensureMenu();
          if (editingItemCategory) {
            await adminService.removeMenuItem(activeMenu._id, editingItemId);
          }
          const updatedMenu = await adminService.addMenuItems(activeMenu._id, category, [editingItemId]);
          setMenu(updatedMenu);
        }
      } else {
        const created = await adminService.createFoodItem(payload, itemImages);
        setFoodItems((prev) => [...prev, created]);

        const activeMenu = await ensureMenu();
        const updatedMenu = await adminService.addMenuItems(activeMenu._id, category, [created._id]);
        setMenu(updatedMenu);
      }
      resetItemForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save food item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditItem = (item) => {
    const category = categoryByItemId[item._id] || "";
    itemPreviews.forEach((url) => URL.revokeObjectURL(url));
    setItemImages([]);
    setItemPreviews([]);
    setEditingItemId(item._id);
    setEditingItemCategory(category);
    setEditingItemImage(item.images?.[0]?.url || "");
    setItemForm({
      name: item.name,
      price: item.price,
      description: item.description,
      stock: item.stock,
      category,
    });
  };

  const handleDeleteItem = async (foodId) => {
    if (!confirm("Delete this food item?")) return;
    try {
      await adminService.deleteFoodItem(foodId);
      setFoodItems((prev) => prev.filter((f) => f._id !== foodId));
      // Backend already pulls the reference out of the menu; mirror that locally.
      setMenu((prev) =>
        prev
          ? {
              ...prev,
              menu: prev.menu.map((cat) => ({
                ...cat,
                items: cat.items.filter((it) => (typeof it === "string" ? it : it._id) !== foodId),
              })),
            }
          : prev
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete food item");
    }
  };

  const handleRenameCategoryStart = (cat) => {
    setRenamingCategoryId(cat._id);
    setRenamingCategoryName(cat.category || "");
  };

  const handleRenameCategoryCancel = () => {
    setRenamingCategoryId(null);
    setRenamingCategoryName("");
  };

  const handleRenameCategorySubmit = async (e) => {
    e.preventDefault();
    const name = renamingCategoryName.trim();
    if (!name || !menu) return;
    try {
      const updated = await adminService.renameCategory(menu._id, renamingCategoryId, name);
      setMenu(updated);
      handleRenameCategoryCancel();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to rename category");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!menu) return;
    if (!confirm("Delete this category? Its food items will stay, just uncategorized.")) return;
    try {
      const updated = await adminService.deleteCategory(menu._id, categoryId);
      setMenu(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete category");
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (!restaurant) return <p className="text-slate-500">Restaurant not found.</p>;

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form
        onSubmit={handleRestaurantUpdate}
        className="mb-10 grid max-w-lg gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h3 className="text-base font-semibold text-slate-800">Restaurant Details</h3>

        {restaurant.images?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {restaurant.images.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img.public_id}
                src={img.url}
                alt={restaurant.name}
                className="h-20 w-20 rounded-xl object-cover"
              />
            ))}
          </div>
        )}

        <input
          type="text"
          value={restaurantForm.name}
          onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
          required
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
        />
        <input
          type="text"
          value={restaurantForm.address}
          onChange={(e) => setRestaurantForm({ ...restaurantForm, address: e.target.value })}
          required
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
        />
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={restaurantForm.isVeg}
            onChange={(e) => setRestaurantForm({ ...restaurantForm, isVeg: e.target.checked })}
          />
          Vegetarian only
        </label>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Add more images / media
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleRestaurantImagesChange}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-amber-700 hover:file:bg-amber-100"
          />
          {restaurantPreviews.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {restaurantPreviews.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={savingRestaurant}
          className="w-fit rounded-lg bg-amber-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800 disabled:opacity-50"
        >
          {savingRestaurant ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <h2 className="mb-4 text-xl font-bold text-slate-900">Menu Categories</h2>

      {menu?.menu?.length > 0 ? (
        <div className="mb-8 flex flex-col gap-2">
          {menu.menu.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              {renamingCategoryId === cat._id ? (
                <form onSubmit={handleRenameCategorySubmit} className="flex flex-1 items-center gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={renamingCategoryName}
                    onChange={(e) => setRenamingCategoryName(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="text-sm font-medium text-amber-700 hover:underline"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleRenameCategoryCancel}
                    className="text-sm font-medium text-slate-500 hover:underline"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <p className="flex-1 font-medium text-slate-900">{cat.category}</p>
                  <span className="text-xs text-slate-400">
                    {cat.items?.length || 0} item{cat.items?.length === 1 ? "" : "s"}
                  </span>
                  <button
                    onClick={() => handleRenameCategoryStart(cat)}
                    className="text-sm font-medium text-amber-700 hover:underline"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="text-sm font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-8 rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
          No categories yet - add a food item below with a category name to create one.
        </p>
      )}

      <h2 className="mb-4 text-xl font-bold text-slate-900">Food Items</h2>

      <form
        onSubmit={handleItemSubmit}
        className="mb-8 grid max-w-lg gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h3 className="text-base font-semibold text-slate-800">
          {editingItemId ? "Edit Food Item" : "Add Food Item"}
        </h3>
        <input
          type="text"
          placeholder="Name"
          value={itemForm.name}
          onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
          required
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
        />
        <textarea
          placeholder="Description"
          value={itemForm.description}
          onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
          required
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
        />
        <div className="flex gap-3">
          <input
            type="number"
            step="any"
            placeholder="Price"
            value={itemForm.price}
            onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
            required
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Stock"
            value={itemForm.stock}
            onChange={(e) => setItemForm({ ...itemForm, stock: e.target.value })}
            required
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
          />
        </div>
        <input
          type="text"
          placeholder="Category (e.g. Starters, Mains, Desserts)"
          value={itemForm.category}
          onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
        />
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Photo</label>
          {editingItemImage && itemPreviews.length === 0 && (
            <div className="mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={editingItemImage} alt="" className="h-16 w-16 rounded-lg object-cover" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleItemImagesChange}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-amber-700 hover:file:bg-amber-100"
          />
          {itemPreviews.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {itemPreviews.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-amber-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800 disabled:opacity-50"
          >
            {submitting ? "Saving..." : editingItemId ? "Update Item" : "Add Item"}
          </button>
          {editingItemId && (
            <button
              type="button"
              onClick={resetItemForm}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-3 sm:grid-cols-2">
        {foodItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            {item.images?.[0]?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.images[0].url}
                alt={item.name}
                className="h-14 w-14 shrink-0 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-slate-900">{item.name}</p>
                {categoryByItemId[item._id] && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                    {categoryByItemId[item._id]}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500">
                Rs {item.price} &middot; {item.stock} in stock
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => handleEditItem(item)} className="font-medium text-amber-700 hover:underline">
                Edit
              </button>
              <button
                onClick={() => handleDeleteItem(item._id)}
                className="font-medium text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {foodItems.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 sm:col-span-2">
            No food items yet.
          </p>
        )}
      </div>
    </div>
  );
}
