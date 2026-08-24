import Link from 'next/link';

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="restaurant-card">
      {/* <img
        src={restaurant.images?.[0]?.url || '/placeholder.jpg'}
        alt={restaurant.name}
      /> */}
      <h3>{restaurant.name}</h3>
      <p>{restaurant.address}</p>
      <p>Rating: {restaurant.ratings}</p>
      <Link href={`/restaurants/${restaurant._id}`}>View Menu</Link>
    </div>
  );
};

export default RestaurantCard;