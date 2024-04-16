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
import EventAvailable from "@mui/icons-material/EventAvailable";
import EventBusy from "@mui/icons-material/EventBusy";

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
        const response = await db.post("/create/events", formData);
        const newEvent = {
          ...formData,
          eventID: response.data.eventID,
        } as Event;
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
      unitPrice : selectedEvent.requireTicket ? selectedEvent.unitPrice || 0 : 0,
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
  const formatDateTime = (dateTimeString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const dateTime = new Date(dateTimeString)
      .toLocaleString("en-US", options)
      .split(", ");
    return {
      date: dateTime[0], // The date part
      time: dateTime[1], // The time part
    };
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
              m: 2, // Consistent margin around cards for better spacing
              width: 300, // Standard width to maintain layout
              display: "flex",
              flexDirection: "column",
              borderRadius: 2, // Soft rounded corners for a modern touch
              boxShadow: "1px 2px 4px rgba(0,0,0,0.1)", // Subtle shadow for depth
              transition: "0.3s", // Smooth transition for hover effects
              "&:hover": {
                boxShadow: "2px 4px 8px rgba(0,0,0,0.2)", // Slightly more pronounced shadow on hover
              },
              overflow: "hidden", // Ensures content stays within the card
            }}
          >
            <Box
              component="img"
              src={thisevent.imageUrl}
              alt="Event"
              sx={{
                width: "100%",
                height: 200, // Fixed height for images
                objectFit: "cover", // Ensures images cover the area well without distortion
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.03)", // Gentle zoom on hover for a dynamic effect
                },
              }}
            />
            <CardContent sx={{ flexGrow: 1, padding: 2 }}>
              <Typography gutterBottom variant="h6" component="div">
                {thisevent.eventName}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {thisevent.eventType}
              </Typography>
              <Box
                sx={{
                  my: 1,
                  p: 1,
                  bgcolor: "background.paper",
                  overflow: "auto",
                  maxHeight: "120px", // Ensures the description box has a max height
                  border: "1px solid #e0e0e0", // Subtle border for the description box
                  borderRadius: "4px", // Rounded corners for the box
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
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Opening Date:
                  </Typography>
                  <Typography variant="body2">
                    {formatDateTime(thisevent.startDate).date}
                  </Typography>
                  <Typography variant="body2">
                    {formatDateTime(thisevent.startDate).time}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Closing Date:
                  </Typography>
                  <Typography variant="body2">
                    {formatDateTime(thisevent.endDate).date}
                  </Typography>
                  <Typography variant="body2">
                    {formatDateTime(thisevent.endDate).time}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ marginY: 1 }} />
              {thisevent.requireTicket ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  mb={2}
                >
                  <Typography
                    variant="h6"
                    color="secondary"
                    gutterBottom
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <EventAvailable
                      color="inherit"
                      style={{ marginRight: 8 }}
                    />{" "}
                    Tickets Required
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenPurchaseDialog(thisevent)}
                  >
                    Add to Cart (${thisevent.unitPrice || 0})
                  </Button>
                </Box>
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  mb={2}
                >
                  <Typography
                    variant="h6"
                    color="error"
                    gutterBottom
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <EventBusy color="inherit" style={{ marginRight: 8 }} /> No
                    Tickets Required
                  </Typography>
                </Box>
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
