//restaurant detail page

import { notFound } from 'next/navigation';
import { Star, StarHalf, MapPin, Square as SquareIcon, Dot } from 'lucide-react';
import { getRestaurantById } from '@/app/restaurants/restaurant';
import { getMenuByRestaurantId } from '@/app/restaurants/menu';

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

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

function Square({ color }) {
  const colorClass = color === 'green' ? 'text-green-600' : 'text-red-600';
 
  return (
    <span className={`relative inline-flex h-3.5 w-3.5 items-center justify-center ${colorClass}`}>
      <SquareIcon className="absolute inset-0 h-3.5 w-3.5" strokeWidth={2} />
      <Dot className="h-3.5 w-3.5" strokeWidth={6} />
    </span>
  );
}
 
function DietBadge({ dietType }) {
  if (!dietType) return null;
 
  const isVeg = dietType === 'veg';
  const isNonVeg = dietType === 'non-veg';
  const isBoth = dietType === 'both';
 
  const label = isVeg ? 'Vegetarian' : isNonVeg ? 'Non-vegetarian' : 'Veg & non-veg options';
 
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 shadow-sm backdrop-blur"
      title={label}
      aria-label={label}
    >
      {isBoth ? (
        <span className="inline-flex items-center gap-1">
          <Square color="green" />
          <Square color="red" />
        </span>
      ) : (
        <Square color={isVeg ? 'green' : 'red'} />
      )}
    </span>
  );
}

function MenuItemCard({ item }) {
  return (
    <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {item.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt={item.name} className="h-20 w-20 shrink-0 rounded-lg object-cover" />
      )}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <DietBadge dietType={item.dietType} />
            <h4 className="text-sm font-semibold text-slate-900 sm:text-base">{item.name}</h4>
          </div>
          <span className="shrink-0 text-sm font-semibold text-slate-800">Rs {item.price}</span>
        </div>
        {item.description && <p className="line-clamp-2 text-sm text-slate-500">{item.description}</p>}
      </div>
    </div>
  );
}

function groupByCategory(menu) {
  return menu.reduce((groups, item) => {
    const category = item.category || 'Other';
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {});
}
//It reads the route parameter (id), fetches the restaurant details,
//  and sets the page title to the restaurant's name. If the restaurant doesn't exist,
//  it defaults to "Restaurant not found"
export async function generateMetadata({ params }) {
  const { id } = await params;
  const restaurant = getRestaurantById(id);
  return { title: restaurant ? restaurant.name : 'Restaurant not found' };
}
// It checks if a restaurant exists for the given id. 
// If no restaurant is found, it calls Next.js’s built-in notFound() helper,
//  which automatically triggers a 404 Not Found error page.
 export default async function RestaurantDetailPage({ params }) {
  const { id } = await params;
  const restaurant = getRestaurantById(id);

  if (!restaurant) {
    notFound();
  }
// It shows how restaurant detail will be displayed
  const { name, description, cuisine, address, rating, reviewCount, priceLevel, image } = restaurant;
  const menu = getMenuByRestaurantId(restaurant.id);
  const groupedMenu = groupByCategory(menu);
  const categories = Object.keys(groupedMenu);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="h-56 w-full object-cover sm:h-72" />
        )}
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{name}</h1>
            {priceLevel && <span className="text-sm font-medium text-slate-500">{priceLevel}</span>}
          </div>
          {cuisine && <p className="mt-1 text-sm font-medium text-orange-600">{cuisine}</p>}
          <p className="mt-2 text-sm text-slate-600">{description}</p>

          {address && (
            <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
              <span>{address}</span>
            </div>
          )}

          <div className="mt-3 flex items-center gap-2 text-sm">
            <StarRating rating={rating} />
            <span className="font-medium text-slate-800">{rating.toFixed(1)} stars</span>
            <span className="text-slate-400">&middot;</span>
            <span className="text-slate-500">{reviewCount} reviews</span>
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
          {categories.map((category) => (
            <div key={category}>
              <h3 className="mb-3 text-lg font-semibold text-slate-800">{category}</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {groupedMenu[category].map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
 }