import React from 'react';
import './css/GiftShops.css'; 
import themeParkBackground from '../../assets/images/images.jpeg';
import themeParkBackgrounds from '../../assets/images/Giftshopimage2.jpeg';
import {GenericCard} from '../../components/Card.tsx';
import {BaseItem} from 'frontend/interface.ts';

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
      </GenericCard>
      ))}
    </div>
  );
};

export default RidesPage;

/*
-Name (from Rides)
-Area Name (Connect AreaID from Rides -> AreaID from ParkAreas)
-MinHeight (from Rides)
-MaxHeight (from Rides)
-MaxCapacity (from Rides)
-RideDescription (from Rides)
-RideImage (from Rides)
-OpeningTime (from Rides)
-ClosingTime (from Rides)
-TICKETS(we have to merge tickets with rides to show the tickets for each ride)
 -we will adjust columns as needed once we have met with the team

*/