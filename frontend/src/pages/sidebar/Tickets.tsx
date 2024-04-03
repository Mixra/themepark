import React, { useState } from "react";
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
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Purchase {
  id: number;
  type: string;
  price: number;
  quantity: number;
  purchaseDate: string;
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
    <>
      <Button variant="outlined" onClick={handleOpenHistory} sx={{ my: 2 }}>
        View Purchase History
      </Button>

      <Grid
        container
        spacing={4}
        sx={{ padding: "10px", justifyContent: "center" }}
      >
        {/* Removed "Fast Pass" and "Normal" tickets */}
      </Grid>

      <Dialog
        open={historyOpen}
        onClose={handleCloseHistory}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Purchase History
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
        </DialogTitle>
        <DialogContent dividers>
          {purchaseHistory.length > 0 ? (
            <List>
              {purchaseHistory.map((purchase) => (
                <ListItem key={purchase.id}>
                  <ListItemText
                    primary={`${purchase.type} Ticket - $${purchase.price}`}
                    secondary={`Quantity: ${purchase.quantity}, Purchase Date: ${purchase.purchaseDate}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography sx={{ textAlign: "center" }}>
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
