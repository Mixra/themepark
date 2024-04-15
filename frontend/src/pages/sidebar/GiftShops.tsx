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
import SaveIcon from "@mui/icons-material/Save"; // For saving edited items
import CancelIcon from "@mui/icons-material/Cancel"; // For canceling an edit
import AddIcon from "@mui/icons-material/Add";
import MerchandiseEditor from "../../components/MerchandiseEditor";

interface GiftShop {
  shopID: number;
  areaID: number;
  name: string;
  description: string;
  openingTime: string;
  closingTime: string;
  merchandiseType: string;
  imageUrl?: string;
  merchlist: { [item: string]: number };
}

const fakeGiftShops: GiftShop[] = [
  {
    shopID: 1,
    areaID: 1,
    name: "Safari Gifts",
    description:
      "Find the perfect souvenir from your Safari Adventure - from plush animals to themed apparel",
    openingTime: "09:00",
    closingTime: "17:00",
    merchandiseType: "Souvenirs & Apparel",
    //hasCrud: true,
    imageUrl: "https://i.ytimg.com/vi/1OvtQiAgI58/maxresdefault.jpg",
    merchlist: {
      "T-Shirt": 10,
      Mug: 20,
      Keychain: 30,
    },
  },
  {
    shopID: 2,
    areaID: 2,
    name: "Mystic Treasures",
    description:
      "Discover enchanted gifts and mystical souvenirs that capture the magic of the Mystic Forest.",
    openingTime: "10:00",
    closingTime: "20:00",
    merchandiseType: "Magic Supplies & Novelties",
    //hasCrud: false,
    imageUrl:
      "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/magic-castle-gift-shop-denise-mazzocco.jpg",
    merchlist: {
      "T-Shirt": 10,
      Mug: 20,
      Keychain: 30,
    },
  },
  {
    shopID: 5,
    areaID: 2,
    name: "Fairy Tales & More",
    description: "Magical souvenirs to remember your enchanted visit.",
    openingTime: "10:00",
    closingTime: "20:00",
    merchandiseType: "Toys and Wands",
    //hasCrud: false,
    imageUrl:
      "https://www.pier39.com/wp-content/uploads/2021/11/Fairytales-1-Retouched.png",
    merchlist: {
      "T-Shirt": 10,
      Mug: 20,
      Keychain: 30,
    },
  },
  {
    shopID: 7,
    areaID: 4,
    name: "Dino Digs Store",
    description: "Discover prehistoric toys, games, and apparel.",
    openingTime: "08:00",
    closingTime: "18:00",
    merchandiseType: "Educational Toys and Books", //update this in the database
    //hasCrud: false,
    imageUrl:
      "https://render.fineartamerica.com/images/rendered/default/poster/8/5.5/break/images/artworkimages/medium/1/gift-shop-dinosaur-route-66-garry-gay.jpg",
    merchlist: {
      "T-Shirt": 10,
      Mug: 20,
      Keychain: 30,
    },
  },
  // Add more fake data as needed
];

const GiftShopsPage: React.FC = () => {
  const [giftShops, setGiftShops] = useState<GiftShop[]>(fakeGiftShops);
  const [openPopup, setOpenPopup] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<GiftShop>>({});
  const [openMerchPopup, setOpenMerchPopup] = useState(false); // State for merchandise editing popup
  const [selectedGiftShopForMerch, setSelectedGiftShopForMerch] =
    useState<GiftShop | null>(null); // State to store selected gift shop for merchandise editing
  const [selectedGiftShop, setSelectedGiftShop] = useState<GiftShop | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  const level = Number(localStorage.getItem("level"));
  const display_CRUD = level === 999 ? true : false;

  const handleCreateClick = () => {
    setFormData({});
    setIsEditing(false);
    setOpenPopup(true);
  };

  const handleFormSubmit = (formData: Partial<GiftShop>) => {
    if (isEditing && selectedGiftShop) {
      const updatedGiftShops = giftShops.map((shop) =>
        shop.shopID === selectedGiftShop.shopID
          ? { ...shop, ...formData }
          : shop
      );
      setGiftShops(updatedGiftShops);
    } else {
      const newId = giftShops.length + 1; // Assuming shopID is unique and incrementing
      const newGiftShop: GiftShop = {
        shopID: newId,
        areaID: formData.areaID || 0,
        name: formData.name || "",
        description: formData.description || "",
        openingTime: formData.openingTime || "",
        closingTime: formData.closingTime || "",
        merchandiseType: formData.merchandiseType || "",
        merchlist: formData.merchlist || {},
        imageUrl:
          formData.imageUrl || "https://via.placeholder.com/300x200.png",
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

  const handleMerchEditClick = (giftShop: GiftShop) => {
    setSelectedGiftShopForMerch(giftShop);
    setOpenMerchPopup(true);
  };

  const handleMerchPopupClose = () => {
    setOpenMerchPopup(false);
  };

  const handleMerchandiseSave = (updatedMerchandise: {
    [item: string]: number;
  }) => {
    if (selectedGiftShopForMerch) {
      // Update merchandise items for the selected gift shop
      const updatedGiftShops = giftShops.map((shop) =>
        shop.shopID === selectedGiftShopForMerch.shopID
          ? { ...shop, merchlist: updatedMerchandise }
          : shop
      );
      setGiftShops(updatedGiftShops);
    }
    setOpenMerchPopup(false);
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
            Create Gift Shop
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
              margin: 2,
              width: 345, // Width of the card
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <img
              src={shop.imageUrl}
              alt={shop.name}
              style={{ width: "100%", objectFit: "cover", height: "200px" }} // Height of the image
            />
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                {shop.name}
              </Typography>
              <Divider sx={{ marginY: 1 }} />
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Merchandise Type: {shop.merchandiseType}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {shop.description}
              </Typography>
              {/* Listing merchandise items and prices */}
              <ul>
                {Object.entries(shop.merchlist).map(([item, price]) => (
                  <li key={item}>{`${item}: $${price}`}</li>
                ))}
              </ul>
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
                <Button
                  variant="outlined"
                  onClick={() => handleMerchEditClick(shop)} // This line triggers merchandise editing dialog
                >
                  Edit Merchandise
                </Button>
              </CardActions>
            )}
            <MerchandiseEditor
              open={
                openMerchPopup &&
                selectedGiftShopForMerch?.shopID === shop.shopID
              }
              onClose={handleMerchPopupClose}
              initialMerchandise={shop.merchlist}
              onSave={handleMerchandiseSave}
            />
          </Card>
        ))}
      </Box>
      {/* Popup for editing and adding new gift shop */}
      <GiftShopPopup
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        onSubmit={handleFormSubmit}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />
      {/* Confirmation dialog for deleting a gift shop */}
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
