// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './LoginPage';
import '../assets/App.css';
import Register from './Register';
//import themeparkBackground from '../images/backPic.jpeg';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="Main">
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

