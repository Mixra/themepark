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
    name: "Safari Gifts",
    description: "Find the perfect souvenir from your Safari Adventure - from plush animals to themed apparel",
    openingTime: "09:00",
    closingTime: "17:00",
    merchandiseType: "Souvenirs & Apparel",
    hasCrud: true,
    imageUrl: "https://i.ytimg.com/vi/1OvtQiAgI58/maxresdefault.jpg"
  },
  {
    shopID: 2,
    areaID: 2,
    name: "Mystic Treasures",
    description: "Discover enchanted gifts and mystical souvenirs that capture the magic of the Mystic Forest.",
    openingTime: "10:00",
    closingTime: "20:00",
    merchandiseType: "Magic Supplies & Novelties",
    hasCrud: false,
    imageUrl: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/magic-castle-gift-shop-denise-mazzocco.jpg"
  },
  {
    shopID: 5,
    areaID: 2,
    name: "Fairy Tales & More",
    description: "Magical souvenirs to remember your enchanted visit.",
    openingTime: "10:00",
    closingTime: "20:00",
    merchandiseType: "Toys and Wands",
    hasCrud: false,
    imageUrl: "https://www.pier39.com/wp-content/uploads/2021/11/Fairytales-1-Retouched.png"
  },
  {
    shopID: 7,
    areaID: 4,
    name: "Dino Digs Store",
    description: "Discover prehistoric toys, games, and apparel.",
    openingTime: "08:00",
    closingTime: "18:00",
    merchandiseType: "Educational Toys and Books",//update this in the database
    hasCrud: false,
    imageUrl: "https://render.fineartamerica.com/images/rendered/default/poster/8/5.5/break/images/artworkimages/medium/1/gift-shop-dinosaur-route-66-garry-gay.jpg"
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
