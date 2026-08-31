"use client";

import { useContext } from "react";
import { CartContext } from "@/context/CartContext";

/**
 * Convenience hook so components don't need to import
 * `useContext` + `CartContext` everywhere. Throws early if
 * a component forgets to render inside <CartProvider>.
 */
export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a <CartProvider>");
  }

  return context;
}