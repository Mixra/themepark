import React, { useState } from 'react';
import './css/GiftShops.css'; 
import Burger from '../../assets/images/BurgerSpot.jpeg';
import {GenericCard} from '../../components/Card';
import './css/Restauraunt.css';

type Restaurant = {
  id: number;
  Name: string;
  imageUrl: string;
  ClosingTime: string;
  OpeningTime: string;
  SeatingCapacity: number;
  Description: string;
  Menu: {
    Name: string;
    Description: string;
    Price: number;
    Category: string;
  }[];
};

// Assuming initialRestaurants is your initial data array
const initialRestaurants: Restaurant[] = [
  {
    id: 1,
    Name: 'Fat Burger',
    imageUrl: Burger,
    ClosingTime: '10:00 PM',
    OpeningTime: '8:00 AM',
    SeatingCapacity: 100,
    Description: 'Fat Burger, known for its juicy oversized burgers, offering a fun and flavorful escape for thrill-seekers and food lovers alike.',
    Menu: [
      {
        Name: 'Colossal Coaster Burger',
        Description: 'A towering feast featuring a trio of beef patties, layered with crispy bacon, cheddar cheese, onion rings, and a special coaster sauce, served on a toasted sesame bun.',
        Price: 12.99,
        Category: 'Main Course',
      },
      // Add more menu items as needed
    ],
  },
  {
    id: 2,
    Name: 'Fat Burger',
    imageUrl: Burger,
    ClosingTime: '10:00 PM',
    OpeningTime: '8:00 AM',
    SeatingCapacity: 100,
    Description: 'Fat Burger, known for its juicy oversized burgers, offering a fun and flavorful escape for thrill-seekers and food lovers alike.',
    Menu: [
      {
        Name: 'Colossal Coaster Burger',
        Description: 'A towering feast featuring a trio of beef patties, layered with crispy bacon, cheddar cheese, onion rings, and a special coaster sauce, served on a toasted sesame bun.',
        Price: 12.99,
        Category: 'Main Course',
      },
      // Add more menu items as needed
    ],
  },
  // Add more restaurants as needed
];

const RestaurantsPage: React.FC = () => {
  // Use useState to manage the restaurants state
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);

  // Handler function for deleting a restaurant
  const handleDelete = (id: number) => {
    setRestaurants(restaurants.filter(restaurant => restaurant.id !== id));
  };

  return (
    <div className="grid-container">
      {restaurants.map((restaurant) => (
        <GenericCard 
          key={restaurant.id} 
          item={restaurant} 
          onDelete={() => handleDelete(restaurant.id)} // Pass the delete handler
        >
          <div style={{ marginTop: '100px' }}>
            <img src={restaurant.imageUrl} alt={restaurant.Name} style={{ width: '100%', height: 'auto' }} />
          </div>
          <div>
            <p><strong>Opening Time:</strong> {restaurant.OpeningTime}</p>
            <p><strong>Closing Time:</strong> {restaurant.ClosingTime}</p>
            <p><strong>Seating Capacity:</strong> {restaurant.SeatingCapacity}</p>
            {restaurant.Menu.map((menu, index) => (
              <div key={index}>
                <p><strong>Menu Item:</strong> {menu.Name}</p>
                <p><strong>Description:</strong> {menu.Description}</p>
                <p><strong>Price:</strong> {menu.Price}</p>
                <p><strong>Category:</strong> {menu.Category}</p>
              </div>
            ))}
          </div>
        </GenericCard>
      ))}
    </div>
  );
};

export default RestaurantsPage;

/*
-Name (from Restaurants)
-ClosingTime (from Restaurants)
-OpeningTime (from Restaurants)
-SeatingCapacity (from Restaurants)
-MENU (from RestaurantMenu)
  Name (from Menu)
  Description (from Menu)
  Price (from Menu)
  Category (from Menu)

*/