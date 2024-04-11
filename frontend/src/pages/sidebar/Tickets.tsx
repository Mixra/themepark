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
  Grid, // Import Grid for layout
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QRCode from "qrcode.react";

interface Purchase {
  rideId: number;
  name: string;
  quantity: number;
  ticketCodes: string[];
  purchaseDate: string;
}

const Tickets: React.FC = () => {
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadedHistory: Purchase[] = JSON.parse(
      localStorage.getItem("purchaseHistory") || "[]"
    );
    setPurchaseHistory(loadedHistory);
  }, [historyOpen]);

  const handleOpenHistory = () => {
    setHistoryOpen(true);
  };

  const handleCloseHistory = () => {
    setHistoryOpen(false);
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
                  <ListItemText
                    primary={`${purchase.name} - Quantity: ${purchase.quantity}`}
                    secondary={`Purchase Date: ${new Date(
                      purchase.purchaseDate
                    ).toLocaleDateString()}`}
                  />
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {purchase.ticketCodes.map((code, codeIndex) => (
                      <Grid item xs={6} sm={4} md={3} key={codeIndex}>
                        <QRCode value={code} size={96} />
                      </Grid>
                    ))}
                  </Grid>
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
