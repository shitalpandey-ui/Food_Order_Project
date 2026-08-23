

"use client";

import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is already logged in (e.g. via cookie/token) on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async ({ email, password }) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // needed if backend sets an httpOnly cookie
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Login failed");
    }

    const data = await res.json();
    setUser(data.user);
    router.push("/"); // or wherever you want to redirect after login
    return data;
  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
