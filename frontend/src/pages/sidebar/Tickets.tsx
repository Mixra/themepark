import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QRCode from "qrcode.react";

interface Purchase {
  id: number;
  type: string;
  price: number;
  quantity: number;
  purchaseDate: string;
  barcode: string; // Assuming each purchase has a unique barcode value
}

const Tickets: React.FC = () => {
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);

  const handleOpenHistory = () => {
    setHistoryOpen(true);
  };

  const handleCloseHistory = () => {
    setHistoryOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenHistory}
        sx={{
          fontSize: "1.5rem",
          px: 6,
          py: 3,
          borderRadius: "25px",
          fontWeight: "bold",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      >
        View Purchase History
      </Button>

      <Dialog
        open={historyOpen}
        onClose={handleCloseHistory}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Purchase History</DialogTitle>
        <DialogContent>
          {purchaseHistory.length === 0 ? (
            <Typography sx={{ textAlign: "center" }}>
              You have not yet purchased any tickets. To do so, please navigate
              to the "Rides" panel.
            </Typography>
          ) : (
            purchaseHistory.map((purchase, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="h6">{purchase.type} Ticket</Typography>
                <Typography variant="body1">
                  Price: ${purchase.price}
                </Typography>
                <Typography variant="body1">
                  Quantity: {purchase.quantity}
                </Typography>
                <Typography variant="body1">
                  Purchase Date: {purchase.purchaseDate}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                  <QRCode value={purchase.barcode} size={128} level="H" />
                </Box>
              </Box>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <IconButton aria-label="close" onClick={handleCloseHistory}>
            <CloseIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tickets;
