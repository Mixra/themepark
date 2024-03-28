// TicketsPage.tsx
import React, { useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Ticket {
  id: number;
  type: string;
  price: number;
  quantity: number;
  description: string;
  benefits: string[];
}

interface Purchase {
  id: number;
  type: string;
  price: number;
  quantity: number;
  purchaseDate: string;
}

const tickets: Ticket[] = [
  {
    id: 1,
    type: "Fast Pass",
    price: 120,
    quantity: 100,
    description: "Skip the lines and enjoy more rides with the Fast Pass!",
    benefits: ["Less waiting time", "Exclusive access to select rides"],
  },
  {
    id: 2,
    type: "Normal",
    price: 60,
    quantity: 200,
    description:
      "Enjoy a day full of adventure and fun with our standard entry ticket.",
    benefits: ["Full day access", "Over 50 rides and attractions"],
  },
  // Add more tickets as needed
];

const Tickets: React.FC = () => {
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);

  const handlePurchase = (ticket: Ticket) => {
    const newPurchase: Purchase = {
      id: purchaseHistory.length + 1,
      type: ticket.type,
      price: ticket.price,
      quantity: 1, // Assuming a single ticket purchase for simplicity
      purchaseDate: new Date().toLocaleDateString(),
    };
    setPurchaseHistory([...purchaseHistory, newPurchase]);
  };

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
        {tickets.map((ticket) => (
          <Grid item xs={12} sm={6} md={4} key={ticket.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                minHeight: 450,
              }}
            >
              <CardMedia
                component="img"
                height="200" // Increased height
                image="/static/images/cards/contemplative-reptile.jpg"
                alt={ticket.type}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {ticket.type}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: ${ticket.price} - Quantity: {ticket.quantity}
                </Typography>
                <Typography variant="body1" marginTop={2}>
                  {ticket.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Benefits: {ticket.benefits.join(", ")}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  sx={{ width: "100%" }}
                  onClick={() => handlePurchase(ticket)}
                >
                  Purchase
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
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
