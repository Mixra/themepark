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
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import GiftShopPopup from "../../components/GiftShopPopup";
import DeleteConfirmationPopup from "../../components/DeleteConfirmationPopup";
import InventoryPopup from "../../components/InventoryPopup";
import db from "../../components/db";
import { GiftShop, Inventory } from "../../models/giftshop.model";

const GiftShopsPage: React.FC = () => {
  const [giftShops, setGiftShops] = useState<GiftShop[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openInventoryPopup, setOpenInventoryPopup] = useState(false);
  const [formData, setFormData] = useState<Partial<GiftShop>>({});
  const [selectedGiftShop, setSelectedGiftShop] = useState<GiftShop | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

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
    setShowFullInventory((prevState) => ({
      ...prevState,
      [shopID]: !prevState[shopID],
    }));
  };

  const handleAddToCart = (item: Inventory) => {
    // Functionality to be added later
    console.log("Added to cart:", item);
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
            }}
          >
            <img
              src={shop.imageURL || "https://via.placeholder.com/300x200.png"}
              alt="Gift Shop Image"
              style={{ width: "100%", objectFit: "cover", height: "150px" }}
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
              <Typography variant="h5" component="div" gutterBottom>
                {shop.shopName}
                <Chip
                  label={shop.area.areaName}
                  size="small"
                  sx={{ ml: 1, bgcolor: "primary.main", color: "white" }}
                />
              </Typography>

              <Divider sx={{ marginY: 1 }} />

              <Typography color="text.secondary" gutterBottom>
                <span style={{ fontWeight: "bold" }}>Merchandise Type:</span>{" "}
                {shop.merchandiseType}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {shop.description}
              </Typography>

              <Divider sx={{ marginY: 1 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2">
                  <span style={{ fontWeight: "bold" }}>Opening Time:</span>{" "}
                  {shop.openingTime}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  <span style={{ fontWeight: "bold" }}>Closing Time:</span>{" "}
                  {shop.closingTime}
                </Typography>
              </Box>

              <Divider sx={{ marginY: 1 }} />

              <Box
                sx={{
                  maxHeight: showFullInventory[shop.shopID] ? "auto" : 200,
                  overflow: "auto",
                  padding: 1,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  marginY: 1,
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  Inventory:
                </Typography>
                {shop.inventory?.length > 0 ? (
                  shop.inventory.map((item) => (
                    <Box
                      key={item.itemID}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginY: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="body2">{item.itemName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                        <Typography variant="body2">
                          Quantity: {item.quantity}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          ${item.unitPrice}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2">
                    No inventory available
                  </Typography>
                )}
                <Button
                  variant="text"
                  onClick={() => handleInventoryExpand(shop.shopID)}
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
    </Box>
  );
};

export default GiftShopsPage;
