import React, { useState } from "react";
import "./css/GiftShops.css";
import themeParkBackground from "../../assets/images/images.jpeg";
import themeParkBackgrounds from "../../assets/images/Giftshopimage2.jpeg";
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
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";

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
    imageUrl: themeParkBackground,
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
    imageUrl: themeParkBackgrounds,
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
  const navigate = useNavigate();
  const [selectedRide, setSelectedRide] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showTicketDialog, setShowTicketDialog] = useState<boolean>(false);
  const [ticketCodes, setTicketCodes] = useState<string[]>([]);
  const [currentTicketIndex, setCurrentTicketIndex] = useState<number>(0);

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
          {/* Assuming GenericCard handles basic properties (id, Name, Description, etc.) */}
          {/* You'll need to modify GenericCard or use children for additional properties like imageUrl */}
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

{/* Create Button */}
<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
  <ButtonComponent variant="contained" color="primary" size="small" onClick={handleCreateCard}>
    Create
  </ButtonComponent>
</div>

      
    </div>
    
  );
  
};

export default RidesPage;
