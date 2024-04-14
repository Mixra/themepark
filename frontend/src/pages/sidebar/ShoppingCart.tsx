import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Divider,
  Card,
  CardContent,
  CardActions,
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



interface Item {
  id: number;
  itemType:string;
  name: string;
  price: number;
  quantity: number;
}




const ShoppingCartpage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Item[]>([]);
  
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);

  useEffect(() => {
    // Retrieve cart items from local storage when component initializes
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);
   


  const handleCheckout = () => {
    // Calculate total amount
    const totalAmount = calculateFinalPrice();
    const currDatetime = new Date().toISOString();
  
    // Store order data in local storage
    const orderData = {
      totalAmount,
      cartItems,
      currDatetime,
    };
  
    localStorage.setItem('orderData', JSON.stringify(orderData));
  
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

  const handleDeleteItem = (itemType: string, itemId: number) => {
    // Find the index of the item to delete
    const index = cartItems.findIndex(item => item.itemType === itemType && item.id === itemId);

    if (index !== -1) { // Check if item exists
        // Create a copy of the cartItems array
        const updatedCartItems = [...cartItems];
        // Remove the item at the found index
        updatedCartItems.splice(index, 1);

        // Update state with the filtered cart items
        setCartItems(updatedCartItems);

        // Update local storage with the filtered cart items
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    }
};


  
  
  

  



  const handleQuantityChange = (itemType: string, itemId: number, newQuantity: number) => {
    // Update the quantity in the state
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.itemType === itemType && item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  
    // Update the quantity in local storage
    const updatedCartItems = cartItems.map((item) =>
      item.itemType === itemType && item.id === itemId
        ? { ...item, quantity: newQuantity }
        : item
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
      {/* Ride Tickets */}
      <Box sx={{ marginBottom: 2, backgroundColor: "Grey" }}>
        {/* Render Ride Tickets Box */}
        {cartItems.some((item) => item.itemType === 'Ride') && (
          <>
            <h1 style={{ fontSize: "1.5rem" }}>Ride Tickets</h1>
            {cartItems.map((item) => (
              item.itemType === 'Ride' && (
                <div key={item.id}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography>Price per item: ${item.price}</Typography>
                  <Typography>Quantity: {item.quantity}</Typography>
                  <Typography>Total Price: ${item.price * item.quantity}</Typography>
                  <IconButton onClick={() => handleQuantityChange(item.itemType, item.id, item.quantity + 1)}>
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleQuantityChange(item.itemType, item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteItem(item.itemType, item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              )
            ))}
          </>
        )}
        </Box>

      <Box sx={{ marginBottom: 2, backgroundColor: "Grey" }}>
        {/*Event Tickets */}
        {cartItems.some((item) => item.itemType === 'Event') && (
          <>
            <h1 style={{ fontSize: "1.5rem" }}>Event Tickets</h1>
            {cartItems.map((item) => (
              item.itemType === 'Event' && (
                <div key={item.id}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography>Price per item: ${item.price}</Typography>
                  <Typography>Quantity: {item.quantity}</Typography>
                  <Typography>Total Price: ${item.price * item.quantity}</Typography>
                  <IconButton onClick={() => handleQuantityChange(item.itemType, item.id, item.quantity + 1)}>
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleQuantityChange(item.itemType, item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteItem(item.itemType, item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              )
            ))}
          </>
        )}
      </Box>

      <Box sx={{ marginBottom: 2, backgroundColor: "Grey" }}>
        {/* GiftShop Items */}
        {cartItems.some((item) => item.itemType === 'GiftShop') && (
          <>
            <h1 style={{ fontSize: "1.5rem" }}>Gift Shop Items</h1>
            {cartItems.map((item) => (
              item.itemType === 'GiftShop' && (
                <div key={item.id}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography>Price per item: ${item.price}</Typography>
                  <Typography>Quantity: {item.quantity}</Typography>
                  <Typography>Total Price: ${item.price * item.quantity}</Typography>
                  <IconButton onClick={() => handleQuantityChange(item.itemType, item.id, item.quantity + 1)}>
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleQuantityChange(item.itemType, item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteItem(item.itemType, item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              )
            ))}
          </>
        )}
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
