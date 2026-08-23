"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
import api from '@/services/api'; // adjust path to match your project

const RestaurantDetailPage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await api.get(`/restaurants/${id}`);
        setRestaurant(response.data.data); // unwrap "data"
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.address}</p>
      <p>Rating: {restaurant.ratings}</p>
      {/* menu section goes here once we wire up menu fetching */}
    </div>
  );
};

export default RestaurantDetailPage;