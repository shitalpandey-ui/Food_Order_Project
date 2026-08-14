"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-red-600">
        QuickBites
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/restaurants">Restaurants</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/login">Login</Link>
        </nav>
      </div>
    </header>
  );
}