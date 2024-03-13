// Rides.tsx
import React from 'react';
import './css/Rides.css'; // Adjusted import to match the relative path

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
    imageUrl: 'istockphoto-876037616-612x612.jpg',
    minHeight: 120,
    maxHeight: 200,
    duration: 2,
    description: 'Experience the thrill of launching into the sky at incredible speeds!',
  },
  {
    id: 2,
    name: 'Ferris Wheel of Dreams',
    imageUrl: 'path/to/your/ferris-wheel-image',
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
added pictures and description columns for rides
*/