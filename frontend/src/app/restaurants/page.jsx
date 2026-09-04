// app/restaurants/page.js

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getRestaurants } from "@/services/api";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch restaurants
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const data = await getRestaurants();

        if (!cancelled) {
          setRestaurants(data);
        }
      } catch (err) {
        console.error("Error fetching restaurants:", err);

        if (!cancelled) {
          setError("Failed to load restaurants. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Filter restaurants based on search
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading restaurants...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Restaurants near you
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {filteredRestaurants.length} restaurants found
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* No restaurants */}
      {filteredRestaurants.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No restaurants found.
        </p>
      ) : (
        /* Restaurant Grid */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {filteredRestaurants.map((restaurant) => (
            <Link
              key={restaurant._id}
              href={`/restaurants/${restaurant._id}`}
              className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
            >

              {/* Restaurant Image */}
              <div className="relative h-48 w-full">
                <Image
                  src={
                    restaurant.images?.[0]?.url ||
                    "/placeholder-food.jpg"
                  }
                  alt={restaurant.name || "Restaurant"}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Restaurant Details */}
              <div className="p-4">

                <div className="flex items-center justify-between gap-2">

                  <h2 className="text-lg font-semibold text-gray-900">
                    {restaurant.name}
                  </h2>

                  {restaurant.isVeg && (
                    <span className="rounded border border-green-600 px-1.5 py-0.5 text-xs text-green-600">
                      VEG
                    </span>
                  )}

                </div>

                {/* Address */}
                <p className="mt-1 text-sm text-gray-500">
                  {restaurant.address}
                </p>

                {/* Rating */}
                <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                  ⭐ {restaurant.ratings || "No ratings"}

                  {restaurant.numOfReviews > 0 && (
                    <span className="text-gray-400">
                      ({restaurant.numOfReviews})
                    </span>
                  )}
                </div>

              </div>
            </Link>
          ))}

        </div>
      )}

    </section>
  );
}