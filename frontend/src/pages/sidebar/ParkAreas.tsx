import React, { useState } from 'react';
import './css/GiftShops.css'; 
import rideBackground from '../../assets/images/images.jpeg';
import {GenericCard} from '../../components/Card';
import { BaseItem } from '../../../interface';
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

const initialRides: Ride[] = [
  {
    id: 1,
    Name: 'The Great Ride',
    imageUrl: rideBackground,
    MinHeight: 100,
    MaxHeight: 200,
    Duration: 5,
    Description: 'The best ride in the park!',
    ClosingTime: '8:00 PM',
    OpeningTime: '10:00 AM',
  },
  // Add more rides as needed
];

const RidesPage: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>(initialRides);
  const handleDelete = (id: number) => {
    setRides(rides.filter(ride => ride.id !== id));
  }
  return (
    <div className="grid-container">
      {rides.map((ride) => (
        <GenericCard key={ride.id}
         item={ride}
         onDelete = {() => handleDelete(ride.id)} // Pass the delete handler
         >
        {/* Assuming GenericCard handles basic properties (id, Name, Description, etc.) */}
        {/* You'll need to modify GenericCard or use children for additional properties like imageUrl */}
        <div style={{ marginTop: '100px' }}>
          <img src={ride.imageUrl} alt={ride.Name} style={{ width: '100%', height: 'auto' }} />
        </div>
        <div>
          <p><strong>Opening Time:</strong> {ride.OpeningTime}</p>
          <p><strong>Closing Time:</strong> {ride.ClosingTime}</p>
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
-Name (from ParkAreas)
-Description (from ParkAreas)
-Theme (from ParkAreas)
-OpeningTime (from ParkAreas)
-ClosingTime (from ParkAreas)
*/