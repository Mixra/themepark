// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './LoginPage';
import '../assets/App.css';
import Register from './Register';
import { Button } from '@mui/material';
//import themeparkBackground from '../images/backPic.jpeg';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="Main">
      <h1>Theme Park Management</h1>
      <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>

      <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
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

