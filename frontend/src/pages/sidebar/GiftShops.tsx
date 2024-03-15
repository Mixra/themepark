import React from 'react';
import './css/GiftShops.css'; 
import themeParkBackground from '../../assets/images/images.jpeg';
import themeParkBackgrounds from '../../assets/images/Giftshopimage2.jpeg';
import {GenericCard} from '../../components/Card.tsx';
import {BaseItem} from 'frontend/interface.ts';
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
            <img src={shop.imageUrl} alt={shop.Name} style={{ width: '100%', height: 'auto' }} />
            <p><strong>Merchandise Type: </strong>{shop.MerchandiseType.join(', ')}</p>
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

