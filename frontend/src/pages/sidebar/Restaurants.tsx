import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestaurantPopup from "../../components/RestaurantsPopup";
import DeleteConfirmationPopup from "../../components/DeleteConfirmationPopup";
import MenuPopup from "../../components/MenuListPopup";
import db from "../../components/db";
import { Restaurant, MenuListItem } from "../../models/restaurant.model";

const RestaurantsPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Restaurant>>({});
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openMenuPopup, setOpenMenuPopup] = useState(false);
  const [initialMenuItems, setInitialMenuItems] = useState<MenuListItem[]>([]);

  const level = Number(localStorage.getItem("level"));
  const displayCrud = level === 999 || level === 1;

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await db.get("/restaurant");
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
    fetchRestaurants();
  }, []);

  const fetchMenuItems = async (restaurantId: number) => {
    try {
      const response = await db.get(`/restaurant/${restaurantId}/menu`);
      return response.data;
    } catch (error) {
      console.error("Error fetching menu items:", error);
      return [];
    }
  };

  const handleMenuClick = async (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setOpenPopup(false); // Close the main popup
    const menuItems = await fetchMenuItems(restaurant.restaurantID);
    setOpenMenuPopup(true); // Open the menu popup
    setInitialMenuItems(menuItems);
  };

  const handleMenuSave = (updatedMenuItems: any[]) => {
    if (selectedRestaurant) {
      // Update the menu items for the selected restaurant
      const updatedRestaurant = {
        ...selectedRestaurant,
        menuList: updatedMenuItems,
      };
      // Update the state with the updated restaurant data
      const updatedRestaurants = restaurants.map((restaurant) =>
        restaurant.restaurantID === selectedRestaurant.restaurantID
          ? updatedRestaurant
          : restaurant
      );
      setRestaurants(updatedRestaurants);
    }
  };

  const handleCreateClick = () => {
    setFormData({});
    setIsEditing(false);
    setOpenPopup(true);
  };

  const handleFormSubmit = async (formData: Partial<Restaurant>) => {
    try {
      if (isEditing && selectedRestaurant) {
        const updatedRestaurant = { ...selectedRestaurant, ...formData };
        await db.put("/restaurant", updatedRestaurant);
        setRestaurants((prevRestaurants) =>
          prevRestaurants.map((restaurant) =>
            restaurant.restaurantID === selectedRestaurant.restaurantID
              ? updatedRestaurant
              : restaurant
          )
        );
      } else {
        const response = await db.post("/restaurant", formData);
        const newRestaurant = {
          ...formData,
          restaurantID: response.data.restaurantID,
          hasCrud: 1, // Set hasCrud to 1 for new restaurants
        } as Restaurant;
        setRestaurants((prevRestaurants) => [
          ...prevRestaurants,
          newRestaurant,
        ]);
      }
      setOpenPopup(false);
    } catch (error) {
      console.error("Error saving restaurant:", error);
    }
  };

  const handleEditClick = (restaurant: Restaurant) => {
    setFormData(restaurant);
    setSelectedRestaurant(restaurant);
    setIsEditing(true);
    setOpenPopup(true);
  };

  const handleDeleteClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedRestaurant) {
        await db.delete(`/restaurant/${selectedRestaurant.restaurantID}`);
        setRestaurants((prevRestaurants) =>
          prevRestaurants.filter(
            (restaurant) =>
              restaurant.restaurantID !== selectedRestaurant.restaurantID
          )
        );
      }
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {displayCrud && (
        <Box
          sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}
        >
          <Button variant="contained" onClick={handleCreateClick}>
            Create
          </Button>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "100%",
        }}
      >
        {restaurants.map((restaurant) => (
          <Card
            key={restaurant.restaurantID}
            sx={{
              margin: 1,
              width: 300,
              height: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              component="img"
              src={restaurant.imageURL}
              alt="Restaurant Image"
              sx={{
                width: "100%",
                height: 200, // Fixed height for images
                objectFit: "cover", // Ensures images cover the area well without distortion
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.03)", // Gentle zoom on hover for a dynamic effect
                },
              }}
            />

            <CardContent
              sx={{
                flexGrow: 1,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h5" component="div" gutterBottom>
                {restaurant.restaurantName}
                <Chip
                  label={restaurant.area.areaName}
                  size="small"
                  sx={{ ml: 1, bgcolor: "primary.main", color: "white" }}
                />
              </Typography>

              <Divider
                sx={{ marginY: 1, borderColor: "black", borderWidth: 2 }}
              />

              <Typography color="text.secondary" gutterBottom>
                <span style={{ fontWeight: "bold" }}>Cuisine:</span>{" "}
                {restaurant.cuisineType}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <span style={{ fontWeight: "bold" }}>Seating Capacity:</span>{" "}
                {restaurant.seatingCapacity}
              </Typography>

              <Divider
                sx={{ marginY: 1, borderColor: "black", borderWidth: 2 }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2">
                  <span style={{ fontWeight: "bold" }}>Opening Time:</span>{" "}
                  {new Date(
                    `1970-01-01T${restaurant.openingTime}`
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Typography>
                <Typography variant="body2">
                  <span style={{ fontWeight: "bold" }}>Closing Time:</span>{" "}
                  {new Date(
                    `1970-01-01T${restaurant.closingTime}`
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Typography>
              </Box>

              <Divider
                sx={{ marginY: 1, borderColor: "black", borderWidth: 2 }}
              />

              <Box
                sx={{
                  maxHeight: 200,
                  overflow: "auto",
                  padding: 1,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  marginY: 1,
                }}
              >
                <Typography variant="body2">
                  {restaurant.menuDescription}
                </Typography>
              </Box>

              <Box
                sx={{
                  maxHeight: 200,
                  overflow: "auto",
                  padding: 1,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  marginY: 1,
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  Menu:
                </Typography>
                {restaurant.menuList && restaurant.menuList.length > 0 ? (
                  restaurant.menuList.map((menuItem, index) => (
                    <Typography key={index} variant="body2">
                      - {menuItem.itemName} (${menuItem.price})
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2">No menu available</Typography>
                )}
                {restaurant.hasCrud === 1 && (
                  <Button
                    variant="contained"
                    onClick={() => handleMenuClick(restaurant)}
                  >
                    Edit Menu
                  </Button>
                )}
              </Box>
            </CardContent>

            {restaurant.hasCrud === 1 && (
              <CardActions>
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEditClick(restaurant)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDeleteClick(restaurant)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            )}
          </Card>
        ))}
      </Box>

      <RestaurantPopup
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        onSubmit={handleFormSubmit}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />

      <DeleteConfirmationPopup
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
      />

      <MenuPopup
        open={openMenuPopup}
        onClose={() => setOpenMenuPopup(false)}
        restaurantId={selectedRestaurant?.restaurantID || 0}
        initialMenuItems={initialMenuItems}
        onMenuItemsUpdated={handleMenuSave}
      />
    </Box>
  );
};

export default RestaurantsPage;
