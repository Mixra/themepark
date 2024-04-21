import React, { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { useLocation } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import {
  ConfirmationNumber as TicketsIcon,
  People as UserManagementIcon,
  Forest as ForestIcon,
  Attractions as RidesIcon,
  Restaurant as RestaurantIcon,
  CardGiftcard as GiftShopIcon,
  Engineering as MaintenanceIcon,
  ManageAccounts as ManageAccountsIcon,
  AccountBox,
  Event as EventsIcon,
} from "@mui/icons-material";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const filterMenuItems = () => {
  const level = localStorage.getItem("level");
  if (level === "999") {
    return menuItems;
  } else if (level === "1") {
    return menuItems.filter((item) => item.text !== "User Management");
  } else {
    return menuItems.filter(
      (item) =>
        item.text !== "User Management" &&
        item.text !== "Maintenance" &&
        item.text !== "Reporting and Analytics"
    );
  }
};

const menuItems = [
  { text: "Park Areas", icon: <ForestIcon />, path: "/park" },
  { text: "Rides", icon: <RidesIcon />, path: "/rides" },
  { text: "Events", icon: <EventsIcon />, path: "/events" },
  { text: "Restaurants", icon: <RestaurantIcon />, path: "/restaurants" },
  { text: "Gift Shops", icon: <GiftShopIcon />, path: "/gifts" },
  { text: "Purchase History", icon: <TicketsIcon />, path: "/tickets" },
  { text: "Maintenance", icon: <MaintenanceIcon />, path: "/maintenance" },
 
  {
    text: "Reporting and Analytics",
    icon: <UserManagementIcon />,
    path: "/reports",
  },
  { text: "User Management", icon: <ManageAccountsIcon />, path: "/manage" },
  { text: "My Profile", icon: <AccountBox />, path: "/profile" },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isShoppingCartPage = location.pathname === "/shopping_cart";
  const [open, setOpen] = useState(() => {
    const isSidebarOpen = localStorage.getItem("sidebarOpen");
    return isSidebarOpen === null ? true : isSidebarOpen === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", String(open));
  }, [open]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const filteredMenuItems = filterMenuItems();

  return (
    <Box sx={{ display: "flex" }}>
      <Topbar onDrawerToggle={handleDrawerToggle } />
      
      <Sidebar open={open} menuItems={filteredMenuItems} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginLeft: "-60px",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
