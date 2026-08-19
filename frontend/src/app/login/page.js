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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#14100E] p-4 lg:p-8">
      
      {/* Card Wrapper containing both sides side-by-side */}
      <div className="w-full max-w-8xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl bg-[#1C1815] border border-[#2A2420]">
        
        {/* Left Side: Brand Panel */}
        <BrandPanel />

        {/* Right Side: Login Form (Cream background matching the reference) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-[#F5EFE6] text-[#1C1815]">
          <div className="w-full max-w-md space-y-6">
            
            {/* Toggle Tabs (Log in / Sign up) */}
            <div className="flex rounded-xl bg-[#E8E2D5] p-1.5 mb-6">
              <Link
                href="/login"
                className="w-1/2 py-2.5 text-center text-sm font-semibold rounded-lg bg-white shadow-sm text-charcoal"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="w-1/2 py-2.5 text-center text-sm font-medium text-[#7A7062] hover:text-charcoal transition-colors"
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
                <label className="block text-[0.7rem] font-mono font-bold uppercase tracking-wider text-[#7A7062]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl bg-white border border-[#E0D8CC] px-4 py-3 text-sm text-charcoal shadow-sm focus:border-turmeric focus:outline-none focus:ring-1 focus:ring-turmeric"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[0.7rem] font-mono font-bold uppercase tracking-wider text-[#7A7062]">
                    Password
                  </label>
                  <a href="#" className="text-xs font-medium text-[#C1442E] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl bg-white border border-[#E0D8CC] px-4 py-3 text-sm text-charcoal shadow-sm focus:border-turmeric focus:outline-none focus:ring-1 focus:ring-turmeric"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#1C1815] px-4 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-charcoal focus:ring-offset-2 disabled:opacity-50 transition-all"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            <p className="text-center text-xs text-[#7A7062] pt-2">
              New to Tiffin?{' '}
              <Link href="/register" className="font-medium text-[#C1442E] hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}