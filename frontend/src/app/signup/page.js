"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import BrandPanel from "@/components/BrandPanel";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const pathname = usePathname();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup({ name, email, password });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#14100E] px-6 py-12">
      <div className="w-full max-w-7xl min-h-[600px] flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl bg-[#1C1815] border border-[#2A2420]">
        {/* Left Side: Brand Panel */}
        <BrandPanel />

        {/* Right Side: Signup Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-[#F5EFE6] text-[#1C1815]">
          <div className="w-full max-w-md flex flex-col *:gap-6">
            {/* Toggle Tabs (Log in / Sign up) */}
            <div className="flex rounded-4xl h-20 bg-[#E8E2D5] p-5 mb-10">
              <Link
  href="/login"
  className={`w-1/2 flex items-center justify-center text-center text-2xl font-mediumbold rounded-lg transition-colors ${
    pathname === "/login"
      ? "bg-white shadow-m text-[#1C1815]"
      : "text-[#7A7062] hover:bg- #f26522 hover:text-charcoal-500"
  }`}>

  Log in
</Link>
<Link
  href="/signup"
  className={`w-1/2 flex items-center justify-center text-center text-2xl font-mediumbold rounded-lg transition-colors ${
    pathname === "/signup"
      ? "bg-white shadow-m text-[#1C1815]"
      : "text-[#7A7062] hover:bg- #f26522 hover:text-charcoal-500"
  }`}>

  Sign up
</Link>
            </div>

            {error && (
              <div className="rounded-lg bg-red-100 p-4 text-sm text-red-700 border border-red-200">
                {error}
              </div>
            )}

            <form className="space-y-5 my-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="space-y-1">
                  <label className="block text-[1rem] font-mono font-bold uppercase tracking-wider text-[#7A7062]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-xl bg-white border border-[#E0D8CC] px-4 py-3 text-m text-charcoal shadow-sm focus:border-turmeric focus:outline-none focus:ring-1 focus:ring-turmeric"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[1rem] font-mono font-bold uppercase tracking-wider text-[#7A7062]">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl bg-white border border-[#E0D8CC] px-4 py-3 text-m text-charcoal shadow-sm focus:border-turmeric focus:outline-none focus:ring-1 focus:ring-turmeric"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[1rem] font-mono font-bold uppercase tracking-wider text-[#7A7062]">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl bg-white border border-[#E0D8CC] px-4 py-3 text-m text-charcoal shadow-sm focus:border-turmeric focus:outline-none focus:ring-1 focus:ring-turmeric"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[1rem] font-mono font-bold uppercase tracking-wider text-[#7A7062]">
                     Confirm Password
                  </label>
                 <input
                    type="passwordconfirm"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl bg-white border border-[#E0D8CC] px-4 py-3 text-m text-charcoal shadow-sm focus:border-turmeric focus:outline-none focus:ring-1 focus:ring-turmeric"
                    placeholder="••••••••"
                  />
                </div>

                  <div className="space-y-1">
                     <label className="block text-[1rem] font-mono font-bold uppercase tracking-wider text-[#7A7062]">
                    Phone Number
                  </label>
                 <input
                    type="phoneNumber"
                    required
                    className="block w-full rounded-xl bg-white border border-[#E0D8CC] px-4 py-3 text-m text-charcoal shadow-sm focus:border-turmeric focus:outline-none focus:ring-1 focus:ring-turmeric"
                    placeholder="Enter your number.."
                  />
                  </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#1C1815] px-4 py-3.5 text-xl font-semibold text-white shadow-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-charcoal focus:ring-offset-2 disabled:opacity-50 transition-all"
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <p className="text-center text-m text-[#7A7062]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-[#C1442E] hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}