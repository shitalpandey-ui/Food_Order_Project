"use client";

import { createContext, useReducer, useEffect, useMemo, useCallback, useContext, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
import { cartService, normalizeServerCart } from "@/services/cartService";

/**
 * Cart item shape (kept flat so it's easy to persist/serialize):
 * {
 *   id: string             -> food item id from the backend
 *   restaurantId: string
 *   name: string
 *   price: number
 *   image: string
 *   qty: number
 *   selected: boolean      -> whether this line is included in "place order"
 * }
 *
 * Guests (not logged in) get a localStorage-backed cart, exactly as before.
 * Once logged in, the cart is synced with the backend (GET/POST/PATCH/DELETE
 * /cart) instead - any items sitting in the guest cart at login time are
 * merged into the server cart once, then localStorage is cleared.
 */

const STORAGE_KEY = "cart:items";

const initialState = {
  items: [],
  hydrated: false, // becomes true once we've read localStorage (guest) or fetched the server cart
};

// Preserves each item's local-only `selected` flag across a refresh from
// the server, defaulting new items to selected so they're included in
// checkout right away.
function mergeSelection(prevItems, incomingItems) {
  const selectedById = new Map(prevItems.map((i) => [i.id, i.selected]));
  return incomingItems.map((i) => ({
    ...i,
    selected: selectedById.has(i.id) ? selectedById.get(i.id) : true,
  }));
}

function cartReducer(state, action) {
  switch (action.type) {
    case "HYDRATE": {
      return { ...state, items: action.payload, hydrated: true };
    }

    case "SET_ITEMS": {
      return { ...state, items: mergeSelection(state.items, action.payload), hydrated: true };
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

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [error, setError] = useState("");
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const authLoading = auth?.loading ?? false;

  // Tracks which mode last drove `hydrated`, so switching between guest and
  // logged-in doesn't get stuck showing stale items from the other mode.
  const syncedForUserId = useRef(undefined);

  // Guests: load the persisted cart once from localStorage.
  useEffect(() => {
    if (authLoading || user) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      dispatch({ type: "HYDRATE", payload: raw ? JSON.parse(raw) : [] });
    } catch {
      dispatch({ type: "HYDRATE", payload: [] });
    }
  }, [authLoading, user]);

  // Guests: persist on every change, once hydration has happened.
  useEffect(() => {
    if (user || !state.hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [user, state.items, state.hydrated]);

  // Logged in: merge any guest-cart items into the server cart once, then
  // fetch the authoritative server cart.
  useEffect(() => {
    if (authLoading || !user) return;
    if (syncedForUserId.current === user._id) return;
    syncedForUserId.current = user._id;

    (async () => {
      try {
        let raw;
        try {
          raw = window.localStorage.getItem(STORAGE_KEY);
        } catch {
          raw = null;
        }
        const guestItems = raw ? JSON.parse(raw) : [];

        for (const item of guestItems) {
          if (!item.restaurantId) continue; // can't merge a line with no restaurant reference
          await cartService.addItem({
            foodItemId: item.id,
            restaurantId: item.restaurantId,
            quantity: item.qty,
          });
        }
        if (guestItems.length > 0) {
          window.localStorage.removeItem(STORAGE_KEY);
        }

        const cart = await cartService.getCart();
        dispatch({ type: "SET_ITEMS", payload: normalizeServerCart(cart) });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load your cart");
        dispatch({ type: "HYDRATE", payload: [] });
      }
    })();
  }, [authLoading, user]);

  // Logged out (or never logged in): reset so a future login re-syncs cleanly.
  useEffect(() => {
    if (!user) syncedForUserId.current = undefined;
  }, [user]);

  // ---- Action helpers exposed to the rest of the app ----------
  const addItem = useCallback(
    async (food) => {
      if (!user) {
        dispatch({ type: "ADD_ITEM", payload: food });
        return;
      }
      try {
        const cart = await cartService.addItem({
          foodItemId: food.id,
          restaurantId: food.restaurantId,
          quantity: 1,
        });
        dispatch({ type: "SET_ITEMS", payload: normalizeServerCart(cart) });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to add item to cart");
      }
    },
    [user]
  );

  const removeItem = useCallback(
    async (id) => {
      if (!user) {
        dispatch({ type: "REMOVE_ITEM", payload: { id } });
        return;
      }
      try {
        const cart = await cartService.removeItem(id);
        dispatch({ type: "SET_ITEMS", payload: normalizeServerCart(cart) });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to remove item");
      }
    },
    [user]
  );

  const setQty = useCallback(
    async (id, qty) => {
      if (!user) {
        dispatch({ type: "SET_QTY", payload: { id, qty } });
        return;
      }
      try {
        if (qty <= 0) {
          const cart = await cartService.removeItem(id);
          dispatch({ type: "SET_ITEMS", payload: normalizeServerCart(cart) });
        } else {
          const cart = await cartService.updateItemQuantity(id, qty);
          dispatch({ type: "SET_ITEMS", payload: normalizeServerCart(cart) });
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to update quantity");
      }
    },
    [user]
  );

  const toggleSelect = useCallback((id) => dispatch({ type: "TOGGLE_SELECT", payload: { id } }), []);
  const selectAll = useCallback(
    (selected) => dispatch({ type: "SELECT_ALL", payload: { selected } }),
    []
  );
  const removeSelected = useCallback(() => dispatch({ type: "REMOVE_SELECTED" }), []);

  const clearCart = useCallback(async () => {
    if (!user) {
      dispatch({ type: "CLEAR_CART" });
      return;
    }
    try {
      await cartService.clearCart();
      dispatch({ type: "CLEAR_CART" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to clear cart");
    }
  }, [user]);

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
    error,
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

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}