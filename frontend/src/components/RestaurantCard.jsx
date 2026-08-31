//a reusable UI card used in your restaurant listing page to display summary information for an individual restaurant

'use client';

import { useRouter } from 'next/navigation';
import { Star, StarHalf, MapPin, Square as SquareIcon, Dot } from 'lucide-react';
import { useCart } from "@/hooks/useCart";


function StarRating({ rating }) {
  const safeRating = Number(rating) || 0;
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating - fullStars >= 0.5;
  const { addItem } = useCart();
      <button onClick={() => addItem(food)}>Add to cart</button>

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

export default function RestaurantCard({ restaurant }) {
  const router = useRouter();
  const { id, name, description, cuisine, rating, reviewCount, priceLevel, address, dietType, image } = restaurant;

  // `rating` can be missing/null/a string depending on the data source.
  // Normalize it once here so nothing downstream has to guess.
  const numericRating = Number(rating);
  const hasValidRating = rating !== null && rating !== undefined && !Number.isNaN(numericRating);
  const ratingDisplay = hasValidRating ? numericRating.toFixed(1) : 'No';

  const numericReviewCount = Number(reviewCount);
  const reviewCountDisplay = Number.isFinite(numericReviewCount) ? numericReviewCount : 0;

  const handleView = () => {
    router.push(`/restaurants/${id}`);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">No image</div>
        )}
        {cuisine && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur">
            {cuisine}
          </span>
        )}
        {dietType && (
          <span className="absolute right-3 top-3">
            <DietBadge dietType={dietType} />
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold leading-snug text-slate-900 sm:text-lg">{name}</h3>
          {priceLevel && <span className="shrink-0 text-sm font-medium text-slate-500">{priceLevel}</span>}
        </div>

        <p className="line-clamp-2 text-sm text-slate-600">{description}</p>

        {address && (
          <div className="flex items-start gap-1.5 text-sm text-slate-500">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} aria-hidden="true" />
            <span className="line-clamp-1">{address}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <StarRating rating={numericRating} />
          <span className="font-medium text-slate-800">
            {hasValidRating ? `${ratingDisplay} stars` : 'No ratings yet'}
          </span>
          {reviewCountDisplay > 0 && (
            <>
              <span className="text-slate-400">&middot;</span>
              <span className="text-slate-500">{reviewCountDisplay} reviews</span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleView}
          className="mt-auto inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
          View Menu
        </button>
      </div>
    </div>
  );
}