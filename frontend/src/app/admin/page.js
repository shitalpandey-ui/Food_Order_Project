// app/admin/add-restaurant/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function AddRestaurantPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [menu, setMenu] = useState([{ name: "", price: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleMenuChange(index, field, value) {
    const updated = [...menu];
    updated[index][field] = value;
    setMenu(updated);
  }

  function addMenuItem() {
    setMenu([...menu, { name: "", price: "" }]);
  }

  function removeMenuItem(index) {
    setMenu(menu.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          image,
          menu: menu.map((item) => ({
            name: item.name,
            price: Number(item.price),
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed to add restaurant");

      router.push("/restaurants"); // redirect back to restaurant list
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add a Restaurant</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Restaurant Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Menu Items</label>
          {menu.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Item name"
                value={item.name}
                onChange={(e) => handleMenuChange(index, "name", e.target.value)}
                required
                className="flex-1 border rounded-lg p-2"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={item.price}
                onChange={(e) => handleMenuChange(index, "price", e.target.value)}
                required
                className="w-24 border rounded-lg p-2"
              />
              {menu.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMenuItem(index)}
                  className="text-red-500 px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addMenuItem}
            className="text-orange-500 text-sm font-medium"
          >
            + Add another item
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add Restaurant"}
        </button>
      </form>
    </div>
  );
}