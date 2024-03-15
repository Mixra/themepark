import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import './assets/App.css';
import Register from './pages/Register';
import Layout from './components/Layout';
import Tickets from './pages/sidebar/Tickets.tsx';
import Reports from './pages/sidebar/ReportingAnalytics.tsx';
import Maintenance from './pages/sidebar/Maintenance.tsx';
import Restaurants from './pages/sidebar/Restaurants.tsx';
import Rides from './pages/sidebar/Rides.tsx';
import Shops from './pages/sidebar/GiftShops.tsx';
import UserManagement from './pages/sidebar/UserManagement.tsx';
import ParkAreas from './pages/sidebar/ParkAreas.tsx';
import Home from './pages/Home';
import Events from './pages/sidebar/Events.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/rides" element={<Layout children={<Rides />} />} />
        <Route path="/events" element={<Layout children={<Events />} />} />
        <Route path="/restaurants" element={<Layout children={<Restaurants />} />} />
        <Route path="/gifts" element={<Layout children={<Shops />} />} />
        <Route path="/tickets" element={<Layout children={<Tickets />} />} />
        <Route path="/maintenance" element={<Layout children={<Maintenance />} />} />
        <Route path="/reports" element={<Layout children={<Reports />} />} />
        <Route path="/manage" element={<Layout children={<UserManagement />} />} />
        <Route path="/park" element={<Layout children={<ParkAreas />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Home/>} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;