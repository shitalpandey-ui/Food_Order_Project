export const MENUS_BY_RESTAURANT = {
  'sakura-ramen': [
    {
      id: 'tonkotsu-classic',
      name: 'Classic Tonkotsu Ramen',
      description: '18-hour pork bone broth, hand-pulled noodles, chashu, soft-boiled egg.',
      category: 'Ramen',
      price: 450,
      dietType: 'non-veg',
      image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'veggie-ramen',
      name: 'Garden Vegetable Ramen',
      description: 'Shiitake-kombu broth, tofu, bok choy, corn, mushrooms.',
      category: 'Ramen',
      price: 400,
      dietType: 'veg',
      image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'gyoza',
      name: 'Pan-Fried Pork Gyoza',
      description: 'Six pieces, crispy bottoms, served with ponzu dipping sauce.',
      category: 'Starters',
      price: 250,
      dietType: 'non-veg',
      image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?q=80&w=600&auto=format&fit=crop',
    },
  ],
  'taco-house': [
    {
      id: 'al-pastor-taco',
      name: 'Al Pastor Tacos (3pc)',
      description: 'Slow-roasted pork, pineapple, onion, cilantro on corn tortillas.',
      category: 'Tacos',
      price: 280,
      dietType: 'non-veg',
      image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'guac-chips',
      name: 'Guacamole & Chips',
      description: 'Fresh-mashed avocado, lime, cilantro, house-fried chips.',
      category: 'Starters',
      price: 220,
      dietType: 'veg',
      image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=80&w=600&auto=format&fit=crop',
    },
  ],
  'green-basil': [
    {
      id: 'green-curry',
      name: 'Green Curry',
      description: 'Coconut milk, Thai basil, bamboo shoots, choice of protein.',
      category: 'Curries',
      price: 380,
      dietType: 'both',
      image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=600&auto=format&fit=crop',
    },
  ],
  'the-square': [
    {
      id: 'margherita-pizza',
      name: 'Margherita Pizza',
      description: 'Wood-fired, San Marzano tomato, fresh mozzarella, basil.',
      category: 'Pizza',
      price: 420,
      dietType: 'veg',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop',
    },
  ],
  'daily-sushi': [
    {
      id: 'salmon-nigiri',
      name: 'Salmon Nigiri (2pc)',
      description: 'Fresh salmon over seasoned sushi rice.',
      category: 'Nigiri',
      price: 320,
      dietType: 'non-veg',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=600&auto=format&fit=crop',
    },
  ],
  'angan-sweets': [
    {
      id: 'kaju-katli',
      name: 'Kaju Katli',
      description: 'Cashew-based sweet, silver leaf topping.',
      category: 'Sweets',
      price: 200,
      dietType: 'veg',
      image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?q=80&w=600&auto=format&fit=crop',
    },
  ],
  'bishram-cafe': [
    {
      id: 'cappuccino',
      name: 'Cappuccino',
      description: 'Double espresso, steamed milk, thick foam.',
      category: 'Coffee',
      price: 180,
      dietType: 'veg',
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop',
    },
  ],
};

export function getMenuByRestaurantId(id) {
  return MENUS_BY_RESTAURANT[id] ?? [];
}