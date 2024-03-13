// Rides.tsx
import React from 'react';
import './css/Rides.css'; // Adjusted import to match the relative path
import rocketImage from '../../assets/images/istockphoto-876037616-612x612.jpg';

type Ride = {
  id: number;
  name: string;
  imageUrl: string;
  minHeight: number;
  maxHeight: number;
  duration: number;
  description: string;
};

const rides: Ride[] = [
  {
    id: 1,
    name: 'The Rocket',
    imageUrl: rocketImage,
    minHeight: 120,
    maxHeight: 200,
    duration: 2,
    description: 'Experience the thrill of launching into the sky at incredible speeds!',
  },
  {
    id: 2,
    name: 'Ferris Wheel of Dreams',
    imageUrl: rocketImage,
    minHeight: 100,
    maxHeight: 200,
    duration: 5,
    description: 'Enjoy the scenic views from the top of our majestic Ferris wheel.',
  },
  // Add more rides as needed
];

const RidesPage: React.FC = () => {
  return (
    <div className="grid-container">
      {rides.map((ride) => (
        <div className="card" key={ride.id}>
          <img src={ride.imageUrl} alt={ride.name} className="card-image" />
          <div className="card-content">
            <h5>{ride.name}</h5>
            <p>Min Height: {ride.minHeight} cm</p>
            <p>Max Height: {ride.maxHeight} cm</p>
            <p>Duration: {ride.duration} min</p>
            <p>{ride.description}</p>
          </div>
        </div>
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