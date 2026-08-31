"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/app/formatPrice";

export default function CartSummary() {
  const { items, selectedItems, allSelected, subtotal, selectAll } = useCart();
  const router = useRouter();

  const hasSelection = selectedItems.length > 0;

  const handleCheckout = () => {
    if (!hasSelection) return;
    // Selected items already live in CartContext, so the checkout
    // page can read them straight from useCart() - no need to pass
    // anything through the URL or query params.
    router.push("/checkout");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-6">
      {/* Select all */}
      <label className="flex items-center gap-2 text-sm text-gray-700 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) => selectAll(e.target.checked)}
          disabled={items.length === 0}
          className="w-4 h-4 accent-orange-600"
        />
        Select all ({items.length})
      </label>

      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Items selected</span>
        <span>{selectedItems.length}</span>
      </div>

      <div className="flex justify-between text-base font-semibold text-gray-900 border-t border-gray-200 pt-3 mt-3">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>

      <button
        type="button"
        onClick={handleCheckout}
        disabled={!hasSelection}
        className={`w-full mt-5 py-3 rounded-full font-medium transition-colors ${
          hasSelection
            ? "bg-orange-600 text-white hover:bg-orange-700"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {hasSelection
          ? `Place order (${selectedItems.length} item${selectedItems.length === 1 ? "" : "s"})`
          : "Select items to order"}
      </button>
    </div>
  );
}