import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Toolbar,
  Box,
  Collapse,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { useLocation, Link } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  menuItems: Array<{ text: string; icon: JSX.Element; path: string }>;
}

const Sidebar: React.FC<SidebarProps> = ({ open, menuItems }) => {
  const theme = useTheme();
  const drawerWidth = 240;
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: open ? drawerWidth : theme.spacing(7),
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: open ? drawerWidth : theme.spacing(7),
          boxSizing: "border-box",
          overflowX: "hidden",
          backgroundColor: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(5px)",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "clip" }}>
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                color: "white",
                "&.Mui-selected": {
                  backgroundColor: "rgba(255, 255, 255, 0.25)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "white",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <ListItemText
                  primary={item.text}
                  sx={{
                    color: "inherit",
                    "& .MuiListItemText-primary": {
                      color: "white",
                    },
                  }}
                />
              </Collapse>
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
