"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function MenuItemCard({ item, restaurantId }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  const image = item.images?.[0]?.url;

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);
    setError(null);

    try {
      await addItem({
        id: item._id,
        restaurantId,
        name: item.name,
        price: item.price,
        image,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      setError("Couldn't add this item. Try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={item.name} className="h-20 w-20 shrink-0 rounded-lg object-cover" />
      ) : (
        <div className="h-20 w-20 shrink-0 rounded-lg bg-slate-100" aria-hidden="true" />
      )}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-slate-900 sm:text-base">{item.name}</h4>
          <span className="shrink-0 text-sm font-semibold text-slate-800">
            Rs {Number(item.price).toFixed(2)}
          </span>
        </div>
        {item.description && <p className="line-clamp-2 text-sm text-slate-500">{item.description}</p>}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={added || isAdding}
          className={`mt-2 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            added
              ? "bg-green-100 text-green-700"
              : "bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-70"
          }`}
        >
          {added ? (
            <>
              <Check className="h-3.5 w-3.5" /> Added
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" /> {isAdding ? "Adding…" : "Add to cart"}
            </>
          )}
        </button>

        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}