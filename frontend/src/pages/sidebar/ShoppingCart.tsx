import React, { useState } from "react";
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
  purchaseID: number;
  name: string;
  price: number;
  quantity: number;
}

let itemIdCounter = 0;

const initialItems: Item[] = [
  {
    purchaseID: itemIdCounter++,
    name: "Item 1",
    price: 5,
    quantity: 2,
  },
  {
    purchaseID: itemIdCounter++,
    name: "Item 2",
    price: 3,
    quantity: 1,
  },
];

const ShoppingCartpage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState(initialItems);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

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
    setDeleteItemId(itemId);
  };

  const handleConfirmDelete = () => {
    if (deleteItemId !== null) {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.purchaseID !== deleteItemId)
      );
    }
    setDeleteItemId(null);
  };

  const handleCancelDelete = () => {
    setDeleteItemId(null);
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.purchaseID === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
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
          <div key={item.purchaseID}>
            <Typography variant="h6">{item.name}</Typography>
            <Typography>Price: ${item.price}</Typography>
            <Typography>Quantity: {item.quantity}</Typography>
            <IconButton
              onClick={() => handleQuantityChange(item.purchaseID, item.quantity + 1)}
            >
              <AddIcon />
            </IconButton>
            <IconButton
              onClick={() => handleQuantityChange(item.purchaseID, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <RemoveIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteItem(item.purchaseID)}>
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
        open={deleteItemId !== null}
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
