//restaurant detail page - fetches the restaurant, its menu and food items from the backend

import { notFound } from 'next/navigation';
import { Star, StarHalf, MapPin } from 'lucide-react';
import { getRestaurantById, getMenuByRestaurantId, getFoodItemsByRestaurant } from '@/services/api';

function StarRating({ rating }) {
  const safeRating = Number(rating) || 0;
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating - fullStars >= 0.5;

  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < fullStars;
        const half = !filled && hasHalfStar && i === fullStars;

        if (filled) {
          return <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" strokeWidth={1.5} />;
        }
        if (half) {
          return <StarHalf key={i} className="h-4 w-4 fill-amber-500 text-amber-500" strokeWidth={1.5} />;
        }
        return <Star key={i} className="h-4 w-4 fill-slate-300 text-slate-300" strokeWidth={1.5} />;
      })}
    </span>
  );
}

function MenuItemCard({ item }) {
  const image = item.images?.[0]?.url;

  return (
    <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={item.name} className="h-20 w-20 shrink-0 rounded-lg object-cover" />
      )}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-slate-900 sm:text-base">{item.name}</h4>
          <span className="shrink-0 text-sm font-semibold text-slate-800">Rs {item.price}</span>
        </div>
        {item.description && <p className="line-clamp-2 text-sm text-slate-500">{item.description}</p>}
      </div>
    </div>
  );
}

// Groups a Menu document's categories (populated with FoodItem docs) into
// { category, items } pairs, dropping empty categories. Falls back to a
// single "Menu" bucket of plain food items when no Menu doc exists yet.
async function loadMenuCategories(restaurantId) {
  const menu = await getMenuByRestaurantId(restaurantId).catch(() => null);

  if (menu?.menu?.length) {
    const categories = menu.menu
      .filter((cat) => cat.items?.length)
      .map((cat) => ({ category: cat.category || 'Other', items: cat.items }));

    if (categories.length > 0) return categories;
  }

  const items = await getFoodItemsByRestaurant(restaurantId).catch(() => []);
  return items.length > 0 ? [{ category: 'Menu', items }] : [];
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const restaurant = await getRestaurantById(id);
    return { title: restaurant ? restaurant.name : 'Restaurant not found' };
  } catch {
    return { title: 'Restaurant not found' };
  }
}

export default async function RestaurantDetailPage({ params }) {
  const { id } = await params;

  let restaurant;
  try {
    restaurant = await getRestaurantById(id);
  } catch {
    notFound();
  }

  if (!restaurant) {
    notFound();
  }

  const { name, address, ratings, numOfReviews, images } = restaurant;
  const image = images?.[0]?.url;
  const categories = await loadMenuCategories(id);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="h-56 w-full object-cover sm:h-72" />
        ) : (
          <div className="flex h-56 w-full items-center justify-center bg-slate-100 text-slate-400 sm:h-72">
            No image
          </div>
        )}
        <div className="p-5 sm:p-6">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{name}</h1>

          {address && (
            <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
              <span>{address}</span>
            </div>
          )}

          <div className="mt-3 flex items-center gap-2 text-sm">
            <StarRating rating={ratings} />
            <span className="font-medium text-slate-800">{Number(ratings || 0).toFixed(1)} stars</span>
            <span className="text-slate-400">&middot;</span>
            <span className="text-slate-500">{numOfReviews || 0} reviews</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <h2 className="mb-4 text-xl font-bold text-slate-900 sm:text-2xl">Menu</h2>

      {categories.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No menu available yet.
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {categories.map(({ category, items }) => (
            <div key={category}>
              <h3 className="mb-3 text-lg font-semibold text-slate-800">{category}</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {items.map((item) => (
                  <MenuItemCard key={item._id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
