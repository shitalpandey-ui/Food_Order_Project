"use client";

import { useState } from "react";
import MenuItemCard from "@/components/MenuItemCard";

export default function MenuPage({ params }) {
  const restaurantId = params?.restaurantId;


  const [menu, setMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const handleViewMenu = async () => {
    if (menu) {
      setShowMenu(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/menu?restaurantId=${restaurantId}`);
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const data = await res.json();
      setMenu(data);
      setShowMenu(true);
    } catch (err) {
      console.error("Failed to load menu:", err);
      setError("Couldn't load the menu. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12 sm:px-6">
      <section className="text-center">
        <p className="text-sm font-medium text-orange-600">
          Hyderabadi kitchen, since 1988
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Nizam&apos;s Table
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
          Slow-cooked dum biryani, char-grilled kebabs, and the recipes that
          built this city&apos;s reputation for good food.
        </p>

        {!showMenu && (
          <button
            type="button"
            onClick={handleViewMenu}
            disabled={isLoading}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Loading menu…" : "View Menu"}
          </button>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </section>

      {showMenu && menu && (
        <section className="mt-12 space-y-10">
          {menu.map((category) => (
            <div key={category._id}>
              <h2 className="mb-4 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900">
                {category.name}
              </h2>

              <div className="space-y-3">
                {category.items.map((item) => (
                  <MenuItemCard
                    key={item._id}
                    item={item}
                    restaurantId={restaurantId}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}