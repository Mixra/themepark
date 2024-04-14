import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  DialogActions,
  Typography,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QRCode from "qrcode.react";

interface Purchase {
  id: number;
  name: string;
  price: number;
  itemType: string;
  quantity: number;
  purchaseDate: string;
}

const Tickets: React.FC = () => {
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadedDataString = localStorage.getItem("orderData") || "{}";
    const loadedData = JSON.parse(loadedDataString);
  
    // Extract purchase history from cartItems
    const purchaseHistory: Purchase[] = loadedData.cartItems.map((item: any) => {
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        itemType: item.itemType,
        quantity: item.quantity,
        purchaseDate: loadedData.currDatetime // Using the currDatetime from the outer object
      };
    });
  
    setPurchaseHistory(purchaseHistory);
  }, [historyOpen]);
  

  const handleOpenHistory = () => {
    setHistoryOpen(true);
  };

  const handleCloseHistory = () => {
    setHistoryOpen(false);
  };
  const renderQRCodeOrDetails = (purchase: Purchase) => {
    if (purchase.itemType === "GiftShop") {
      return (
        <>
          <ListItemText
            primary={`${purchase.name} - Quantity: ${purchase.quantity}`}
            secondary={`Purchase Date: ${new Date(purchase.purchaseDate).toLocaleDateString()}`}
          />
        </>
      );
    } else {
      return (
        <>
          <ListItemText
            primary={`${purchase.name} - Quantity: ${purchase.quantity}`}
            secondary={`Purchase Date: ${new Date(purchase.purchaseDate).toLocaleDateString()}`}
          />
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {/* Generating QR Codes */}
            {Array.from({ length: purchase.quantity }).map((_, codeIndex) => (
              <Grid item xs={6} sm={4} md={3} key={codeIndex}>
                <QRCode
                  value={`${purchase.name} - ${purchase.itemType} - ${purchase.purchaseDate}`}
                  size={96}
                />
              </Grid>
            ))}
          </Grid>
        </>
      );
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={handleOpenHistory} sx={{ my: 2 }}>
      View Purchase History
    </Button>

    <Dialog
      open={historyOpen}
      onClose={handleCloseHistory}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Purchase History</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseHistory}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        {purchaseHistory.length > 0 ? (
          <List>
            {purchaseHistory.map((purchase, index) => (
              <ListItem
                key={index}
                sx={{ flexDirection: "column", alignItems: "start" }}
              >
                {renderQRCodeOrDetails(purchase)}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography textAlign="center">
            You have not yet purchased any tickets.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseHistory}>Close</Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default Tickets;



