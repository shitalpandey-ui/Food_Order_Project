"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      <p className="text-xl text-gray-600 mb-6">Manage restaurants and their food items.</p>
      <Link
        href="/admin/restaurants"
        className="inline-block bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800"
      >
        Manage Restaurants
      </Link>
    </div>
  );
}
