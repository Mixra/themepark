// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import Tickets from './BuyTickets';
import './App.css';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1>Theme Park Management</h1>
      <button onClick={() => navigate('/login')} >
        Login
      </button>

      <button onClick={() => navigate('/tickets')} >
        Tickets
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
        <Route path="/tickets" element={<Tickets />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

