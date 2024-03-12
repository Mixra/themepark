// GiftShops.tsx
import React from 'react';
import './css/GiftShops.css'; // Ensure you have a corresponding CSS file for styling

type GiftShop = {
  id: number;
  name: string;
  imageUrl: string;
  ClosingTime: string;
  OpeningTime: string;
  description: string; // Example of additional property specific to gift shops
  MerchandiseType: string[]; // Example of additional property specific to gift shops
};

const giftShops: GiftShop[] = [
  {
    id: 1,
    name: 'Magic Memories',
    imageUrl: 'path/to/your/giftshop-image1.jpg', // Adjust path as needed
    ClosingTime: '8:00 PM',
    OpeningTime: '10:00 AM',
    description: 'Find the perfect souvenir to remember your visit to the park!',
    MerchandiseType: ['Apparel', 'Toys', 'Collectibles'],
  },
  {
    id: 2,
    name: 'Wonderland Wares',
    imageUrl: 'path/to/your/giftshop-image2.jpg', // Adjust path as needed
    ClosingTime: '8:00 PM',
    OpeningTime: '10:00 AM',
    description: 'Discover unique gifts and trinkets to take home with you.',
    MerchandiseType: ['Home Decor', 'Accessories', 'Books'],
  },
  // Add more gift shops as needed
];

const GiftShopsPage: React.FC = () => {
  return (
    <div className="grid-container">
      {giftShops.map((shop) => (
        <div className="card" key={shop.id}>
          <img src={shop.imageUrl} alt={shop.name} className="card-image" />
          <div className="card-content">
            <h5>{shop.name}</h5>
            <p>OPENING TIME: {shop.OpeningTime}</p>
            <p>CLOSING TIME: {shop.ClosingTime}</p>
            <p>{shop.description}</p>
            <p>MerchandiseType: {shop.MerchandiseType.join(', ')}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GiftShopsPage;
