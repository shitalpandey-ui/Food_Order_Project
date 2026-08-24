"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-2 z-30 bg-white border-b">
      <div className="max-w-8xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-6xl font-bold text-amber-700">
          QuickBites
        </Link>

        <nav className="flex items-center gap-12 text-3xl font-medium ">
          <Link href="/restaurants" className="hover:text-amber-700">Restaurants</Link>
          <Link href="/cart" className="hover:text-amber-700">Cart</Link>
          <Link href="/orders" className="hover:text-amber-700">Orders</Link>

          {loading ? null : user ? (
            <div className="flex items-center gap-4">
              {user.role === "admin" && (
                <Link href="/admin" className="hover:text-amber-700">Admin</Link>
              )}
              <span className="text-amber-700">{user.name}</span>
              <button
                onClick={logout}
                className="hover:text-amber-700 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="hover:text-amber-700">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
