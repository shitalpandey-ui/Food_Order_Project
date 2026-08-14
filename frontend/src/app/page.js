'use client'; // marks this as a client component

import { useState, useEffect } from 'react'; // used for state and side effects
import Image from 'next/image'; // from next.js for optimized images and client side navigation
import Link from 'next/link';
import { getRestaurants } from '@/services/api';
import Loader from '@/components/Loader';
import RestaurantCard from '@/components/RestaurantCard';

const categories = [
  { name: 'Pizza', icon: '/images/pizza.png' },
  { name: 'Burger', icon: '/images/burger.png' },
  { name: 'Newari', icon: '/images/newari.png' },
  { name: 'Indian', icon: '/images/indian.png' },
  { name: 'Bakery', icon: '/images/bakery.png' },
  { name: 'Healthy', icon: '/images/healthy.png' },
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
        className="relative flex h-[300px] items-center justify-center bg-cover bg-center text-center text-white mb-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/hero-bg.jpg')",
        }}
      >
        <div className="px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Instant Gratification
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Order food from your favourite restaurants.
          </p>

          <div className="mx-auto flex max-w-2xl flex-col gap-7 rounded-full bg-white p-2 shadow-md sm:flex-row sm:gap-0">
            <input
              type="text"
              placeholder="Enter your delivery address or restaurant name...."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white px-6 py-3 rounded-full text-gray-900 placeholder:text-gray-400 outline-none text 3xl text-center shadow-md"
            />
          
<div className="flex flex-col items-center gap-3 min-w-[100px] cursor-pointer transition-transform duration-200 hover:-translate-y-1">
  
  <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-border overflow-hidden">
  
</div>
            <button
              className="rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
              onClick={handleSearch}
            >
              Find Food
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Categories Section */}
        <section className="mb-16">
          <h2 className="mb-100 text-2xl md:text-3xl font-bold text-gray-800">
            What are you craving?
          </h2>
          <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="flex min-w-[100px] cursor-pointer flex-col items-center gap-3 transition-transform hover:-translate-y-1"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
                  <Image
                    src={cat.icon}
                    alt={cat.name}
                    width={60}
                    height={60}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Restaurants */}
        <section id="featured-restaurants" className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Featured Restaurants
            </h2>
            <Link
              href="/restaurants"
              className="font-semibold text-orange-500 hover:text-orange-600"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredRestaurants.length === 0 ? (
            <p className="text-gray-600">
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