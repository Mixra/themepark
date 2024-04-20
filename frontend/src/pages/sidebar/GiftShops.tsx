import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import GiftShopPopup from "../../components/GiftShopPopup";
import DeleteConfirmationPopup from "../../components/DeleteConfirmationPopup";
import InventoryPopup from "../../components/InventoryPopup";
import db from "../../components/db";
import { GiftShop, Inventory } from "../../models/giftshop.model";
import { useCart } from "../../components/CartContext";
import { ClosedIndicator } from "../../components/ClosedIndicator";

const GiftShopsPage: React.FC = () => {
  const [giftShops, setGiftShops] = useState<GiftShop[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openInventoryPopup, setOpenInventoryPopup] = useState(false);
  const [formData, setFormData] = useState<Partial<GiftShop>>({});
  const [selectedGiftShop, setSelectedGiftShop] = useState<GiftShop | null>(
    null
  );
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [showTicketDialog, setShowTicketDialog] = useState<boolean>(false);
  const { cartItems, setCartItems } = useCart();
  const userLevel = Number(localStorage.getItem("level"));
  const canCreateGiftShop = userLevel === 999 || userLevel === 1;

  useEffect(() => {
    const fetchGiftShops = async () => {
      try {
        const response = await db.get("/shop");
        setGiftShops(response.data);
      } catch (error) {
        console.error("Error fetching gift shops:", error);
      }
    };
    fetchGiftShops();
  }, []);

  const handleCreateClick = () => {
    setFormData({});
    setIsEditing(false);
    setOpenPopup(true);
  };

  const handleFormSubmit = async (formData: Partial<GiftShop>) => {
    try {
      if (isEditing && formData.shopID) {
        await db.put(`/shop`, formData);
        const updatedGiftShops = giftShops.map((shop) =>
          shop.shopID === formData.shopID ? { ...shop, ...formData } : shop
        );
        setGiftShops(updatedGiftShops);
      } else {
        const response = await db.post("/shop", formData);
        const newGiftShop = {
          ...formData,
          shopID: response.data.shopID,
          inventory: [],
          hasCrud: 0, // Set hasCrud to 0 by default
        } as GiftShop;
        setGiftShops((prevGiftShops) => [...prevGiftShops, newGiftShop]);
        setSelectedGiftShop(null);
      }
      setOpenPopup(false);
    } catch (error) {
      console.error("Error saving gift shop:", error);
    }
  };

  const handleEditClick = (giftShop: GiftShop) => {
    setFormData(giftShop);
    setSelectedGiftShop(giftShop);
    setIsEditing(true);
    setOpenPopup(true);
  };

  const handleDeleteClick = (giftShop: GiftShop) => {
    setSelectedGiftShop(giftShop);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedGiftShop) {
        await db.delete(`/shop/${selectedGiftShop.shopID}`);
        setGiftShops((prevGiftShops) =>
          prevGiftShops.filter(
            (shop) => shop.shopID !== selectedGiftShop.shopID
          )
        );
      }
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting gift shop:", error);
    }
  };

  const [showFullInventory, setShowFullInventory] = useState<{
    [key: number]: boolean;
  }>({});

  const handleInventoryClick = (giftShop: GiftShop) => {
    setSelectedGiftShop(giftShop);
    setOpenInventoryPopup(true);
  };

  const handleInventoryExpand = (shopID: number) => {
    console.log("Toggling Inventory for Shop ID:", shopID);
    setShowFullInventory((prevState) => ({
      ...prevState,
      [shopID]: !prevState[shopID],
    }));
  };

  const handleCloseDialog = () => {
    setShowTicketDialog(false);
    setQuantity(1); // Reset quantity for future purchases
  };
  const handleOpenPurchaseDialog = (item: Inventory) => {
    setSelectedItem(item);
    setShowTicketDialog(true);
  };

  const handleAddToCart = () => {
    if (!selectedItem || quantity < 1) return;

    const newItem: Purchase = {
      itemId: selectedItem.itemID,
      name: selectedItem.itemName,
      unitPrice: selectedItem.unitPrice || 0,
      itemType: "GiftShop",
      quantity,
    };

    // Get existing cart items from local storage
    const existingCartItems: Purchase[] = JSON.parse(
      localStorage.getItem("cartItems") || "[]"
    );

    // Check if the item already exists in the cart
    const existingItemIndex = existingCartItems.findIndex(
      (item) => item.itemId === newItem.itemId
    );
    if (existingItemIndex !== -1) {
      // If the item already exists, update its quantity
      existingCartItems[existingItemIndex].quantity += quantity;
    } else {
      // If the item doesn't exist, add it to the cart
      existingCartItems.push(newItem);
    }

    // Update cartItems state
    setCartItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) => item.itemId === newItem.itemId
      );
      if (existingItemIndex !== -1) {
        // If the item already exists, update its quantity
        return currentItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // If the item doesn't exist, add it to the cart
        return [...currentItems, newItem];
      }
    });

    // Store updated cartItems in local storage
    localStorage.setItem("cartItems", JSON.stringify(existingCartItems));

    // Close the purchase dialog after adding to cart
    setShowTicketDialog(false);
  };

  const handleInventoryUpdate = (updatedInventory: any[]) => {
    if (selectedGiftShop) {
      const updatedGiftShops = giftShops.map((shop) =>
        shop.shopID === selectedGiftShop.shopID
          ? { ...shop, inventory: updatedInventory }
          : shop
      );
      setGiftShops(updatedGiftShops);
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {canCreateGiftShop && (
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
        {giftShops.map((shop) => (
          <Card
            key={shop.shopID}
            sx={{
              margin: 1,
              width: 300,
              height: "auto",
              display: "flex",
              flexDirection: "column",
              opacity: shop.closureStatus ? 0.5 : 1, // Reduce opacity for closed gift shops
            }}
          >
            <Box
              component="img"
              src={shop.imageURL || "https://via.placeholder.com/300x200.png"}
              alt="Gift Shop Image"
              sx={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
            />
            <CardContent
              sx={{
                flexGrow: 1,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h5" component="div" gutterBottom>
                  {shop.shopName}
                </Typography>
                {shop.closureStatus && <ClosedIndicator />}
              </Box>

              <Divider
                sx={{ marginY: 1, borderColor: "black", borderWidth: 2 }}
              />

              <Typography color="text.secondary" gutterBottom>
                <span style={{ fontWeight: "bold" }}>Merchandise Type:</span>{" "}
                {shop.merchandiseType}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {shop.description}
              </Typography>

              <Divider
                sx={{ marginY: 1, borderColor: "black", borderWidth: 2 }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2">
                  <span style={{ fontWeight: "bold" }}>Opening Time:</span>{" "}
                  {new Date(
                    `1970-01-01T${shop.openingTime}`
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Typography>

                {/* Closing Time */}
                <Typography variant="body2">
                  <span style={{ fontWeight: "bold" }}>Closing Time:</span>{" "}
                  {new Date(
                    `1970-01-01T${shop.closingTime}`
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Typography>
              </Box>

              <Divider
                sx={{ marginY: 1, borderColor: "black", borderWidth: 2 }}
              />
              <Box
                sx={{
                  maxHeight: showFullInventory[shop.shopID] ? "auto" : 200,
                  overflow: "auto",
                  padding: 2,
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                  bgcolor: "background.paper",
                  marginY: 2,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Inventory:
                </Typography>
                {shop.inventory?.length > 0 ? (
                  shop.inventory.map((thisItem) => (
                    <Box
                      key={thisItem.itemID}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 1,
                        borderRadius: 1,
                        boxShadow: "inset 0px 0px 4px rgba(0,0,0,0.1)",
                        marginY: 1,
                        bgcolor: "background.default",
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          {thisItem.itemName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {thisItem.description}
                        </Typography>
                        <Typography variant="body2">
                          Quantity: {thisItem.quantity}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="primary.main"
                          fontWeight="bold"
                        >
                          ${thisItem.unitPrice}
                        </Typography>
                      </Box>
                      {!shop.closureStatus && (
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          sx={{ ml: 2 }}
                          onClick={() => handleOpenPurchaseDialog(thisItem)}
                        >
                          Add to Cart
                        </Button>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2">
                    No inventory available
                  </Typography>
                )}
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => handleInventoryExpand(shop.shopID)}
                  sx={{ mt: 1 }}
                >
                  {showFullInventory[shop.shopID] ? "Show Less" : "Show More"}
                </Button>
              </Box>
            </CardContent>

            {shop.hasCrud === 1 && (
              <CardActions>
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEditClick(shop)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDeleteClick(shop)}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  aria-label="inventory"
                  onClick={() => handleInventoryClick(shop)}
                >
                  <InventoryIcon />
                </IconButton>
              </CardActions>
            )}
          </Card>
        ))}
      </Box>

      <GiftShopPopup
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
        message="Are you sure you want to delete this gift shop?"
      />

      {selectedGiftShop && (
        <InventoryPopup
          open={openInventoryPopup}
          onClose={() => setOpenInventoryPopup(false)}
          shopID={selectedGiftShop.shopID}
          onInventoryUpdate={handleInventoryUpdate}
        />
      )}

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

export default GiftShopsPage;
