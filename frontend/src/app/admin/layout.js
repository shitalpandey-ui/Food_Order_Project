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
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center gap-6 mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-amber-700"></h1>
        <nav className="flex gap-8 text-xl font-bold font-large">
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
