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
import GiftShopPopup from "../../components/GiftShopPopup";
import DeleteConfirmationPopup from "../../components/DeleteConfirmationPopup";
import db from "../../components/db";
import { GiftShop, Inventory } from "../../models/giftshop.model";

const GiftShopsPage: React.FC = () => {
  const [giftShops, setGiftShops] = useState<GiftShop[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<GiftShop>>({});
  const [selectedGiftShop, setSelectedGiftShop] = useState<GiftShop | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  const level = Number(localStorage.getItem("level"));
  const display_CRUD = level === 999 ? true : false;

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
          hasCrud: 1,
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

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {display_CRUD && (
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
                  maxHeight: 200,
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
                    <Typography key={item.itemID} variant="body2">
                      - {item.itemName} (${item.unitPrice})
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2">
                    No inventory available
                  </Typography>
                )}
              </Box>
            </CardContent>

            {display_CRUD && (
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
        selectedGiftShop={selectedGiftShop}
      />
    </Box>
  );
};

export default GiftShopsPage;
