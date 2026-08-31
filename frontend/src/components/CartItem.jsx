"use client";

import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/app/formatPrice";

export default function CartItem({ item }) {
  const { toggleSelect, setQty, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200">
      {/* Select checkbox */}
      <input
        type="checkbox"
        checked={item.selected}
        onChange={() => toggleSelect(item.id)}
        className="w-4 h-4 accent-orange-600 shrink-0"
        aria-label={`Select ${item.name}`}
      />

      {/* Image */}
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        {item.image && (
          <Image src={item.image} alt={item.name} fill className="object-cover" />
          
        )}
      </div>
       <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        {restaurant.image && (
        <Image src={restaurant.image} alt={restaurant.name} width={300} height={200} className="object-cover" />  
          
        )}
      </div>

      {/* Name + price */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{item.name}</p>
        <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>

        {/* Quantity stepper */}
        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            onClick={() => setQty(item.id, item.qty - 1)}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-6 text-center text-sm">{item.qty}</span>
          <button
            type="button"
            onClick={() => setQty(item.id, item.qty + 1)}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Line total + remove */}
      <div className="text-right shrink-0">
        <p className="font-semibold text-gray-900">{formatPrice(item.price * item.qty)}</p>
        <button
          type="button"
          onClick={() => removeItem(item.id)}
          className="text-xs text-red-600 hover:underline mt-2"
        >
          Remove
        </button>
      </div>
    </div>
  );
}