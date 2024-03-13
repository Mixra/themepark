import React, { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import {
  Dashboard as DashboardIcon,
  ConfirmationNumber as TicketsIcon,
  People as UserManagementIcon,
  Forest as ForestIcon,
  Attractions as RidesIcon,
  Restaurant as RestaurantIcon,
  CardGiftcard as GiftShopIcon,
  Engineering as MaintenanceIcon,
  ManageAccounts as ManageAccountsIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Park Areas", icon: <ForestIcon />, path: "/park" },
    { text: "Rides", icon: <RidesIcon />, path: "/rides" },
    { text: "Restaurants", icon: <RestaurantIcon />, path: "/restaurants" },
    { text: "Gift Shops", icon: <GiftShopIcon />, path: "/gifts" },
    { text: "Tickets", icon: <TicketsIcon />, path: "/tickets" },
    { text: "Maintenance", icon: <MaintenanceIcon />, path: "/maintenance" },
    { text: "Reporting and Analytics", icon: <UserManagementIcon />, path: "/reports" },
    { text: "User Management", icon: <ManageAccountsIcon />, path: "/manage" },
    { text: "My Profile", icon: <HistoryIcon />, path: "/profile" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Topbar onDrawerToggle={handleDrawerToggle} />
      <Sidebar open={open} menuItems={menuItems} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginLeft: "-100px",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
