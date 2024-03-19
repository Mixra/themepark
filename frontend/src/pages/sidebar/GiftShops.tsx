import React, { useState } from 'react';
import './css/GiftShops.css'; 
import Burger from '../../assets/images/BurgerSpot.jpeg';
import {GenericCard} from '../../components/Card';
import themeParkBackground from '../../assets/images/images.jpeg';
import themeParkBackgrounds from '../../assets/images/Giftshopimage2.jpeg';
//import {BaseItem} from 'frontend/interface.ts';
type GiftShop = {
  id: number;
  Name: string;
  ClosingTime: string;
  OpeningTime: string;
  Description: string;
  MerchandiseType: string[];
  imageUrl: string;
};

// Define your initial gift shops data
const initialGiftShops: GiftShop[] = [
  {
    id: 1,
    Name: 'Magic Memories',
    Description: 'Find the perfect souvenir to remember your visit to the park!',
    ClosingTime: '8:00 PM',
    OpeningTime: '10:00 AM',
    MerchandiseType: ['Apparel', 'Toys', 'Collectibles'],
    imageUrl: themeParkBackground,
  },
  {
    id: 2,
    Name: 'Wonderland Wares',
    imageUrl: themeParkBackgrounds,
    ClosingTime: '8:00 PM',
    OpeningTime: '10:00 AM',
    Description: 'Discover unique gifts and trinkets to take home with you.',
    MerchandiseType: ['Home Decor', 'Accessories', 'Books'],
  },
];

const GiftShopsPage: React.FC = () => {
  // Use useState to manage the gift shops state
  const [giftShops, setGiftShops] = useState<GiftShop[]>(initialGiftShops);

  // Handler function for deleting a gift shop
  const handleDelete = (id: number) => {
    setGiftShops(giftShops.filter(shop => shop.id !== id));
  };

  return (
    <div className="grid-container">
      {giftShops.map((shop) => (
        <GenericCard
          key={shop.id}
          item={shop}
          onDelete={() => handleDelete(shop.id)} // Pass the delete handler
        >
          <div style={{ marginTop: '10px' }}>
            <img src={shop.imageUrl} alt={shop.Name} style={{ width: '100%', height: 'auto' }} />
            <p><strong>Merchandise Type:</strong> {shop.MerchandiseType.join(', ')}</p>
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

