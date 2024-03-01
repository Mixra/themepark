// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import Reg from './Register';
import '../assets/App.css';
import themeparkBackground from '../images/themeparkBackground.jpeg';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', // Ensure the div takes up the full height of the viewport
      width: '100vw', // Ensure the div takes up the full width of the viewport
      backgroundImage: `url(${themeparkBackground})`, // Use the imported background image
      backgroundSize: 'cover', // Cover the entire area without stretching the image
      backgroundPosition: 'center', // Center the background image
      backgroundRepeat: 'no-repeat' // Do not repeat the background image
    }}>
      <h1>Theme Park Management</h1>
      <button onClick={() => navigate('/login')}>
        Login
      </button>

      <button onClick={() => navigate('/register')}>
        Register
      </button>
    </div>
  );
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Reg />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

