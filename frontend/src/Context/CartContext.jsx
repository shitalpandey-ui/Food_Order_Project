"use client";

import { createContext, useReducer, useEffect, useMemo, useCallback } from "react";

/**
 * Cart item shape (kept flat so it's easy to persist/serialize):
 * {
 *   id: string          -> food item id from the backend
 *   restaurantId: string
 *   name: string
 *   price: number
 *   image: string
 *   qty: number
 *   selected: boolean   -> whether this line is included in "place order"
 * }
 */

const STORAGE_KEY = "cart:items";

const initialState = {
  items: [],
  hydrated: false, // becomes true once we've read localStorage, to avoid SSR mismatches
};

function cartReducer(state, action) {
  switch (action.type) {
    case "HYDRATE": {
      return { ...state, items: action.payload, hydrated: true };
    }

    case "ADD_ITEM": {
      const food = action.payload;
      const existing = state.items.find((i) => i.id === food.id);

      // Same item already in the cart -> just increase quantity.
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === food.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }

      // New line, selected by default so it's included in checkout immediately.
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: food.id,
            restaurantId: food.restaurantId,
            name: food.name,
            price: food.price,
            image: food.image,
            qty: 1,
            selected: true,
          },
        ],
      };
    }

    case "REMOVE_ITEM": {
      return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) };
    }

    case "SET_QTY": {
      const { id, qty } = action.payload;
      if (qty <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== id) };
      }
      return {
        ...state,
        items: state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
      };
    }

    case "TOGGLE_SELECT": {
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, selected: !i.selected } : i
        ),
      };
    }

    case "SELECT_ALL": {
      return {
        ...state,
        items: state.items.map((i) => ({ ...i, selected: action.payload.selected })),
      };
    }

    case "REMOVE_SELECTED": {
      // Used after an order is successfully placed - the ordered
      // lines leave the cart, anything left unselected stays.
      return { ...state, items: state.items.filter((i) => !i.selected) };
    }

    case "CLEAR_CART": {
      return { ...state, items: [] };
    }

    default:
      return state;
  }
}

export const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load persisted cart once on mount (client only - localStorage isn't
  // available during server rendering).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      dispatch({ type: "HYDRATE", payload: raw ? JSON.parse(raw) : [] });
    } catch {
      dispatch({ type: "HYDRATE", payload: [] });
    }
  }, []);

  // Persist on every change, once hydration has happened.
  useEffect(() => {
    if (!state.hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items, state.hydrated]);

  // ---- Action helpers exposed to the rest of the app ----------
  const addItem = useCallback((food) => dispatch({ type: "ADD_ITEM", payload: food }), []);
  const removeItem = useCallback((id) => dispatch({ type: "REMOVE_ITEM", payload: { id } }), []);
  const setQty = useCallback((id, qty) => dispatch({ type: "SET_QTY", payload: { id, qty } }), []);
  const toggleSelect = useCallback((id) => dispatch({ type: "TOGGLE_SELECT", payload: { id } }), []);
  const selectAll = useCallback(
    (selected) => dispatch({ type: "SELECT_ALL", payload: { selected } }),
    []
  );
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const removeSelected = useCallback(() => dispatch({ type: "REMOVE_SELECTED" }), []);

  // ---- Derived values (recomputed only when items change) -----
  const selectedItems = useMemo(() => state.items.filter((i) => i.selected), [state.items]);
  const allSelected = state.items.length > 0 && selectedItems.length === state.items.length;
  const subtotal = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.price * i.qty, 0),
    [selectedItems]
  );
  const itemCount = state.items.reduce((sum, i) => sum + i.qty, 0);

  const value = {
    items: state.items,
    hydrated: state.hydrated,
    selectedItems,
    allSelected,
    subtotal,
    itemCount,
    addItem,
    removeItem,
    setQty,
    toggleSelect,
    selectAll,
    clearCart,
    removeSelected,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}