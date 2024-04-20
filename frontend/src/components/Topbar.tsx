import React, { useState, useEffect, useRef } from "react";
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
  Popover,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Paper,
  Box,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  ShoppingCart as ShoppingCartIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import db from "./db";

interface TopbarProps {
  onDrawerToggle?: () => void;
}

interface Item {
  id: number;
  quantity: number;
}

interface Notification {
  notificationID: number;
  message: string;
  readStatus: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ onDrawerToggle }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve cart items from local storage when component initializes
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      const parsedCartItems = JSON.parse(storedCartItems);
      setCartItems(parsedCartItems);
      updateCartItemCount(parsedCartItems); // Update cart item count
    }

    // Retrieve notifications from the backend
    fetchNotifications();

    // Start checking for new notifications every 60 seconds
    startNewNotificationCheck();

    return () => {
      // Clean up the interval when the component unmounts
      stopNewNotificationCheck();
    };
  }, []);

  useEffect(() => {
    // Update cart item count when cart items change
    updateCartItemCount(cartItems);
  }, [cartItems]);

  const updateCartItemCount = (items: Item[]) => {
    const totalCount = items.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(totalCount);
  };

  const fetchNotifications = async () => {
    try {
      const response = await db.get("/notification/");
      setNotifications(response.data);
      setNewNotificationCount(
        response.data.filter((n: Notification) => !n.readStatus).length
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markNotificationAsRead = async (notificationID: number) => {
    try {
      await db.post(`/notification/mark-read/${notificationID}`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.notificationID === notificationID
            ? { ...notification, readStatus: true }
            : notification
        )
      );
      setNewNotificationCount((prevCount) =>
        prevCount > 0 ? prevCount - 1 : 0
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const startNewNotificationCheck = () => {
    intervalRef.current = setInterval(fetchNotifications, 3000); // Refresh every 3 secs
  };

  const stopNewNotificationCheck = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationAnchorEl(null);
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

  const handleNotificationClick = (notificationID: number) => {
    markNotificationAsRead(notificationID);
    handleNotificationsClose();
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

        <IconButton color="inherit" onClick={handleNotificationsOpen}>
          <Badge badgeContent={newNotificationCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Popover
          open={Boolean(notificationAnchorEl)}
          anchorEl={notificationAnchorEl}
          onClose={handleNotificationsClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            style: {
              width: "400px",
              maxHeight: "500px",
              overflow: "auto",
            },
          }}
        >
          <Paper elevation={3}>
            <List>
              {notifications.map((notification) => (
                <React.Fragment key={notification.notificationID}>
                  <ListItem
                    disablePadding
                    onClick={() =>
                      handleNotificationClick(notification.notificationID)
                    }
                    sx={{
                      backgroundColor: notification.readStatus
                        ? "transparent"
                        : "rgba(0, 0, 0, 0.04)",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.08)",
                      },
                    }}
                  >
                    <ListItemButton>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-start"
                      >
                        <Typography variant="body1">
                          {notification.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          color={
                            notification.readStatus ? "text.secondary" : ""
                          }
                        >
                          {notification.readStatus ? "Read" : "Unread"}
                        </Typography>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                  {notifications.indexOf(notification) !==
                    notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Popover>

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
