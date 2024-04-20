import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import "./assets/App.css";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Tickets from "./pages/sidebar/Tickets.tsx";
import Reports from "./pages/sidebar/ReportingAnalytics.tsx";
import Maintenance from "./pages/sidebar/Maintenance.tsx";
import Restaurants from "./pages/sidebar/Restaurants.tsx";
import Rides from "./pages/sidebar/Rides.tsx";
import Shops from "./pages/sidebar/GiftShops.tsx";
import UserManagement from "./pages/sidebar/UserManagement.tsx";
import ParkAreas from "./pages/sidebar/ParkAreas.tsx";
import Home from "./pages/Home";
import Events from "./pages/sidebar/Events.tsx";
import PurchaseTickets from "./pages/PurchaseTick.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/sidebar/Profile.tsx";
import FrontPage from "./pages/sidebar/FrontPage.tsx";
import ShoppingCart from "./pages/sidebar/ShoppingCart.tsx";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import { CartProvider } from "../src/components/CartContext.tsx";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#269dff",
    },
    secondary: {
      main: "#5fa2d9",
    },
    background: {
      default: "rgba(18, 18, 18, 0.90)",
      paper: "rgba(30, 30, 30, 0.90)",
    },
    text: {
      primary: "#ffffff",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(3px)",
          backgroundColor: "rgba(30, 30, 30, 0.8)",
        },
      },
    },
  },
});

function App() {
  const isLoggedIn = localStorage.getItem("level") !== null;

  return (
    <ThemeProvider theme={theme}>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <ProtectedRoute isAllowed>
                    <Layout children={<FrontPage />} />
                  </ProtectedRoute>
                ) : (
                  <Home />
                )
              }
            />
            <Route
              path="/front-page"
              element={
                <ProtectedRoute isAllowed>
                  <Layout children={<FrontPage />} />
                </ProtectedRoute>
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
              path="/shopping_cart"
              element={
                <ProtectedRoute isAllowed>
                  <Layout children={<ShoppingCart />} />
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
              path="/notifications"
              element={
                <ProtectedRoute isAllowed>
                  <Layout children={<Notification />} />
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
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
