import React from 'react';
import { useNavigate } from 'react-router-dom';

const Button: React.FC = () => {
  const navigate = useNavigate(); // Hook to get the navigate function

  const showButton = () => {
    navigate('/login'); // Navigate to the login page
  };

  return (
    <button onClick={showButton}>
      Login
    </button>
  );
};

export default Button;
