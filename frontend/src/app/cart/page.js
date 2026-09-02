"use client";

import { useCart } from "@/hooks/useCart";
import Link from 'next/link';
import CartItem from "@/components/CartItem";
import CartSummary from "@/components/CartSummary";

export default function CartPage() {
  const { items, hydrated, error } = useCart();

  // Avoid flashing "empty cart" before localStorage/the server cart has loaded.
  if (!hydrated) {
    return <div className="max-w-5xl mx-auto px-4 py-10">Loading cart…</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Your Cart</h1>

      {error && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <div className="text-center py-20 text-2xl text-gray-500">
          <p>Your cart is empty.</p>
          <Link href= "/restaurants" className="inline-block mt-3 text-xl text-orange-600 hover:underline">
            Browse restaurants
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Item list */}
          <div className="lg:col-span-2">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}