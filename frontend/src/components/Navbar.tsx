import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  Box,
  Collapse,
  ListItemButton,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  ConfirmationNumber as TicketsIcon,
  People as UserManagementIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Theme Park Management
          </Typography>
          <IconButton color="inherit" onClick={handleProfileMenuOpen}>
            <Avatar />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem>
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
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : theme.spacing(7),
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: open ? drawerWidth : theme.spacing(7),
            boxSizing: "border-box",
            overflowX: "hidden",
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(5px)',
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          },
        }}
      >
        <Toolbar />
        {/* Apply the frosted glass effect here */}
        <Box sx={{ 
          overflow: "clip", 
          
        }}>
          <List>
            
            <ListItemButton>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <ListItemText primary="Dashboard" />
              </Collapse>
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <TicketsIcon />
              </ListItemIcon>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <ListItemText primary="Tickets" />
              </Collapse>
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <UserManagementIcon />
              </ListItemIcon>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <ListItemText primary="User Management" />
              </Collapse>
            </ListItemButton>

          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}></Box>
      <Toolbar />
      
    </Box>
  );
};

export default Navbar;


/*import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  Box,
  Collapse,
  ListItemButton,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  ConfirmationNumber as TicketsIcon,
  People as UserManagementIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // Prob go to delete endpoint to delete cookie
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Theme Park Management
          </Typography>
          <IconButton color="inherit" onClick={handleProfileMenuOpen}>
            <Avatar />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem>
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
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : theme.spacing(7),
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: open ? drawerWidth : theme.spacing(7),
            boxSizing: "border-box",
            overflowX: "clip",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          },
        }}
      >
        <Toolbar />
        <Box sx={{ 
          overflow: "clip",
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
      }}>
          <List>
            
            <ListItemButton>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <ListItemText primary="Dashboard" />
              </Collapse>
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <TicketsIcon />
              </ListItemIcon>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <ListItemText primary="Tickets" />
              </Collapse>
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <UserManagementIcon />
              </ListItemIcon>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <ListItemText primary="User Management" />
              </Collapse>
            </ListItemButton>

          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}></Box>
      <Toolbar />
      
    </Box>
  );
};
export default Navbar;*/
