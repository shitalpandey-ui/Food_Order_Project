"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-2 z-50 bg-white border-b">
      <div className="max-w-8xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-6xl font-bold text-amber-500">
        QuickBites
        </Link>

        <nav className="flex items-center gap-6 text-3xl font-medium">
          <Link href="/restaurants">Restaurants</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/login">Login</Link>
        </nav>
      </div>
    </header>
  );
}