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
import PurchaseTickets from './pages/PurchaseTick.tsx';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/sidebar/Profile.tsx';

function App() {
  const isLoggedIn = localStorage.getItem('level') !== null;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <ProtectedRoute isAllowed>
                <Layout children={<Rides />} />
              </ProtectedRoute>
            ) : (
              <Home />
            )
          }
        />
        <Route
          path="/rides"
          element={
            <ProtectedRoute isAllowed>
              <Layout children={<Rides />} />
            </ProtectedRoute>
          }
        />
        <Route path="/purchase-tickets" element={<PurchaseTickets />} />
        <Route
          path="/events"
          element={
            <ProtectedRoute isAllowed>
              <Layout children={<Events />} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurants"
          element={
            <ProtectedRoute isAllowed>
              <Layout children={<Restaurants />} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gifts"
          element={
            <ProtectedRoute isAllowed>
              <Layout children={<Shops />} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute isAllowed>
              <Layout children={<Tickets />} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute isAllowed>
              <Layout children={<Maintenance />} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute isAllowed>
              <Layout children={<Reports />} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage"
          element={
            <ProtectedRoute isAllowed>
              <Layout children={<UserManagement />} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/park"
          element={
            <ProtectedRoute isAllowed>
              <Layout children={<ParkAreas />} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute isAllowed={false}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute isAllowed={false}>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAllowed>
              <Layout children={<Profile />} />
            </ProtectedRoute>
          }
          />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
