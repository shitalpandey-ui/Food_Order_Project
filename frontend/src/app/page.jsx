//logged in user dashboard

'use client'; // marks this as a client component


import { useState, useEffect } from 'react'; // used for state and side effects
import Image from 'next/image'; // from next.js for optimized images and client side navigation
import Link from 'next/link';

import { getRestaurants } from '@/services/api';
import Loader from '@/components/Loader';
import RestaurantCard from '@/components/RestaurantCard';


const categories = [
  { name: 'Pizza', icon: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop' },
  { name: 'Burger', icon: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&auto=format&fit=crop' },
  { name: 'Newari', icon: 'https://images.unsplash.com/photo-1593252719532-53f183016149?w=600&auto=format&fit=crop' },
  { name: 'Indian', icon: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=300&auto=format&fit=crop' },
  { name: 'Bakery', icon: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600&auto=format&fit=crop' },
  { name: 'Healthy', icon: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=300&auto=format&fit=crop' },
];

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setError('Something went wrong while loading restaurants.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredRestaurants = restaurants.filter((res) =>
    res.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    // searchQuery already drives filteredRestaurants live,
    // so this just scrolls the user down to the results (optional UX touch)
    document
      .getElementById('featured-restaurants')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero */}
      <section
        className="relative flex h-[600px] items-center justify-center bg-cover bg-center text-center text-white mb-40 "
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/hero-bg.jpg')",
        }}
      >
        <div className="px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-5 ">
            Instant Gratification
          </h1>
          <p className="text-lg md:text-xl mb-4">
            Order food from your favourite restaurants.
          </p>

          <div  className="mx-auto flex max-w-full h-20 flex-col gap-3 rounded-full bg-white p-3 shadow-md sm:flex-row sm:gap-5">
            <input
              type="text"
              placeholder="Enter your delivery address or restaurant name...."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-4 bg-white px-7 py-4 rounded-full text-gray-900 placeholder:text-gray-400 outline-none text 5xl text-center shadow-md"
            />
          
<div className="flex flex-col items-center gap-3 min-w-[100px] cursor-pointer transition-transform duration-200 hover:-translate-y-1">
  
  <div className="w-10 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-border overflow-hidden">
    
  </div>

  <span className="font-semibold text-xl">Pizza</span>
</div>
            <button
              className="rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
              onClick={handleSearch}
            >
              Find 
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Categories Section */}
        <section className="mb-10">
          <h2 className="mb-20 text-3xl md:text-5xl font-bold text-gray-800">
            What are you craving?
          </h2>
          <div className=" flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="flex min-w-[120px] cursor-pointer flex-col items-center gap-3 transition-transform hover:-translate-y-1"
              >
                <div className="flex h-35 w-35 gap-3 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm  hover:text-amber-700">
                  <img
                  src={cat.icon} 
                  alt={cat.name} 
                  className="w-30 h-30 rounded-full object-cover" />
                </div>
                <span className="text-xl font-semibold text-gray-800">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Restaurants */}
        <section id="featured-restaurants" className="mb-50">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-4xl md:text-3xl font-bold text-gray-800">
              Featured Restaurants
            </h2>
            <Link
              href="/restaurants"
              className="font-semibold text-2xl text-black hover:text-orange-700"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredRestaurants.length === 0 ? (
            <p className="text-gray-600 text-2xl">
              No restaurants found matching &quot;{searchQuery}&quot;.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(350px,1fr))]">
              {filteredRestaurants.map((res) => (
                <RestaurantCard key={res._id} restaurant={res} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}