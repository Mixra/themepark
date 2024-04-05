import React, { useState } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QRCode from "qrcode.react";
import RidesPopup from "../../components/RidesPopup";
import DeleteConfirmationPopup from "../../components/DeleteConfirmationPopup";

interface Rides {
  imageUrl: string | undefined;
  id: number;
  name: string;
  type: string;
  minHeight: number;
  maxCapacity: number;
  duration: number;
  description: string;
  openingTime: string;
  closingTime: string;
  hasCrud?: boolean;
}

const fakeRides: Rides[] = [
  {
    id: 1,
    name: "The Great Ride",
    description: "The best ride in the park!",
    minHeight: 100,
    maxCapacity: 50,
    type: "Rollercoaster",
    duration: 5,
    openingTime: "09:00",
    closingTime: "18:00",
    hasCrud: true,
    imageUrl:
      "https://sf-static.sixflags.com/wp-content/uploads/2020/04/sfmm_viper2-scaled.jpg",
  },
  {
    id: 2,
    name: "The Awesome Ride",
    description: "The second best ride in the park!",
    minHeight: 100,
    maxCapacity: 25,
    type: "Rollercoaster",
    duration: 5,
    openingTime: "10:00",
    closingTime: "20:00",
    hasCrud: false,
    imageUrl:
      "https://sf-static.sixflags.com/wp-content/uploads/Anne-McDade-BATMAN-2-min-scaled.jpg",
  },
];

const RidesPage: React.FC = () => {
  const [selectedRides, setSelectedRides] = useState<Rides[]>(fakeRides);
  const [selectedRide, setSelectedRide] = useState<Rides | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showTicketDialog, setShowTicketDialog] = useState<boolean>(false);
  const [ticketCodes, setTicketCodes] = useState<string[]>([]);
  const [currentTicketIndex, setCurrentTicketIndex] = useState<number>(0);
  const level = Number(localStorage.getItem("level"));
  const displayCrud = level === 999;

  const handleOpenPurchaseDialog = (ride: Rides) => {
    setSelectedRide(ride);
    setShowTicketDialog(true);
  };
  //this will be the admin portion
  const [formData, setFormData] = useState<Partial<Rides>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleCreateClick = () => {
    setFormData({});
    setIsEditing(false);
    setOpenPopup(true);
  }

  const handleFormSubmit = (formData: Partial<Rides>) => {
    if (isEditing && selectedRide) {
      const updatedRestaurants = selectedRides.map((ride) =>
        ride.id === selectedRide.id ? { ...ride, ...formData } : ride
      );
      setSelectedRides(updatedRestaurants);
    } else {
      const newId = Math.max(...selectedRides.map(r => r.id)) + 1; // Simplistic approach to generate a new ID

      const newRestaurant: Rides = {
        id: newId,
        //AreaID: formData.AreaID || 0, // Defaulting to 0 if not specified
        name: formData.name || "",
        type: formData.type || "",
        minHeight: formData.minHeight || 0,
        maxCapacity: formData.maxCapacity || 0,
        duration: formData.duration || 0,
        description: formData.description || "",
        openingTime: formData.openingTime || "",
        closingTime: formData.closingTime || "",
        imageUrl: formData.imageUrl || "https://via.placeholder.com/150",
      };

      setSelectedRides([...selectedRides, newRestaurant]);
    }
    setOpenPopup(false);
  };

  const handleEditClick = (ride: Rides) => {
    setFormData(ride);
    setSelectedRide(ride);
    setIsEditing(true);
    setOpenPopup(true);
  };

  const handleDeleteClick = (ride: Rides) => {
    setSelectedRide(ride);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedRide) {
      const updatedRestaurants = selectedRides.filter(
        (ride) => ride.id !== selectedRide.id
      );
      setSelectedRides(updatedRestaurants);
    }
    setOpenDeleteDialog(false);
  };

  //end of admin section

  const handleConfirmPurchase = () => {
    if (!selectedRide) return;

    const codes = Array.from(
      { length: quantity },
      () => `${selectedRide.id}-${Math.random().toString(36).substring(2, 15)}`
    );
    setTicketCodes(codes);
    setCurrentTicketIndex(0); // Start showing tickets from the first one
    // Do not close the dialog here, change logic to show QR codes next
  };

  const handleNextTicket = () => {
    setCurrentTicketIndex((prevIndex) => (prevIndex + 1) % ticketCodes.length);
  };

  const handlePrevTicket = () => {
    setCurrentTicketIndex(
      (prevIndex) => (prevIndex - 1 + ticketCodes.length) % ticketCodes.length
    );
  };

  const handleCloseDialog = () => {
    setShowTicketDialog(false);
    setTicketCodes([]); // Clear the tickets once the dialog is closed
    setQuantity(1); // Reset quantity for future purchases
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
        {selectedRides.map((ride) => (
          <Card
            key={ride.id}
            sx={{
              margin: 1,
              width: 300,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={ride.imageUrl}
              alt={ride.name}
              style={{ width: "100%", objectFit: "cover", height: "150px" }}
            />
            <CardContent
              sx={{
                overflowY: "auto",
                padding: 1,
                flexGrow: 1,
              }}
            >
              <Typography variant="h5" component="div" gutterBottom>
                {ride.name}
              </Typography>
              <Divider sx={{ marginY: 1 }} />
              <Typography color="text.secondary" gutterBottom>
                {ride.type}
              </Typography>

              <Box
                sx={{
                  maxHeight: 60,
                  minHeight: 60,
                  overflow: "auto",
                  padding: 1,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2">{ride.description}</Typography>
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
                  Opening Time: {ride.openingTime}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  Closing Time: {ride.closingTime}
                </Typography>
              </Box>
              <Divider sx={{ marginY: 1 }} />
              <Typography variant="body2" fontWeight="bold">
                Minimum Height: {ride.minHeight}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                Max seating per ride: {ride.maxCapacity}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                Duration of the ride: {ride.duration} minutes
              </Typography>

              <CardActions>
              <Button
                variant="contained"
                onClick={() => handleOpenPurchaseDialog(ride)}
              >
                Purchase
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
        />
        <DeleteConfirmationPopup
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onConfirm={handleDeleteConfirm}
        />    

      <Dialog open={showTicketDialog} onClose={handleCloseDialog}>
        {ticketCodes.length > 0 ? (
          <>
            <DialogTitle>QR Code</DialogTitle>
            <DialogContent sx={{ textAlign: "center" }}>
              <QRCode value={ticketCodes[currentTicketIndex]} size={200} />
              <Typography>
                Ticket ID: {ticketCodes[currentTicketIndex]}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handlePrevTicket}
                disabled={ticketCodes.length <= 1}
              >
                Prev
              </Button>
              <Button
                onClick={handleNextTicket}
                disabled={ticketCodes.length <= 1}
              >
                Next
              </Button>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Confirm Purchase</DialogTitle>
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
              <Button onClick={handleConfirmPurchase}>Confirm</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default RidesPage;
