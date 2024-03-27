/*import React, { useState } from 'react';
import './css/GiftShops.css'; 
import Burger from '../../assets/images/BurgerSpot.jpeg';
import {GenericCard} from '../../components/Card';
import themeParkBackground from '../../assets/images/images.jpeg';
import themeParkBackgrounds from '../../assets/images/Giftshopimage2.jpeg';
//import {BaseItem} from 'frontend/interface.ts';
type GiftShop = {
  id: number;
  Name: string;
  ClosingTime: string;
  OpeningTime: string;
  Description: string;
  MerchandiseType: string[];
  imageUrl: string;
};

// Define your initial gift shops data
const initialGiftShops: GiftShop[] = [
  {
    id: 1,
    Name: 'Magic Memories',
    Description: 'Find the perfect souvenir to remember your visit to the park!',
    ClosingTime: '8:00 PM',
    OpeningTime: '10:00 AM',
    MerchandiseType: ['Apparel', 'Toys', 'Collectibles'],
    imageUrl: themeParkBackground,
  },
  {
    id: 2,
    Name: 'Wonderland Wares',
    imageUrl: themeParkBackgrounds,
    ClosingTime: '8:00 PM',
    OpeningTime: '10:00 AM',
    Description: 'Discover unique gifts and trinkets to take home with you.',
    MerchandiseType: ['Home Decor', 'Accessories', 'Books'],
  },
];

const GiftShopsPage: React.FC = () => {
  // Use useState to manage the gift shops state
  const [giftShops, setGiftShops] = useState<GiftShop[]>(initialGiftShops);

  // Handler function for deleting a gift shop
  const handleDelete = (id: number) => {
    setGiftShops(giftShops.filter(shop => shop.id !== id));
  };

  return (
    <div className="grid-container">
      {giftShops.map((shop) => (
        <GenericCard
          key={shop.id}
          item={shop}
          onDelete={() => handleDelete(shop.id)} // Pass the delete handler
        >
          <div style={{ marginTop: '10px' }}>
            <img src={shop.imageUrl} alt={shop.Name} style={{ width: '100%', height: 'auto' }} />
            <p><strong>Merchandise Type:</strong> {shop.MerchandiseType.join(', ')}</p>
          </div>
        </GenericCard>
      ))}
    </div>
  );
};

export default GiftShopsPage;
*/
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GiftShopPopup from "../../components/GiftShopPopup";
import DeleteConfirmationPopup from "../../components/DeleteConfirmationPopup";

interface GiftShop {
  shopID: number;
  areaID: number;
  name: string;
  description: string;
  openingTime: string;
  closingTime: string;
  merchandiseType: string;
  hasCrud?: boolean;
  imageUrl?: string;
}

const fakeGiftShops: GiftShop[] = [
  {
    shopID: 1,
    areaID: 1,
    name: "Adventure Gear",
    description: "Find your adventure essentials, from gear to memorabilia!",
    openingTime: "09:00",
    closingTime: "18:00",
    merchandiseType: "Adventure Gear",
    hasCrud: true,
    imageUrl: "data:image/png;base64,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"
  },
  {
    shopID: 2,
    areaID: 2,
    name: "Tomorrow's Tech",
    description: "Gadgets and gizmos of the future, available today!",
    openingTime: "10:00",
    closingTime: "20:00",
    merchandiseType: "Tech Gadgets",
    hasCrud: false,
    imageUrl: "data:image/jpeg;base64,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"
  },
  // Add more fake data as needed
];

const GiftShopsPage: React.FC = () => {
  const [giftShops, setGiftShops] = useState<GiftShop[]>(fakeGiftShops);
  const [openPopup, setOpenPopup] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<GiftShop>>({});
  const [selectedGiftShop, setSelectedGiftShop] = useState<GiftShop | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const level = Number(localStorage.getItem("level"));
  const display_crud = level === 999 ? true : false;

  const handleCreateClick = () => {
    setFormData({});
    setIsEditing(false);
    setOpenPopup(true);
  };

  const handleFormSubmit = (formData: Partial<GiftShop>) => {
    if (isEditing && selectedGiftShop) {
      const updatedGiftShops = giftShops.map((shop) =>
        shop.shopID === selectedGiftShop.shopID ? { ...shop, ...formData } : shop
      );
      setGiftShops(updatedGiftShops);
    } else {
      const newId = giftShops.length + 1;
      const newGiftShop: GiftShop = {
        shopID: newId,
        areaID: formData.areaID || 0, // Default to 0 or handle appropriately
        name: formData.name || "",
        description: formData.description || "",
        openingTime: formData.openingTime || "",
        closingTime: formData.closingTime || "",
        merchandiseType: formData.merchandiseType || "",
        hasCrud: formData.hasCrud || false,
        imageUrl: formData.imageUrl || "https://via.placeholder.com/300x200.png"
      };

      setGiftShops([...giftShops, newGiftShop]);
    }
    setOpenPopup(false);
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

  const handleDeleteConfirm = () => {
    if (selectedGiftShop) {
      const updatedGiftShops = giftShops.filter(
        (shop) => shop.shopID !== selectedGiftShop.shopID
      );
      setGiftShops(updatedGiftShops);
    }
    setOpenDeleteDialog(false);
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {display_crud && (
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
              height: 500, // Adjusted for content
              display: "flex",
              flexDirection: "column",
              }}
              >
                <img
              src={shop.imageUrl}
              alt="Shop Image"
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
              {shop.name}
              </Typography>
              <Divider sx={{ marginY: 1 }} />
              <Typography color="text.secondary" gutterBottom>
              Merchandise Type: {shop.merchandiseType}
              </Typography>
              <Box
              sx={{
              maxHeight: 120,
              overflow: "auto",
              padding: 1,
              border: "1px solid #ccc",
              borderRadius: 1,
              marginY: 1,
              }}
              >
              <Typography variant="body2">{shop.description}</Typography>
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
              Opening Time: {shop.openingTime}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
              Closing Time: {shop.closingTime}
              </Typography>
              </Box>
              </CardContent>
              {shop.hasCrud && (
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
              />
              </Box>
              );
              };
              
              export default GiftShopsPage;
