"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { adminService } from "@/services/adminService";

const emptyForm = { name: "", address: "", isVeg: false, lat: "", lng: "" };

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

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
  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount pattern
  loadRestaurants();
}, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await adminService.createRestaurant(
        {
          name: form.name,
          address: form.address,
          isVeg: form.isVeg,
          location: {
            type: "Point",
            coordinates: [Number(form.lng) || 0, Number(form.lat) || 0],
          },
           name: form.name,
          address: form.address,
          isNonVeg: form.isNonVeg,
          location: {
            type: "Point",
            coordinates: [Number(form.lng) || 0, Number(form.lat) || 0],
          },
           name: form.name,
          address: form.address,
          isBoth: form.isBoth,
          location: {
            type: "Point",
            coordinates: [Number(form.lng) || 0, Number(form.lat) || 0],
          },
        },
        images
      );
      setForm(emptyForm);
      previews.forEach((url) => URL.revokeObjectURL(url));
      setImages([]);
      setPreviews([]);
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
      <h2 className="mb-6 text-2xl font-bold text-slate-900">Restaurants</h2>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form
        onSubmit={handleCreate}
        className="mb-10 grid max-w-lg gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h3 className="text-base font-semibold text-slate-800">Add Restaurant</h3>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
        />
        <div className="flex gap-3">
          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={form.lat}
            onChange={(e) => setForm({ ...form, lat: e.target.value })}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={form.lng}
            onChange={(e) => setForm({ ...form, lng: e.target.value })}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.isVeg}
            onChange={(e) => setForm({ ...form, isVeg: e.target.checked })}
          />
          Vegetarian only
        </label>
         <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.isNonVeg}
            onChange={(e) => setForm({ ...form, isVeg: e.target.checked })}
          />
          NonVegeterian meal
        </label>
         <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.isBoth}
            onChange={(e) => setForm({ ...form, isVeg: e.target.checked })}
          />
          Both
                  </label>

        <div>
                 <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Restaurant image URL
          </label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            onChange={handleImagesChange}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
          {previews.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {previews.map((src, i) => (
              
                <Image key={i} src={src} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-fit rounded-lg bg-amber-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800 disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add Restaurant"}
        </button>
      </form>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : restaurants.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No restaurants yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((r) => {
            const thumb = r.images?.[0]?.url;
            return (
              <div
                key={r._id}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt={r.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <h3 className="font-semibold text-slate-900">{r.name}</h3>
                  <p className="line-clamp-1 text-sm text-slate-500">{r.address}</p>
                  <p className="text-m text-slate-400">{r.isVeg ? "Vegetarian" : "All diets"}</p>
                  <div className="mt-auto flex gap-3 pt-2">
                    <Link
                      href={`/admin/restaurants/${r._id}`}
                      className="text-m font-medium text-amber-700 hover:underline"
                    >
                      Manage
                    </Link>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="text-m font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
