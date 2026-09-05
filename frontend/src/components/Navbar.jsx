"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { GiChefToque } from "react-icons/gi";
import { FiHome,  FiStar,  FiBook,  FiPhone,  FiShoppingCart, FiLogOut, FiKey } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-2 z-30 bg-white border-b">
      <div className="max-w-8xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-6xl font-bold text-amber-700"
        >
          <GiChefToque className="text-6xl" />
          QuickBites
        </Link>

        <nav className="flex items-center gap-8 text-3xl font-medium">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 border-2 border-transparent rounded-full hover:text-amber-700 hover:bg-amber-900/5 hover:border-amber-900/20 transition-all duration-300"
          >
            <FiHome />
            Home
          </Link>
          <Link
            href="/menu"
            className="flex items-center gap-2 px-4 py-2 border-2 border-transparent rounded-full hover:text-amber-700 hover:bg-amber-900/5 hover:border-amber-900/20 transition-all duration-300"
          >
            <FiBook />
            Menu
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-2 px-4 py-2 border-2 border-transparent rounded-full hover:text-amber-700 hover:bg-amber-900/5 hover:border-amber-900/20 transition-all duration-300"
          >
            <FiStar />
            About
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-4 py-2 border-2 border-transparent rounded-full hover:text-amber-700 hover:bg-amber-900/5 hover:border-amber-900/20 transition-all duration-300"
          >
            <FiPhone />
            Contact Us
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center px-4 py-2 border-2 border-transparent rounded-full hover:text-amber-700 hover:bg-amber-900/5 hover:border-amber-900/20 transition-all duration-300"
          >
            <FiShoppingCart />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          
         {loading ? null : user ? (
  <div className="flex items-center gap-4">
    {user.role === "admin" && (
      <Link
        href="/admin"
        className="flex items-center gap-2 px-4 py-2 border-2 border-transparent rounded-full hover:text-amber-700 hover:bg-amber-900/5 hover:border-amber-900/20 transition-all duration-300"
      >
        Admin
      </Link>
    )}
    {user.role !== "admin" && (
      <span className="text-amber-700">{user.name}</span>
    )}
    <button
      onClick={logout}
      className="flex items-center gap-1 hover:text-amber-700 cursor-pointer"
    >
      <FiLogOut />
      Logout
    </button>
  </div>
          ) : (
            <Link href="/login" className="flex items-center gap-2 px-4 py-2 border-2 border-20% rounded-full hover:text-amber-700 hover:bg-amber-900/5 ">
              <FiKey />
              Login
              
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}