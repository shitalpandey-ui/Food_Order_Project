"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminService } from "@/services/adminService";

const emptyForm = { name: "", address: "", isVeg: false, lat: "", lng: "" };

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const data = await adminService.getRestaurants();
      setRestaurants(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await adminService.createRestaurant({
        name: form.name,
        address: form.address,
        isVeg: form.isVeg,
        location: {
          type: "Point",
          coordinates: [Number(form.lng) || 0, Number(form.lat) || 0],
        },
      });
      setForm(emptyForm);
      await loadRestaurants();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create restaurant");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this restaurant?")) return;
    try {
      await adminService.deleteRestaurant(id);
      setRestaurants((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete restaurant");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Restaurants</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleCreate} className="border rounded p-4 mb-8 grid gap-3 max-w-md">
        <h3 className="font-medium">Add Restaurant</h3>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
          className="border rounded px-3 py-2"
        />
        <div className="flex gap-3">
          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={form.lat}
            onChange={(e) => setForm({ ...form, lat: e.target.value })}
            className="border rounded px-3 py-2 flex-1"
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={form.lng}
            onChange={(e) => setForm({ ...form, lng: e.target.value })}
            className="border rounded px-3 py-2 flex-1"
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isVeg}
            onChange={(e) => setForm({ ...form, isVeg: e.target.checked })}
          />
          Veg only
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add Restaurant"}
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Address</th>
              <th className="py-2">Veg</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((r) => (
              <tr key={r._id} className="border-b">
                <td className="py-2">{r.name}</td>
                <td className="py-2">{r.address}</td>
                <td className="py-2">{r.isVeg ? "Yes" : "No"}</td>
                <td className="py-2 flex gap-3">
                  <Link
                    href={`/admin/restaurants/${r._id}`}
                    className="text-amber-700 hover:underline"
                  >
                    Manage
                  </Link>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {restaurants.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-gray-500">
                  No restaurants yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
