import React, { useState } from "react";
import { Button, Card, Typography,Divider,Box,IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";

interface Notification {
  id: number;
  message: string;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = () => {
    const newNotification: Notification = {
      id: Math.random(), // Generate a unique ID for the notification
      message: "This is a new notification!",
    };
    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div>
      <h1 style={{ fontSize: "2rem" }}>Notifications</h1>
      <Divider sx={{ marginY: 1 ,border:"1px solid #ccc"}} />
      <Button variant="contained" onClick={addNotification} >
        Add Notification
      </Button>
      
        <Card >
          {notifications.length === 0 ? (
           
              <Typography margin={"auto"}>You have no notifications</Typography>
           
          ) : (
            notifications.map((notification) => (
              <Box key={notification.id}>
                
                <Typography margin={"auto"} >{notification.message}
                <IconButton
                  onClick={() => removeNotification(notification.id)}
                  
                >
                    <DeleteIcon />
                </IconButton>
                </Typography>
                </Box>
              
            ))
          )}
        </Card>
     
    </div>
  );
};

export default NotificationPage;
