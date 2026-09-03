//fetch a list of all available restaurants and display them in a clean, responsive grid layout

'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import RestaurantCard from '@/components/RestaurantCard';
import Loader from '@/components/Loader';
import { getRestaurants } from '@/services/api';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const data = await getRestaurants();
        if (!cancelled) setRestaurants(data);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        if (!cancelled) setError('Something went wrong while loading restaurants.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredRestaurants = restaurants.filter((r) =>
    r.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Restaurants near you</h2>
          <p className="mt-1 text-sm text-slate-500">
            {loading ? 'Loading restaurants...' : `${filteredRestaurants.length} results`}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-slate-300 py-2 pl-9 pr-4 text-sm text-slate-900 outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="rounded-xl border border-dashed border-red-300 p-8 text-center text-red-600">
          {error}
        </p>
      ) : filteredRestaurants.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No restaurants to show right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </section>
  );
}
