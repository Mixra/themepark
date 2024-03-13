import React from 'react';
import './css/GiftShops.css'; // Ensure you have a corresponding CSS file for styling
// Correctly import your image here, adjusting the path relative to this file's location
import themeParkBackground from '../../assets/images/images.jpeg';
import themeParkBackgrounds from '../../assets/images/Giftshopimage2.jpeg';
import {GenericCard} from '../../components/Card.tsx';
import {BaseItem} from 'frontend/interface.ts';
/*
type GiftShop = {
  id: number;
  name: string;
  imageUrl: string;
  ClosingTime: string;
  OpeningTime: string;
  description: string;
  MerchandiseType: string[];
};

// Update your gift shops data to use the imported image
const giftShops: GiftShop[] = [
  {
    id: 1,
    name: 'Magic Memories',
    imageUrl: themeParkBackground, // Use the imported image variable here
    ClosingTime: '8:00 PM',
    OpeningTime: '10:00 AM',
    description: 'Find the perfect souvenir to remember your visit to the park!',
    MerchandiseType: ['Apparel', 'Toys', 'Collectibles'],
  },
  {
    id: 2,
    name: 'Wonderland Wares',
    imageUrl: themeParkBackground, // Use the same imported image variable if you want the same image
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
            <p>Merchandise Type: {shop.MerchandiseType.join(', ')}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
*/
type GiftShop = {
  id: number;
  Name: string;
  ClosingTime: string;
  OpeningTime: string;
  Description: string;
  MerchandiseType: string[];
  imageUrl: string; // Add imageUrl property to the GiftShop type
};

const giftShops: GiftShop[] = [
  // Your gift shops data
  {
    id: 1,
    Name: 'Magic Memories',
    Description: 'Find the perfect souvenir to remember your visit to the park!',
    ClosingTime: '8:00 PM',
    OpeningTime: '10:00 AM',
    MerchandiseType: ['Apparel', 'Toys', 'Collectibles'],
    imageUrl: themeParkBackground, // Use the imported image variable here
  },
  {
    id: 2,
    Name: 'Wonderland Wares',
    imageUrl: themeParkBackgrounds, // Use the same imported image variable if you want the same image
    ClosingTime: '8:00 PM',
    OpeningTime: '10:00 AM',
    Description: 'Discover unique gifts and trinkets to take home with you.',
    MerchandiseType: ['Home Decor', 'Accessories', 'Books'],
  },
];

const GiftShopsPage: React.FC = () => {
  return (
    <div className="grid-container">
      {giftShops.map((shop) => (
        <GenericCard key={shop.id} item={shop}>
          {/* Assuming GenericCard handles basic properties (id, Name, Description, etc.) */}
          {/* You'll need to modify GenericCard or use children for additional properties like imageUrl */}
          <div style={{ marginTop: '10px' }}>
            <img src={shop.imageUrl} alt={shop.name} style={{ width: '100%', height: 'auto' }} />
            <p>Merchandise Type: {shop.MerchandiseType.join(', ')}</p>
          </div>
        </GenericCard>
      ))}
    </div>
  );
};
export default GiftShopsPage;

/*
Columns needed:
- Name (from GiftShops)
- Description (from GiftShops)
- OpeningTime (from GiftShops)
- ClosingTime (from GiftShops)
- MerchandiseType (from GiftShops)
- Area Name (Connect AreaID from GiftShops -> AreaID from ParkAreas)
*/

