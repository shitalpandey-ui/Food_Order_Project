// for restaurant details

// src/app/(main)/restaurant/[id]/page.js
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getRestaurantById } from '@/services/api';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import FoodCard from '@/components/Food/FoodCard/FoodCard';
import Loader from '@/components/Loader/Loader';


export default function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { cart, subtotal } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRestaurantById(id);
        setRestaurant(data);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) return <Loader />;
  if (!restaurant) return <div>Restaurant not found</div>;

  return (
    <main className={styles.main}>
      <Navbar />
      
      {/* Restaurant Banner */}
      <div className={styles.banner}>
        <Image 
          src={restaurant.coverImage || '/images/default-banner.jpg'} 
          alt={restaurant.name} 
          layout="fill" 
          objectFit="cover" 
        />
        <div className={styles.bannerOverlay}>
          <div className="container">
            <div className={styles.restaurantHeader}>
              <div className={styles.logoWrapper}>
                <Image src={restaurant.logo || '/images/default-logo.png'} alt={restaurant.name} width={100} height={100} />
              </div>
              <div className={styles.info}>
                <h1>{restaurant.name}</h1>
                <p>{restaurant.cuisines.join(', ')}</p>
                <div className={styles.stats}>
                  <span>⭐ {restaurant.rating} Ratings</span>
                  <span>🕒 {restaurant.deliveryTime} mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.contentLayout}>
          {/* Categories Sidebar */}
          <aside className={styles.sidebar}>
            <h3>Categories</h3>
            <ul>
              {['All', ...restaurant.categories].map((cat) => (
                <li 
                  key={cat} 
                  className={activeCategory === cat ? styles.activeCat : ''}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </aside>

          {/* Menu Items */}
          <section className={styles.menu}>
            <h2>{activeCategory}</h2>
            <div className={styles.foodGrid}>
              {restaurant.menu
                .filter(item => activeCategory === 'All' || item.category === activeCategory)
                .map((item) => (
                  <FoodCard key={item._id} item={item} />
                ))}
            </div>
          </section>

          {/* Mini Cart */}
          <aside className={styles.cartSidebar}>
            <div className={styles.cartHeader}>
              <h3>Your Cart</h3>
              <span>{cart.length} items</span>
            </div>
            {cart.length === 0 ? (
              <div className={styles.emptyCart}>
                <p>Your cart is empty.</p>
              </div>
            ) : (
              <>
                <div className={styles.cartItems}>
                  {cart.map((item) => (
                    <div key={item.id} className={styles.cartItem}>
                      <div className={styles.itemInfo}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemPrice}>Rs. {item.price} x {item.quantity}</span>
                      </div>
                      <span className={styles.totalItemPrice}>Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.cartFooter}>
                  <div className={styles.subtotal}>
                    <span>Subtotal</span>
                    <span>Rs. {subtotal}</span>
                  </div>
                  <button className="btn-primary w-full">Checkout</button>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
