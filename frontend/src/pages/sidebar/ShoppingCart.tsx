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
import Topbar from "../../components/Topbar";
import db from "../../components/db";
import { useCart } from "../../components/CartContext";
interface Item {
  id: number;
  itemType: ItemType;
  name: string;
  unitPrice: number;
  quantity: number;
}

// Define a union type for item types
type ItemType = "Event" | "Ride" | "GiftShop";

// Define interfaces for each item type with their respective ID properties
interface EventItem extends Item {
  eventID: number;
}

interface RideItem extends Item {
  rideId: number;
}

interface GiftShopItem extends Item {
  itemId: number;
}

const ShoppingCartpage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { cartItems, setCartItems } = useCart();

  useEffect(() => {
    // Retrieve cart items from local storage when component initializes
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  const handleCheckout = async (): Promise<void> => {
    const totalAmount = calculateFinalPrice();
    const currDatetime = new Date().toISOString();

    const orderItems = cartItems.map((item) => {
      if (item.itemType === "Event") {
        const eventItem = item as EventItem;
        return {
          itemType: item.itemType,
          eventID: eventItem.eventID,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        };
      } else if (item.itemType === "Ride") {
        const rideItem = item as RideItem;
        return {
          itemType: item.itemType,
          rideID: rideItem.rideId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        };
      } else if (item.itemType === "GiftShop") {
        const giftShopItem = item as GiftShopItem;
        return {
          itemType: item.itemType,
          itemID: giftShopItem.itemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        };
      }
      setOpen(true);
      clearCart();
    });

    const orderData = {
      items: orderItems,
    };

    try {
      const response = await db.post("/order/", orderData);
      console.log("Order placed successfully:", response.data);
      setOpen(true);
    } catch (error) {
      console.error("Error placing order:", error);
      // Handle error scenario
    }
  };

  const handleClose = () => {
    setOpen(false);
    clearCart();
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem("cartItems", JSON.stringify([]));
  };

  //Changing the value of item quantity
  const handleQuantityChange = (
    itemType: ItemType,
    itemId: number,
    newQuantity: number
  ) => {
    // Create a copy of the cartItems array and find the item to update
    const updatedCartItems = cartItems.map((item) => {
      // Check item type and cast accordingly
      if (item.itemType === itemType) {
        // Check if the item is of type EventItem
        if (itemType === "Event") {
          const eventItem = item as EventItem;
          if (eventItem.eventID === itemId) {
            return { ...item, quantity: newQuantity }; // Update quantity for matching item
          }
        }
        if (itemType === "Ride") {
          const rideItem = item as RideItem;
          if (rideItem.rideId === itemId) {
            return { ...item, quantity: newQuantity }; // Update quantity for matching item
          }
        }
        if (itemType === "GiftShop") {
          const giftShopItem = item as GiftShopItem;
          if (giftShopItem.itemId === itemId) {
            return { ...item, quantity: newQuantity }; // Update quantity for matching item
          }
        }
      }
      return item; // Return unchanged item for other items
    });

    // Update state with the modified cart items
    setCartItems(updatedCartItems);

    // Update local storage with the modified cart items
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const handleDeleteItem = (itemType: ItemType, itemId: number) => {
    setCartItems((currentItems) => {
      return currentItems.filter((item) => {
        if (itemType === "Event" && "eventID" in item) {
          return item.eventID !== itemId;
        } else if (itemType === "Ride" && "rideId" in item) {
          return item.rideId !== itemId;
        } else if (itemType === "GiftShop" && "itemId" in item) {
          return item.itemId !== itemId;
        }
        return true; // Keep the item if it doesn't match the criteria for deletion
      });
    });
    // Note: No need to update localStorage here, as it should be handled by the effect in CartContext
  };
  //Calculations
  const calculateFinalPrice = () => {
    const totalPrice = cartItems.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    );
    return parseFloat(totalPrice.toFixed(2)); // Convert string to number
  };

  const calculateTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <Box>
      <h1 style={{ fontSize: "1.5rem" }}>Shopping Cart: </h1>
      <h1 style={{ fontSize: "1.5rem" }}>{calculateTotalQuantity()} Items</h1>
      <Divider sx={{ marginY: 1 }} />
      {cartItems.length === 0 ? (
        <Typography>No items added yet</Typography>
      ) : (
        <Card sx={{ display: "flex" }}>
          {/* Left side - Cart items */}
          <Box sx={{ marginX: 10 }}>
            {/* Ride Tickets */}
            {cartItems.some((item) => item.itemType === "Ride") && (
              <>
                <h1 style={{ fontSize: "1.5rem" }}>Ride Tickets</h1>
                <Divider sx={{ marginY: 1, border: "1px solid #ccc" }} />
                {cartItems.map((item) => {
                  if (item.itemType === "Ride") {
                    const rideItem = item as RideItem; // Cast item to RideItem
                    return (
                      <Box key={rideItem.rideId}>
                        <Typography fontSize="1.2rem">
                          {rideItem.name}: ${rideItem.unitPrice}
                        </Typography>

                        <Typography fontSize="1rem">
                          Item Total: $
                          {(rideItem.unitPrice * rideItem.quantity).toFixed(2)}
                        </Typography>
                        <Box sx={{ alignItems: "center" }}>
                          <IconButton
                            onClick={() =>
                              handleQuantityChange(
                                rideItem.itemType,
                                rideItem.rideId,
                                rideItem.quantity + 1
                              )
                            }
                          >
                            <AddIcon />
                          </IconButton>
                          <Typography>{rideItem.quantity}</Typography>
                          <IconButton
                            onClick={() =>
                              handleQuantityChange(
                                rideItem.itemType,
                                rideItem.rideId,
                                rideItem.quantity - 1
                              )
                            }
                            disabled={rideItem.quantity <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                        <Box sx={{ alignItems: "center" }}>
                          <IconButton
                            onClick={() =>
                              handleDeleteItem(
                                rideItem.itemType,
                                rideItem.rideId
                              )
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    );
                  }
                  return null;
                })}
              </>
            )}
            {/* Event Tickets */}
            {cartItems.some((item) => item.itemType === "Event") && (
              <>
                <h1 style={{ fontSize: "1.5rem" }}>Event Tickets</h1>
                <Divider sx={{ marginY: 1, border: "1px solid #ccc" }} />
                {cartItems.map((item) => {
                  if (item.itemType === "Event") {
                    const eventItem = item as EventItem; // Cast item to EventItem
                    return (
                      <Box key={eventItem.eventID}>
                        <Typography fontSize="1.2rem">
                          {eventItem.name}: ${eventItem.unitPrice}
                        </Typography>

                        <Typography fontSize="1rem">
                          Item Total: $
                          {(eventItem.unitPrice * eventItem.quantity).toFixed(
                            2
                          )}
                        </Typography>
                        <Box sx={{ alignItems: "center" }}>
                          <IconButton
                            onClick={() =>
                              handleQuantityChange(
                                eventItem.itemType,
                                eventItem.eventID,
                                eventItem.quantity + 1
                              )
                            }
                          >
                            <AddIcon />
                          </IconButton>
                          <Typography>{eventItem.quantity}</Typography>
                          <IconButton
                            onClick={() =>
                              handleQuantityChange(
                                eventItem.itemType,
                                eventItem.eventID,
                                eventItem.quantity - 1
                              )
                            }
                            disabled={eventItem.quantity <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                        <Box sx={{ alignItems: "center" }}>
                          <IconButton
                            onClick={() =>
                              handleDeleteItem(
                                eventItem.itemType,
                                eventItem.eventID
                              )
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    );
                  }
                  return null;
                })}
              </>
            )}
            {/* GiftShop Items */}
            {cartItems.some((item) => item.itemType === "GiftShop") && (
              <>
                <h1 style={{ fontSize: "1.5rem" }}>Gift Shop Items</h1>
                <Divider sx={{ marginY: 1, border: "1px solid #ccc" }} />

                {cartItems.map((item) => {
                  if (item.itemType === "GiftShop") {
                    const giftShopItem = item as GiftShopItem; // Cast item to GiftShopItem
                    return (
                      <Box key={giftShopItem.itemId}>
                        <Typography fontSize="1.2rem">
                          {giftShopItem.name}: ${giftShopItem.unitPrice}
                        </Typography>

                        <Typography fontSize="1rem">
                          Item Total: $
                          {(
                            giftShopItem.unitPrice * giftShopItem.quantity
                          ).toFixed(2)}
                        </Typography>
                        <Box sx={{ alignItems: "center" }}>
                          <IconButton
                            onClick={() =>
                              handleQuantityChange(
                                giftShopItem.itemType,
                                giftShopItem.itemId,
                                giftShopItem.quantity + 1
                              )
                            }
                          >
                            <AddIcon />
                          </IconButton>
                          <Typography>{giftShopItem.quantity}</Typography>
                          <IconButton
                            onClick={() =>
                              handleQuantityChange(
                                giftShopItem.itemType,
                                giftShopItem.itemId,
                                giftShopItem.quantity - 1
                              )
                            }
                            disabled={giftShopItem.quantity <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                        <Box sx={{ alignItems: "center" }}>
                          <IconButton
                            onClick={() =>
                              handleDeleteItem(
                                giftShopItem.itemType,
                                giftShopItem.itemId
                              )
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    );
                  }
                  return null;
                })}
              </>
            )}
          </Box>

          <Divider sx={{ marginY: 1, border: "1px solid #ccc" }} />
          {/* Second Box: Checkout Button */}

          <Box sx={{ marginX: 5, marginBottom: "auto" }}>
            {/* Display the final price here */}
            <h1 style={{ fontSize: "1.5rem" }}>Order Summary</h1>
            <Typography fontSize="1rem">
              Total Items: {calculateTotalQuantity()}
            </Typography>
            <Typography fontSize="1rem">
              Total Cost:{" "}
              <Typography variant="h6">${calculateFinalPrice()}</Typography>
            </Typography>
            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              variant="contained"
              color="primary"
              disabled={calculateFinalPrice() <= 0}
            >
              Checkout
            </Button>
            <Modal open={open} onClose={handleClose}>
              <Card
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",

                  padding: "2rem",
                  textAlign: "center",
                }}
              >
                <Typography fontSize="2rem" color="textPrimary">
                  Thank you for your purchase!
                </Typography>
                <Typography fontSize="1rem" color="textPrimary">
                  Find your Tickets in Purchase History
                </Typography>
                <Button onClick={handleClose}>Close</Button>
              </Card>
            </Modal>
          </Box>
        </Card>
      )}
    </Box>
  );
};

export default ShoppingCartpage;
