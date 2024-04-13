import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Divider,
  Typography,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface ShoppingCart {
  finalPrice: number;
  totalQuantity: number;
  items: Item[];
}

interface Item {
  rideId: number;
  name: string;
  price: number;
  quantity: number;
}

interface eventItem {
  eventId: number;
  name: string;
  price: number;
  quantity: number;
}

interface giftItem {
  giftId: number;
  name: string;
  price: number;
  quantity: number;
}

let itemIdCounter = 0;

const initialItems: Item[] = [
  {
    rideId: itemIdCounter++,
    name: "Item 1",
    price: 5,
    quantity: 2,
  },
  {
    rideId: itemIdCounter++,
    name: "Item 2",
    price: 3,
    quantity: 1,
  },
];

const ShoppingCartpage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState(initialItems);
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);

  useEffect(() => {
    // Retrieve cart items from local storage when component initializes
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);
   


  const handleCheckout = () => {
    setOpen(true);
    clearCart(); // Call the function to clear the cart
  };

  const handleClose = () => {
    setOpen(false);
    clearCart();
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleDeleteItem = (itemId: number) => {
    // Remove the item from local storage
    const updatedCartItems = cartItems.filter(item => item.rideId !== itemId);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    
    // Update the state to reflect the deletion
    setCartItems(updatedCartItems);
  };
  

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setCartItems(prevItems =>
        prevItems.filter(item => item.rideId !== deleteItem.rideId)
      );
    }
    setDeleteItem(null); // Reset the deleteItem state
  };

  const handleCancelDelete = () => {
    setDeleteItem(null);
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    // Update the quantity in the state
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.rideId === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  
    // Update the quantity in local storage
    const updatedCartItems = cartItems.map((item) =>
      item.rideId === itemId ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };
  

  const calculateFinalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem" }}>Shopping Cart</h1>
      <Divider sx={{ marginY: 1 }} />
      {/* First Box: Items in the Shopping Cart */}
      <Box sx={{ marginBottom: 2, backgroundColor: "Grey" }}>
        {/* Map through the items in the cart and display them */}
        {cartItems.map((item) => (
          <div key={item.rideId}>
            <Typography variant="h6">{item.name}</Typography>
            <Typography>Price: ${item.price}</Typography>
            <Typography>Quantity: {item.quantity}</Typography>
            <IconButton
              onClick={() => handleQuantityChange(item.rideId, item.quantity + 1)}
            >
              <AddIcon />
            </IconButton>
            <IconButton
              onClick={() => handleQuantityChange(item.rideId, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <RemoveIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteItem(item.rideId)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
      </Box>
      {/* Second Box: Checkout Button */}
      <Box sx={{ marginBottom: 2, backgroundColor: "Grey", textAlign: "center" }}>
  {/* Display the final price here */}
  <Typography variant="h6">Total Quantity: {calculateTotalQuantity()}</Typography>
  <Typography variant="h6">Total Cost: ${calculateFinalPrice()}</Typography>
  {/* Checkout Button */}
  <Button
    onClick={handleCheckout}
    variant="contained"
    color="primary"
    disabled={calculateFinalPrice() <= 0}
  >
    Checkout
  </Button>
</Box>
      {/* Delete Confirmation Dialog */}
      <Dialog
  open={deleteItem !== null}
  onClose={handleCancelDelete}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
  <DialogContent>
    <Typography variant="body1">
      Are you sure you want to delete this item?
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCancelDelete} color="primary">
      Cancel
    </Button>
    <Button onClick={handleConfirmDelete} color="primary" autoFocus>
      Confirm
    </Button>
  </DialogActions>
</Dialog>
      <Modal open={open} onClose={handleClose}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "theme.palette.grey[500]",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="textPrimary">
            Thank you for your purchase!
          </Typography>
          <Button onClick={handleClose}>Close</Button>
        </div>
      </Modal>
    </div>
  );
};

export default ShoppingCartpage;
