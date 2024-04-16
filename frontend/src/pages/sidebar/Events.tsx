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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EventPopup from "../../components/EventPopup";
import DeleteConfirmationPopup from "../../components/DeleteConfirmationPopup";
import db from "../../components/db";
import { Event, Purchase } from "../../models/event.model";
import { format } from "date-fns";

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showTicketDialog, setShowTicketDialog] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<Purchase[]>([]);

  const level = Number(localStorage.getItem("level"));
  const displayCrud = level === 999;

  const handleOpenPurchaseDialog = (event: Event) => {
    setSelectedEvent(event);
    setShowTicketDialog(true);
  };

  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await db.get("/view/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  // This will be the admin portion
  const [formData, setFormData] = useState<Partial<Event>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateClick = () => {
    setFormData({});
    setIsEditing(false);
    setOpenPopup(true);
  };

  const handleFormSubmit = async (formData: Partial<Event>) => {
    try {
      setIsSubmitting(true);
      if (isEditing && selectedEvent) {
        const updatedEvent = { ...selectedEvent, ...formData };
        await db.put("/edit/events", updatedEvent);
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.eventID === selectedEvent.eventID ? updatedEvent : event
          )
        );
      } else {
        const newEvent = { ...formData } as Event;
        await db.post("/create/events", newEvent);
        setEvents((prevEvents) => [...prevEvents, newEvent]);
      }
      setOpenPopup(false);
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (event: Event) => {
    setFormData(event);
    setSelectedEvent(event);
    setIsEditing(true);
    setOpenPopup(true);
  };

  const handleDeleteClick = (event: Event) => {
    setSelectedEvent(event);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedEvent) {
        await db.delete(`/delete/events/${selectedEvent.eventID}`);
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.eventID !== selectedEvent.eventID)
        );
      }
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // End of admin section

  const handleAddToCart = () => {
    if (!selectedEvent || quantity < 1) return;

    const newItem: Purchase = {
      eventID: selectedEvent.eventID,
      name: selectedEvent.eventName,
      unitPrice: selectedEvent.requireTicket ? selectedEvent.unitPrice || 0 : 0,
      itemType: "Event",
      quantity,
    };

    // Get existing cart items from local storage
    const existingCartItems: Purchase[] = JSON.parse(
      localStorage.getItem("cartItems") || "[]"
    );

    // Check if the item already exists in the cart
    const existingItemIndex = existingCartItems.findIndex(
      (item) => item.eventID === selectedEvent.eventID
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

  // Closing Button
  const handleCloseDialog = () => {
    setShowTicketDialog(false);
    setQuantity(1); // Reset quantity for future purchases
  };

  // Function to format date and time
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,

      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };
  // Function to format military time to AM/PM format

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
        {events.map((thisevent) => (
          <Card
            key={thisevent.eventID}
            sx={{
              margin: 1,
              width: 300,
              height: 660,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={thisevent.imageUrl}
              alt="Event"
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
                {thisevent.eventName}
              </Typography>
              <Divider sx={{ marginY: 1 }} />
              <Typography color="text.secondary" gutterBottom>
                {thisevent.eventType}
              </Typography>
              <Box
                sx={{
                  maxHeight: 120,
                  minHeight: 120,
                  overflow: "auto",
                  padding: 1,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2">{thisevent.description}</Typography>
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
                  Opening Time:
                  <Typography variant="body2" fontWeight="bold">
                    {formatDateTime(thisevent.startDate)}
                  </Typography>
                </Typography>

                <Typography variant="body2" fontWeight="bold">
                  Closing Time:
                  <Typography variant="body2" fontWeight="bold">
                    {formatDateTime(thisevent.endDate)}
                  </Typography>
                </Typography>
              </Box>

              <Divider sx={{ marginY: 1 }} />
              {thisevent.requireTicket ? (
                <div>
                  <h1 style={{ fontSize: "1.5rem" }}>Tickets Required</h1>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenPurchaseDialog(thisevent)}
                  >
                    Add to Cart (${thisevent.unitPrice || 0})
                  </Button>
                </div>
              ) : (
                <h1 style={{ fontSize: "1.5rem" }}>No Tickets Required</h1>
              )}
            </CardContent>
            {displayCrud && (
              <CardActions>
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEditClick(thisevent)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDeleteClick(thisevent)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            )}
          </Card>
        ))}
      </Box>
      <EventPopup
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

export default EventsPage;
