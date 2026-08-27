//fetch a list of all available restaurants and display them in a clean, responsive grid layout

import RestaurantCard from '@/components/RestaurantCard';
import { getAllRestaurants } from '@/app/restaurants/restaurant';



export default function RestaurantsPage() {
  const restaurants = getAllRestaurants();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Restaurants near you</h2>
        <span className="text-sm text-slate-500">{restaurants.length} results</span>
      </div>

      {restaurants.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No restaurants to show right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </section>
  );
}