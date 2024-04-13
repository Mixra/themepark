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
import DeleteRideConfirmation from "../../components/DeleteRideConfirmation";


interface Rides {
  imageUrl: string | undefined;
  id: number;
  name: string;
  type: string;
  minHeight: number;
  maxCapacity: number;
  duration: number;
  description: string;
  openingTime: string;
  closingTime: string;
  price: number; 
  //hasCrud?: boolean;
}

interface Purchase {
  rideId: number;
  name: string;
  quantity: number;
  price:number;
  ticketCodes: string[];
}

const fakeRides: Rides[] = [
  {
    id: 1,
    name: "Jungle Expedition",
    description:
      "Experience a thrilling ride through a jungle full of twists, turns, and lifelike animals on the Jungle Expedition rollercoaster.",
    minHeight: 120,
    maxCapacity: 24,
    type: "Rollercoaster",
    duration: 120,
    openingTime: "09:00",
    closingTime: "18:00",
    price: 25,
    //hasCrud: true,
    imageUrl:
      "https://media.cnn.com/api/v1/images/stellar/prod/210712153839-disneyland-jungle-cruise-ride-0709-restricted.jpg?q=w_3000,h_2000,x_0,y_0,c_fill",
  },
  {
    id: 2,
    name: "Mystic River",
    description:
      "A captivating water ride that takes adventurers on a thrilling journey through enchanting landscapes and mysterious caves, sprinkled with unexpected splashes and serene moments, perfect for family fun",
    minHeight: 100,
    maxCapacity: 30,
    type: "Water Ride",
    duration: 180,
    openingTime: "10:00",
    closingTime: "20:00",
    price: 20,
    //hasCrud: false,
    imageUrl:
      "https://blooloop.com/wp-content/uploads/2019/03/6-guests-on-Carowinds-Rip-Roarin-Rapids.jpeg",
  },
  {
    id: 3,
    name: "Sky High Adventure",
    description:
      "Takes you and your family on a gentle ride up high, where you can see beautiful views all around, making it a fun and memorable experience for everyone.",
    minHeight: 0,
    maxCapacity: 144,
    type: "Ferris Wheel",
    duration: 15,
    openingTime: "10:00",
    closingTime: "20:00",
    price: 25,
    //hasCrud: false,
    imageUrl:
      "https://media.istockphoto.com/id/517726745/photo/ferris-wheel.jpg?s=612x612&w=0&k=20&c=0PLYAc3BZBzw5plVUlNuCP-IUoSVrDmtDV8bHlqH4wI=",
  },
  {
    id: 4,
    name: "Fairy Tale Carousel",
    description:
      "Whisks riders away on a whimsical journey atop enchanting steeds, gliding through a realm of classic stories and magical dreams come to life, perfect for children and the young at heart.",
    minHeight: 0,
    maxCapacity: 50,
    type: "Carousel",
    duration: 3,
    openingTime: "10:00",
    closingTime: "20:00",
    price: 25,
    //hasCrud: false,
    imageUrl:
      "https://www.familypark.at/wp-content/uploads/FP_Maerchenkarussell_cSemeliker_Web1.jpg",
  },
];

const RidesPage: React.FC = () => {
  const [selectedRides, setSelectedRides] = useState<Rides[]>(fakeRides);
  const [selectedRide, setSelectedRide] = useState<Rides | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showTicketDialog, setShowTicketDialog] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<Purchase[]>([]);
  

  const level = Number(localStorage.getItem("level"));
  const displayCrud = level === 999;

  const handleOpenPurchaseDialog = (ride: Rides) => {
    setSelectedRide(ride);
    setShowTicketDialog(true);
  };
  //this will be the admin portion
  const [formData, setFormData] = useState<Partial<Rides>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);


  const handleCreateClick = () => {
    setFormData({});
    setIsEditing(false);
    setOpenPopup(true);
  };

  const handleFormSubmit = (formData: Partial<Rides>) => {
    if (isEditing && selectedRide) {
      const updatedRestaurants = selectedRides.map((ride) =>
        ride.id === selectedRide.id ? { ...ride, ...formData } : ride
      );
      setSelectedRides(updatedRestaurants);
    } else {
      const newId = Math.max(...selectedRides.map((r) => r.id)) + 1; // Simplistic approach to generate a new ID

      const newRestaurant: Rides = {
        id: newId,
        //AreaID: formData.AreaID || 0, // Defaulting to 0 if not specified
        name: formData.name || "",
        type: formData.type || "",
        minHeight: formData.minHeight || 0,
        maxCapacity: formData.maxCapacity || 0,
        duration: formData.duration || 0,
        description: formData.description || "",
        openingTime: formData.openingTime || "",
        closingTime: formData.closingTime || "",
        price: formData.price|| 0,
        imageUrl: formData.imageUrl || "https://via.placeholder.com/150",
      };

      setSelectedRides([...selectedRides, newRestaurant]);
    }
    setOpenPopup(false);
  };

  const handleEditClick = (ride: Rides) => {
    setFormData(ride);
    setSelectedRide(ride);
    setIsEditing(true);
    setOpenPopup(true);
  };

  const handleDeleteClick = (ride: Rides) => {
    setSelectedRide(ride);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedRide) {
      const updatedRestaurants = selectedRides.filter(
        (ride) => ride.id !== selectedRide.id
      );
      setSelectedRides(updatedRestaurants);
    }
    setOpenDeleteDialog(false);
  };


  

  //end of admin section

  const handleAddToCart = () => {
    if (!selectedRide || quantity < 1) return;
  
    const newItem: Purchase = {
      rideId: selectedRide.id, // Use rideId instead of ride
      name: selectedRide.name,
      price: selectedRide.price,
      quantity,
      ticketCodes: [], 
    };
  
    // Get existing cart items from local storage
    const existingCartItems: Purchase[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
      
    // Check if the item already exists in the cart
    const existingItemIndex = existingCartItems.findIndex(item => item.rideId === selectedRide.id);
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
  
  


  //Closing Button 
  const handleCloseDialog = () => {
    setShowTicketDialog(false);
    setQuantity(0); // Reset quantity for future purchases
  };

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
        {selectedRides.map((ride) => (
          <Card
            key={ride.id}
            sx={{
              margin: 1,
              width: 300,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={ride.imageUrl}
              alt={ride.name}
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
                {ride.name}
              </Typography>
              <Divider sx={{ marginY: 1 }} />
              <Typography color="text.secondary" gutterBottom>
                {ride.type}
              </Typography>

              <Box
                sx={{
                  //maxHeight: 60,
                  //minHeight: 60,
                  overflow: "auto",
                  padding: 1,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  display: "inline-block",
                }}
              >
                <Typography variant="body2">{ride.description}</Typography>
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
                  Opening Time: {ride.openingTime}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  Closing Time: {ride.closingTime}
                </Typography>
              </Box>
              <Divider sx={{ marginY: 1 }} />
              <Typography variant="body2" fontWeight="bold">
                Minimum Height: {ride.minHeight}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                Max seating per ride: {ride.maxCapacity}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                Duration of the ride: {ride.duration} seconds
              </Typography>
              <CardActions style={{ justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={() => handleOpenPurchaseDialog(ride)}
              >
                Add To Cart (${ride.price})
              </Button>
            </CardActions>

            </CardContent>
            {displayCrud && (
              <CardActions>
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEditClick(ride)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDeleteClick(ride)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            )}
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
      <DeleteRideConfirmation
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

export default RidesPage;
