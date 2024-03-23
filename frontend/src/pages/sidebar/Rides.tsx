import React, {useState} from 'react';
import './css/GiftShops.css'; 
import themeParkBackground from '../../assets/images/images.jpeg';
import themeParkBackgrounds from '../../assets/images/Giftshopimage2.jpeg';
import {GenericCard} from '../../components/Card.tsx';
import {Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PurchaseTickets from '../PurchaseTick.tsx';

type Ride = {
  id: number;
  Name: string;
  imageUrl: string;
  MinHeight: number;
  MaxHeight: number;
  Duration: number;
  Description: string;
  ClosingTime: string;
  OpeningTime: string;
};

const rides: Ride[] = [
  {
    id: 1,
    Name: 'The Great Ride',
    imageUrl: themeParkBackground,
    MinHeight: 100,
    MaxHeight: 200,
    Duration: 5,
    Description: 'The best ride in the park!',
    ClosingTime: '8:00 PM',
  OpeningTime: '10:00 AM',
  },
  {
    id: 2,
    Name: 'The Awesome Ride',
    imageUrl: themeParkBackgrounds,
    MinHeight: 120,
    MaxHeight: 220,
    Duration: 6,
    Description: 'The second best ride in the park!',
    ClosingTime: '8:00 PM',
  OpeningTime: '10:00 AM',
  },
  // Add more rides as needed
];

const RidesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRide, setSelectedRide] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const handlePurchase = (rideId: number) => {
    setSelectedRide(rideId);
  };

  const handleConfirmPurchase = () => {
    // Navigate to the purchase tickets page with the selected ride and quantity
    navigate(`/purchase-tickets?rideId=${selectedRide}&quantity=${quantity}`);
  };

  return (
    <div className="grid-container">
      {rides.map((ride) => (
        <GenericCard key={ride.id} item={ride}>
          {/* Assuming GenericCard handles basic properties (id, Name, Description, etc.) */}
          {/* You'll need to modify GenericCard or use children for additional properties like imageUrl */}
          <div style={{ marginTop: '100px' }}>
            <img src={ride.imageUrl} alt={ride.Name} style={{ width: '100%', height: 'auto' }} />
          </div>
          <div>
            <p><strong>Min Height:</strong> {ride.MinHeight} cm</p>
            <p><strong>Max Height:</strong> {ride.MaxHeight} cm</p>
            <p><strong>Duration:</strong> {ride.Duration} minutes</p>
          </div>
          {selectedRide === ride.id ? (
            <div>
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                style={{ marginTop: '10px' }}
              />
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: '10px', marginLeft: '10px' }}
                onClick={handleConfirmPurchase}
              >
                Confirm Purchase
              </Button>
            </div>
          ) : (
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: '10px' }}
              onClick={() => handlePurchase(ride.id)}
            >
              Purchase
            </Button>
          )}
        </GenericCard>
      ))}
    </div>
  );
};

export default RidesPage;
