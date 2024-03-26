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
  },
  {
    shopID: 2,
    areaID: 2,
    name: "Tomorrow's Tech",
    description: "Gadgets and gizmos of the future, available today!",
    openingTime: "10:00",
    closingTime: "20:00",
    merchandiseType: "Tech Gadgets",
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
              {display_crud && (
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
