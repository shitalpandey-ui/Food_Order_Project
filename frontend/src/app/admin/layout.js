"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!loading && (!user || user.role !== "admin")) {
  //     router.push("/");
  //   }
  // }, [user, loading, router]);

  // if (loading || !user || user.role !== "admin") {
  //   return (
  //     <div className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-500">
  //       {loading ? "Loading..." : "Redirecting..."}
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-6 mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-amber-700">Admin Panel</h1>
        <nav className="flex gap-4 text-sm font-medium">
          <Link href="/admin" className="hover:text-amber-700">
            Dashboard
          </Link>
          <Link href="/admin/restaurants" className="hover:text-amber-700">
            Restaurants
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
