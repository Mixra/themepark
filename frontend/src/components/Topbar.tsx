import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  ShoppingCart as ShoppingCartIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface TopbarProps {
  onDrawerToggle?: () => void;
}

interface Item {
  id: number;
  quantity: number;
}

const Topbar: React.FC<TopbarProps> = ({ onDrawerToggle }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationCount, setNotificationCount] = useState(5); // Dynamic notification count
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve cart items from local storage when component initializes
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      const parsedCartItems = JSON.parse(storedCartItems);
      setCartItems(parsedCartItems);
      updateCartItemCount(parsedCartItems); // Update cart item count
    }
  }, []);

  useEffect(() => {
    // Update cart item count when cart items change
    updateCartItemCount(cartItems);
  }, [cartItems]);

  const updateCartItemCount = (items: Item[]) => {
    const totalCount = items.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(totalCount);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleProfileMenuClose();
  };

  const handleShoppingCartClick = () => {
    navigate("/shopping_cart");
  };

  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(5px)",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onDrawerToggle}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} fontWeight="bold">
          The Clown Park
        </Typography>

        <IconButton color="inherit" onClick={handleShoppingCartClick}>
          <Badge badgeContent={cartItemCount} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        <IconButton color="inherit" onClick={handleNotificationsClick}>
          <Badge badgeContent={notificationCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <IconButton color="inherit" onClick={handleProfileMenuOpen}>
          <Avatar />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
        >
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
