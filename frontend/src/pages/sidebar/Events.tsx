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
import EventPopup from "../../components/EventPopup";
import DeleteConfirmationPopup from "../../components/DeleteConfirmationPopup";

interface Event {
  EventID: number;
  AreaID: number;
  Name: string;
  Description: string;
  EventType: string;
  StartDateTime: string;
  EndDateTime: string;
  AgeRestriction: number;
  ImageUrl?: string;
  hasCrud?:boolean;
  RequiresTickets?: boolean;
  Price: number;
}

interface Purchase {
  eventID: number;
  name: string;
  quantity: number;
  price:number;
  ticketCodes: string[];
}

const initialEvents: Event[] = [
  {
    EventID: 1,
    AreaID:1,
    Name: 'FireWorks Showing',
    Description: 'The amazing firework showing with Buggy the Clown!',
    EventType: 'Showcase',
    StartDateTime: '(12:00AM) 04-04-24',
    EndDateTime: '(1:00AM) 04-04-24',
    AgeRestriction: 5,
    hasCrud: true,
    RequiresTickets:false,
    Price:0,
    ImageUrl:"https://64.media.tumblr.com/304f056d8b08280b24cb75363d0586da/eb3305b9c6f87ab3-f2/s2048x3072/596137a2b5b0f4f30e0d14138b9e80546552a2af.png",
  },
  {
    EventID: 2,
    AreaID:2,
    Name: 'Halloween Spooktacular',
    Description: 'Experience frights and delights in our annual Halloween event, complete with haunted houses and costume contests!',
    EventType: 'Seasonal',
    StartDateTime: '2024-10-31 18:00:00.000',
    EndDateTime: '2024-10-31 23:59:00.000',
    AgeRestriction: 12,
    hasCrud: true,
    RequiresTickets:false,
    Price:0,
    ImageUrl:"https://cdn.cheapoguides.com/wp-content/uploads/sites/3/2017/09/usj-horror-nights.jpg",
  },
  {
    EventID: 3,
    AreaID:3,
    Name: 'Winter Wonderland',
    Description: 'Transforming the park into a magical winter wonderland, complete with ice skating, festive lights, and holiday markets.',
    EventType: 'Holiday',
    StartDateTime: '2024-12-01 10:00:00.000',
    EndDateTime: '2025-01-05 22:00:00.000',
    AgeRestriction: 0,
    hasCrud: true,
    RequiresTickets:false,
    Price:0,
    ImageUrl:"https://live.staticflickr.com/65535/49144435618_0d2b706acf_b.jpg",
  },
  {
    EventID: 13,
    AreaID:10,
    Name: 'Medieval Festival',
    Description: 'Step back in time with our medieval festival, featuring jousts, feasts, and more.',
    EventType: 'Festival',
    StartDateTime: '2024-03-22 10:00:00.000',
    EndDateTime: '2024-03-24 20:00:00.000',
    AgeRestriction: 0,
    hasCrud: true,
    RequiresTickets:false,
    Price:0,
    ImageUrl:"https://bringmethenews.com/.image/ar_16:9%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cg_faces:center%2Cq_auto:good%2Cw_768/MTkyNTE2MTAwOTA1MjQ4MDU3/image.jpg",
  },
  // Add more events as needed
];

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [openPopup, setOpenPopup] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Event>>({});
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showTicketDialog, setShowTicketDialog] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [cartItems, setCartItems] = useState<Purchase[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  const level = Number(localStorage.getItem("level"));
  const display_Crud = level === 999 ? true : false;

 

  const handleOpenPurchaseDialog = (event: Event) => {
    setSelectedEvent(event);
    setShowTicketDialog(true);
  };

  const handleAddToCart = () => {
    if (!selectedEvent || quantity < 1) return;
  
    const newItem: Purchase = {
      eventID: selectedEvent.EventID, 
      name: selectedEvent.Name,
      price: selectedEvent.Price,
      quantity,
      ticketCodes: [], 
    };
  
    // Get existing cart items from local storage
    const existingCartItems: Purchase[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
      
    // Check if the item already exists in the cart
    const existingItemIndex = existingCartItems.findIndex(item => item.eventID === selectedEvent.EventID);
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
    localStorage.setItem('cartItems', JSON.stringify(existingCartItems));
  
    // Close the purchase dialog after adding to cart
    setShowTicketDialog(false);
  };

  const handleCloseDialog = () => {
    setShowTicketDialog(false);
    setQuantity(0); // Reset quantity for future purchases
  };



   const handleCreateClick = () => {
    setFormData({});
    setIsEditing(false);
    setOpenPopup(true);
  };

  const handleFormSubmit = (formData: Partial<Event>) => {
    if (isEditing && selectedEvent) {
      const updatedEvent = events.map((thisevent) =>
        thisevent.EventID === selectedEvent.EventID
          ? { ...thisevent, ...formData }
          : thisevent
      );
      setEvents(updatedEvent);
    } else {
      const newId =
        Math.max(...events.map((r) => r.EventID)) + 1; // Simplistic approach to generate a new ID
      const newEvent: Event = {
        EventID: newId,
        AreaID: formData.AreaID || 0,
        Name: formData.Name || "",
        Description: formData.Description || "",
        EventType: formData.EventType || "",
        StartDateTime: formData.StartDateTime || "",
        EndDateTime: formData.EndDateTime || "",
        AgeRestriction: formData.AgeRestriction || 0, //No Age Restriction on creation
        RequiresTickets: formData.RequiresTickets || false,
        Price: formData.Price || 0,
        ImageUrl: "https://via.placeholder.com/150",
      };

      setEvents([...events, newEvent]);
    }
    setOpenPopup(false);
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

  const handleDeleteConfirm = () => {
    if (selectedEvent) {
      const updatedEvent = events.filter(
        (event) => event.EventID !== selectedEvent?.EventID
      );
      setEvents(updatedEvent);
    }
    setOpenDeleteDialog(false);
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {display_Crud && (
        <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
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
            key={thisevent.EventID}
            sx={{
              margin: 1,
              width: 300,
              height: 660,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={thisevent.ImageUrl}
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
                {thisevent.Name}
              </Typography>
              <Divider sx={{ marginY: 1 }} />
              <Typography color="text.secondary" gutterBottom>
                {thisevent.EventType}
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
                <Typography variant="body2">{thisevent.Description}</Typography>
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
                  Opening Time: {thisevent.StartDateTime}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  Closing Time: {thisevent.EndDateTime}
                </Typography>
              </Box>
              <Divider sx={{ marginY: 1 }} />
              {thisevent.Price > 0 ? (
                <div>
                  <h1 style={{ fontSize: "1.5rem" }}>Tickets Required</h1>
                  <Button variant="contained" color="primary"
                   onClick={() => handleOpenPurchaseDialog(thisevent)}
                   >
                    Add to Cart (${thisevent.Price})
                  </Button>
                </div>
              ) : (
                <h1 style={{ fontSize: "1.5rem" }}>No Tickets Required</h1>
              )}
            </CardContent>
            {display_Crud && (
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
       <Box/>
     
    </Dialog>

    </Box>
  );
};

export default EventsPage;
