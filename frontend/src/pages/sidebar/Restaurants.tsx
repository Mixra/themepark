import React from 'react';
import './css/GiftShops.css'; 
import restaurantBackground from '../../assets/images/images.jpeg';
import {GenericCard} from '../../components/Card.tsx';
import {BaseItem} from 'frontend/interface.ts';

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

const restaurants: Restaurant[] = [
  {
    id: 1,
    Name: 'The Great Restaurant',
    imageUrl: restaurantBackground,
    ClosingTime: '10:00 PM',
    OpeningTime: '8:00 AM',
    SeatingCapacity: 100,
    Description: 'The best restaurant in the park!',
    Menu: [
      {
        Name: 'Dish 1',
        Description: 'Delicious dish 1',
        Price: 10,
        Category: 'Main Course',
      },
      // Add more menu items as needed
    ],
  },
  // Add more restaurants as needed
];

const RestaurantsPage: React.FC = () => {
  return (
    <div className="grid-container">
      {restaurants.map((restaurant) => (
        <GenericCard key={restaurant.id} item={restaurant}>
        {/* Assuming GenericCard handles basic properties (id, Name, Description, etc.) */}
        {/* You'll need to modify GenericCard or use children for additional properties like imageUrl */}
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