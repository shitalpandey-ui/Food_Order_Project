'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import BrandPanel from '@/components/BrandPanel';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-400px flex items-center justify-center bg-[#14100E] px-6 py-12">
      
      {/* Card Wrapper containing both sides side-by-side */}
      <div className="w-full max-w-7xl min-h-[600px] flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl bg-[#1C1815] border border-[#2A2420]">
        
        {/* Left Side: Brand Panel */}
        <BrandPanel />

        {/* Right Side: Login Form (Cream background matching the reference) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-[#F5EFE6] text-[#1C1815]">
          <div className="w-full max-w-md space-y-6">
            
            {/* Toggle Tabs (Log in / Sign up) */}
            <div className="flex rounded-3xl h-13 bg-[#E8E2D5] p-4 mb-10">
              <Link
                href="/login"
                className="w-1/2  padding-4 text-center text-xl font-semibold rounded-lg bg-white shadow-xs text-charcoal"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="w-1/2 py-20 text-center text-xl font-semibold text-[#7A7062] hover:text-charcoal transition-colors"
              >
                Sign up
              </Link>
            </div>

            {error && (
              <div className="rounded-lg bg-red-100 p-4 text-sm text-red-700 border border-red-200">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="block text-[1rem]  font-mono  font-bold uppercase tracking-wider text-[#7A7062]">
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
                <div className="flex items-center justify-between">
                  <label className="block text-[1rem] font-mono font-bold uppercase tracking-wider text-[#7A7062]">
                    Password
                  </label>
                  <a href="#" className="text-m font-medium text-[#C1442E] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl bg-white border border-[#E0D8CC] px-4 py-3 text-m text-charcoal shadow-sm focus:border-turmeric focus:outline-none focus:ring-1 focus:ring-turmeric"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#1C1815] px-4 py-3.5 text-xl font-semibold text-black shadow-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-charcoal focus:ring-offset-2 disabled:opacity-50 transition-all"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            <p className="text-center text-m text-[#7A7062] pt-2">
              New to QuickBItes?{' '}
              <Link href="/register" className="font-m text-[#C1442E] hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}