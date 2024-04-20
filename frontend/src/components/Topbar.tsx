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
import { useCart } from "./CartContext";
import db from "./db";

interface TopbarProps {
  onDrawerToggle?: () => void;
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
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Retrieve notifications from the backend
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

    // Start checking for new notifications every 60 seconds
    intervalRef.current = setInterval(fetchNotifications, 60000);
    fetchNotifications();

    return () => {
      // Clean up the interval when the component unmounts
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

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

  const handleNotificationClick = async (notificationID: number) => {
    try {
      await db.post(`/notification/mark-read/${notificationID}`);
      setNotifications(
        notifications.map((n) =>
          n.notificationID === notificationID ? { ...n, readStatus: true } : n
        )
      );
      setNewNotificationCount((prevCount) =>
        prevCount > 0 ? prevCount - 1 : 0
      );
      handleNotificationsClose();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
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
          <Badge badgeContent={cartItemCount} color="secondary">
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
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            style: { width: "400px", maxHeight: "500px", overflow: "auto" },
          }}
        >
          <Paper elevation={3}>
            <List>
              {notifications.length === 0 ? (
                <ListItem>
                  <ListItemText primary="You Currently Do Not Have Any Notifications" />
                </ListItem>
              ) : (
                notifications.map((notification) => (
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
                        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
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
                ))
              )}
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
