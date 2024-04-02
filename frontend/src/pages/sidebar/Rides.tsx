/*import React, { useState } from "react";
import "./css/GiftShops.css";
import { GenericCard } from "../../components/Card";
import ButtonComponent from "../../components/ButtonComponent";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import QRCode from "qrcode.react";
//ParkAreas changes
import { NestCamWiredStand } from "@mui/icons-material";

type Ride = {
  id: number;
  Name: string;
  imageUrl: string;
  MinHeight: number;
  MaxHeight: number;
  Duration: number;
  Description: string;
  ClosingTime: string;
  OpeningTime: string;
};

const rides: Ride[] = [
  {
    id: 1,
    Name: "The Great Ride",
    imageUrl: "https://sf-static.sixflags.com/wp-content/uploads/2020/04/sfmm_viper2-scaled.jpg",
    MinHeight: 100,
    MaxHeight: 200,
    Duration: 5,
    Description: "The best ride in the park!",
    ClosingTime: "8:00 PM",
    OpeningTime: "10:00 AM",
  },
  {
    id: 2,
    Name: "The Awesome Ride",
    imageUrl: "https://sf-static.sixflags.com/wp-content/uploads/Anne-McDade-BATMAN-2-min-scaled.jpg",
    MinHeight: 120,
    MaxHeight: 220,
    Duration: 6,
    Description: "The second best ride in the park!",
    ClosingTime: "8:00 PM",
    OpeningTime: "10:00 AM",
  },
  // Add more rides as needed
];

const RidesPage: React.FC = () => {
  const [selectedRide, setSelectedRide] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showTicketDialog, setShowTicketDialog] = useState<boolean>(false);
  const [ticketCodes, setTicketCodes] = useState<string[]>([]);
  const [currentTicketIndex, setCurrentTicketIndex] = useState<number>(0);

  //this is the changes from the ParkRides page
  const [ridesVar, setRides] = useState<Ride[]>(rides);
  const [openPopup, setOpenPopup] = useState(false);
  const [formData, setFormData] = useState<Partial<Ride>>({});
  const level = Number(localStorage.getItem("level"));
  const display_crud = level === 1 ? true : false;
  const [isEditing, setIsEditing] = useState(false);
  
  const handleCreateClick = () => {
    setFormData({});
    setIsEditing(false);
    setOpenPopup(true);
  };

  const handleFormSubmit = (formData: Partial<Ride>) => {
    
    //ask about setting up the if statement for handleFormSubmit
    const newRide: Ride = {
      Name: formData.Name || "",
      MinHeight: formData.MinHeight || 0,
      MaxHeight: formData.MaxHeight || 0,
      Description: formData.Description || "",
      OpeningTime: formData.OpeningTime || "",
      ClosingTime: formData.ClosingTime || "",
      imageUrl: formData.imageUrl || "https://via.placeholder.com/150",
    };

    setRides([...ridesVar, newRide]);

    //add a setOpenPopup(false); outside the if else
  }
  //
  const handlePurchase = (rideId: number) => {
    setSelectedRide(rideId);
  };

  const handleConfirmPurchase = () => {
    // Generate random ticket codes
    const codes = Array.from({ length: quantity }, () =>
      Math.random().toString(36).substring(7)
    );
    setTicketCodes(codes);
    setShowTicketDialog(true);
  };

  const handleCloseTicketDialog = () => {
    setShowTicketDialog(false);
    setSelectedRide(null);
    setQuantity(1);
    setTicketCodes([]);
    setCurrentTicketIndex(0);
  };

  const handleNextTicket = () => {
    setCurrentTicketIndex((prevIndex) => (prevIndex + 1) % ticketCodes.length);
  };

  const handlePrevTicket = () => {
    setCurrentTicketIndex(
      (prevIndex) => (prevIndex - 1 + ticketCodes.length) % ticketCodes.length
    );
  };

  const handleCreateCard = () => {
    
  }

  return (
    <div className="grid-container">
      {rides.map((ride) => (
        <GenericCard key={ride.id} item={ride}>
          <div style={{ marginTop: "100px" }}>
            <img
              src={ride.imageUrl}
              alt={ride.Name}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div>
            <p>
              <strong>Min Height:</strong> {ride.MinHeight} cm
            </p>
            <p>
              <strong>Max Height:</strong> {ride.MaxHeight} cm
            </p>
            <p>
              <strong>Duration:</strong> {ride.Duration} minutes
            </p>
          </div>
          {selectedRide === ride.id ? (
            <div>
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                style={{ marginTop: "10px" }}
              />
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "10px", marginLeft: "10px" }}
                onClick={handleConfirmPurchase}
              >
                Confirm Purchase
              </Button>
            </div>
          ) : (
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
              onClick={() => handlePurchase(ride.id)}
            >
              Purchase
            </Button>
          )}
        </GenericCard>
      ))}

      <Dialog open={showTicketDialog} onClose={handleCloseTicketDialog}>
        <DialogTitle>Ticket Details</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <QRCode value={ticketCodes[currentTicketIndex]} size={200} />
            <p>Ticket Code: {ticketCodes[currentTicketIndex]}</p>
            <p>Quantity: {quantity}</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrevTicket} disabled={quantity === 1}>
            Prev
          </Button>
          <Button
            onClick={handleNextTicket}
            disabled={currentTicketIndex === ticketCodes.length - 1}
          >
            Next
          </Button>
          <Button onClick={handleCloseTicketDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

<div style={{marginTop: "15px", display: "flex", flexDirection: "column", alignItems: "center" }}>
  <ButtonComponent variant="contained" color="primary" size="small" onClick={handleCreateCard}>
    Create
  </ButtonComponent>
</div>

      
    </div>
    
  );
  
};

export default RidesPage;*/

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
import RidesPopup from "../../components/RidesPopup";
import DeleteConfirmationPopup from "../../components/DeleteConfirmationPopup";
import QRCode from "qrcode.react";


interface Rides {
  imageUrl: string | undefined;
  id: number;
  name: string;
  type: string;
  minHeight: number;
  maxCapacity: number;
  duration: number;
  description: string;//this may not be needed (not in db so far)
  openingTime: string;
  closingTime: string;
}

const fakeParkAreas: Rides[] = [
  {
    id: 1,
    name: "The Great Ride",
    description:
      "The best ride in the park!",
    minHeight: 100,
    maxCapacity: 50,
    type: "Rollercoaster",
    duration: 5,
    openingTime: "09:00",
    closingTime: "18:00",
    imageUrl:
      "https://sf-static.sixflags.com/wp-content/uploads/2020/04/sfmm_viper2-scaled.jpg",
  },
  {
    id: 2,
    name: "The Awesome Ride",
    description:
      "The second best ride in the park!",
    minHeight: 100,
    maxCapacity: 25,
    type: "Rollercoaster", //rollercoaster, water ride, ferris wheel
    duration: 5,
    openingTime: "10:00",
    closingTime: "20:00",
    imageUrl:
      "https://sf-static.sixflags.com/wp-content/uploads/Anne-McDade-BATMAN-2-min-scaled.jpg",
  },
  // Add more fake data as needed
];

const RidesPage: React.FC = () => {
  const [selectedRide, setSelectedRide] = useState<Rides[]>(fakeParkAreas);
  const [openPopup, setOpenPopup] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Rides>>({});
  const [selectedParkArea, setSelectedParkArea] = useState<Rides | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [showTicketDialog, setShowTicketDialog] = useState<boolean>(false);
  const [ticketCodes, setTicketCodes] = useState<string[]>([]);
  const [currentTicketIndex, setCurrentTicketIndex] = useState<number>(0);

  const level = Number(localStorage.getItem("level"));
  const display_crud = level === 999 ? true : false;

  const handleCreateClick = () => {
    setFormData({});
    setIsEditing(false);
    setOpenPopup(true);
  };

  const handleFormSubmit = (formData: Partial<Rides>) => {
    if (isEditing && selectedParkArea) {
      const updatedParkAreas = selectedRide.map((area) =>
        area.id === selectedParkArea.id ? { ...area, ...formData } : area
      );
      setSelectedRide(updatedParkAreas);
    } else {
      // Generate a new ID for the new park area
      const newId = selectedRide.length + 1;

      // Create a new park area object with the form data and the new ID
      const newParkArea: Rides = {
        id: newId,
        name: formData.name || "",
        description: formData.description || "",
        openingTime: formData.openingTime || "",
        minHeight: formData.minHeight || 0,
        maxCapacity: formData.maxCapacity || 0,
        type: formData.type || "",
        duration: formData.duration || 0,
        closingTime: formData.closingTime || "",
        imageUrl: formData.imageUrl || "https://via.placeholder.com/150",
      };

      setSelectedRide([...selectedRide, newParkArea]);
    }
    setOpenPopup(false);
  };

  const handleOpenPurchaseDialog = (selectedRide: Rides) => {
    setSelectedRide(fakeParkAreas); // Assuming setSelectedRide sets the state for the current ride of interest
    setShowTicketDialog(true); // Show the dialog to start the purchase process
  };

  const handleConfirmPurchase = () => {
    // Generate random ticket codes
    const codes = Array.from({ length: quantity }, () =>
      Math.random().toString(36).substring(7)
    );
    setTicketCodes(codes);
    setShowTicketDialog(true);
  };

  const handleCloseTicketDialog = () => {
    setShowTicketDialog(false);
    setSelectedRide(null);
    setQuantity(1);
    setTicketCodes([]);
    setCurrentTicketIndex(0);
  };

  const handleNextTicket = () => {
    setCurrentTicketIndex((prevIndex) => (prevIndex + 1) % ticketCodes.length);
  };

  const handlePrevTicket = () => {
    setCurrentTicketIndex(
      (prevIndex) => (prevIndex - 1 + ticketCodes.length) % ticketCodes.length
    );
  };

  const handleEditClick = (parkArea: Rides) => {
    setFormData(parkArea);
    setSelectedParkArea(parkArea);
    setIsEditing(true);
    setOpenPopup(true);
  };

  const handleDeleteClick = (parkArea: Rides) => {
    setSelectedParkArea(parkArea);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedParkArea) {
      const updatedParkAreas = selectedRide.filter(
        (area) => area.id !== selectedParkArea.id
      );
      setSelectedRide(updatedParkAreas);
    }
    setOpenDeleteDialog(false);
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {display_crud && (
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
        {selectedRide.map((area) => (
          <Card
            key={area.id}
            sx={{
              margin: 1,
              width: 300,
              height: 660,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={area.imageUrl}
              alt="Park Area"
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
                {area.name}
              </Typography>
              <Divider sx={{ marginY: 1 }} />
              <Typography color="text.secondary" gutterBottom>
                {area.type}
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
                <Typography variant="body2">{area.description}</Typography>
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
                  Opening Time: {area.openingTime}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  Closing Time: {area.closingTime}
                </Typography>
              </Box>
              <Divider sx={{ marginY: 1 }} />
              <Typography variant="body2" fontWeight="bold">
                  Minimum Height: {area.minHeight}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  Max seating per ride: {area.maxCapacity}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  Duration of the ride: {area.duration} minutes
                </Typography>
                <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
              onClick={() => handleOpenPurchaseDialog(fakeParkAreas.id)}
            >
              Purchase
            </Button>
            </CardContent>
            {display_crud && (
              <CardActions>
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEditClick(area)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDeleteClick(area)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            )}

            {selectedRide === area.name ? (
            <div>
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                style={{ marginTop: "10px" }}
              />
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "10px", marginLeft: "10px" }}
                onClick={handleConfirmPurchase}
              >
                Confirm Purchase
              </Button>
            </div>
          ) : (
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
              onClick={() => handleOpenPurchaseDialog(fakeParkAreas.id)}
            >
              Purchase
            </Button>
          )}
            <Dialog open={showTicketDialog} onClose={handleCloseTicketDialog}>
        <DialogTitle>Ticket Details</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <QRCode value={ticketCodes[currentTicketIndex]} size={200} />
            <p>Ticket Code: {ticketCodes[currentTicketIndex]}</p>
            <p>Quantity: {quantity}</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrevTicket} disabled={quantity === 1}>
            Prev
          </Button>
          <Button
            onClick={handleNextTicket}
            disabled={currentTicketIndex === ticketCodes.length - 1}
          >
            Next
          </Button>
          <Button onClick={handleCloseTicketDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
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
    </Box>
  );
};

export default RidesPage;
