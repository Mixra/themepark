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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RidesPopup from "../../components/RidesPopup";
import DeleteRideConfirmation from "../../components/DeleteRideConfirmation";
import db from "../../components/db";
import { Ride, Purchase } from "../../models/ride.model";

const RidesPage: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showTicketDialog, setShowTicketDialog] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<Purchase[]>([]);

  const level = Number(localStorage.getItem("level"));
  const displayCreateButton = level === 999 || level === 1;

  const handleOpenPurchaseDialog = (ride: Ride) => {
    setSelectedRide(ride);
    setShowTicketDialog(true);
  };

  //this will be the admin portion
  const [formData, setFormData] = useState<Partial<Ride>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await db.get("/view/rides");
        setRides(response.data);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };
    fetchRides();
  }, []);

  const handleCreateClick = () => {
    setFormData({});
    setIsEditing(false);
    setOpenPopup(true);
  };

  const handleFormSubmit = async (formData: Partial<Ride>) => {
    console.log("Form data:", formData);
    formData.minimumHeight = Number(formData.minimumHeight);
    formData.maximumCapacity = Number(formData.maximumCapacity);
    formData.duration = Number(formData.duration);
    try {
      setIsSubmitting(true);
      if (isEditing && selectedRide) {
        const updatedRide = { ...selectedRide, ...formData };
        await db.put("/edit/rides", updatedRide);
        setRides((prevRides) =>
          prevRides.map((ride) =>
            ride.rideID === selectedRide.rideID ? updatedRide : ride
          )
        );
      } else {
        const newRide = { ...formData, hasCrud: true } as Ride;
        await db.post("/create/rides", newRide);
        setRides((prevRides) => [...prevRides, newRide]);
      }
      setOpenPopup(false);
    } catch (error) {
      console.error("Error saving ride:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (ride: Ride) => {
    setFormData(ride);
    setSelectedRide(ride);
    setIsEditing(true);
    setOpenPopup(true);
  };

  const handleDeleteClick = (ride: Ride) => {
    setSelectedRide(ride);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedRide) {
        await db.delete(`/delete/rides/${selectedRide.rideID}`);
        setRides((prevRides) =>
          prevRides.filter((ride) => ride.rideID !== selectedRide.rideID)
        );
      }
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting ride:", error);
    }
  };

  //end of admin section

  const handleAddToCart = () => {
    if (!selectedRide || quantity < 1) return;

    const newItem: Purchase = {
      rideId: selectedRide.rideID,
      name: selectedRide.rideName,
      unitPrice: selectedRide.unitPrice || 0,
      itemType: "Ride",
      quantity,
    };

    // Get existing cart items from local storage
    const existingCartItems: Purchase[] = JSON.parse(
      localStorage.getItem("cartItems") || "[]"
    );

    // Check if the item already exists in the cart
    const existingItemIndex = existingCartItems.findIndex(
      (item) => item.rideId === selectedRide.rideID
    );
    if (existingItemIndex !== -1) {
      // If the item already exists, update its quantity
      existingCartItems[existingItemIndex].quantity += quantity;
    } else {
      // If the item doesn't exist, add it to the cart
      existingCartItems.push(newItem);
    }

    // Update cartItems state
    setCartItems(existingCartItems);

    // Store updated cartItems in local storage
    localStorage.setItem("cartItems", JSON.stringify(existingCartItems));

    // Close the purchase dialog after adding to cart
    setShowTicketDialog(false);
  };

  //Closing Button
  const handleCloseDialog = () => {
    setShowTicketDialog(false);
    setQuantity(1); // Reset quantity for future purchases
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {displayCreateButton && (
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
        {rides.map((ride) => (
          <Card
            key={ride.rideID}
            sx={{
              margin: 1,
              width: 300,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={ride.imageUrl || "https://via.placeholder.com/150"}
              alt={ride.rideName}
              style={{ width: "100%", objectFit: "cover", height: "150px" }}
            />
            <CardContent
              sx={{
                overflowY: "auto",
                padding: 1,
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h5" component="div" gutterBottom>
                {ride.rideName}
                <Chip
                  label={ride.area.areaName}
                  size="small"
                  sx={{ ml: 1, bgcolor: "primary.main", color: "white" }}
                />
              </Typography>
              <Divider sx={{ marginY: 1 }} />
              <Typography color="text.secondary" gutterBottom>
                {ride.type}
              </Typography>

              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  padding: 1,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  maxHeight: 100,
                }}
              >
                <Typography variant="body2" style={{ wordBreak: "break-word" }}>
                  {ride.description}
                </Typography>
              </Box>

              <Divider sx={{ marginY: 1 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  Opening Time: {ride.openingTime || "-"}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  Closing Time: {ride.closingTime || "-"}
                </Typography>
              </Box>
              <Divider sx={{ marginY: 1 }} />
              <Typography variant="body2" fontWeight="bold">
                Minimum Height: {ride.minimumHeight}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                Max seating per ride: {ride.maximumCapacity}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                Duration of the ride: {ride.duration} seconds
              </Typography>
              <CardActions style={{ justifyContent: "center" }}>
                <Button
                  variant="contained"
                  onClick={() => handleOpenPurchaseDialog(ride)}
                >
                  Add To Cart (${ride.unitPrice})
                </Button>
              </CardActions>
            </CardContent>
            {ride.hasCrud && (
              <CardActions>
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEditClick(ride)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDeleteClick(ride)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            )}
          </Card>
        ))}
      </Box>

      <RidesPopup
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        onSubmit={handleFormSubmit}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
        isSubmitting={isSubmitting}
      />
      <DeleteRideConfirmation
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
      />

      <Dialog open={showTicketDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add to Cart </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="quantity"
            label="Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddToCart}>Add to Cart</Button>
        </DialogActions>
        <Box />
      </Dialog>
    </Box>
  );
};

export default RidesPage;
