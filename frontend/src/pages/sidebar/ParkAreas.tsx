import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ParkPopup from "../../components/ParkPopup";
import DeleteConfirmationPopup from "../../components/DeleteConfirmationPopup";

interface ParkArea {
  imageUrl: string | undefined;
  id: number;
  name: string;
  theme: string;
  description: string;
  openingTime: string;
  closingTime: string;
  list_of_rides: string[];
}

const fakeParkAreas: ParkArea[] = [
  {
    id: 1,
    name: "Adventureland",
    theme: "Adventure",
    description:
      "Explore exotic lands and thrilling adventures! Explore exotic lands and thrilling adventures! Explore exotic lands and thrilling adventures! Explore exotic lands and thrilling adventures! Explore exotic lands and thrilling adventures!",
    openingTime: "09:00",
    closingTime: "18:00",
    list_of_rides: ["Jungle Cruise", "Indiana Jones Adventure", "Dinosaur"],
    imageUrl:
      "https://cloudfront-us-east-1.images.arcpublishing.com/gmg/B6ELKWZZT5HIHJY6V7AH3ZVSGI.jpg",
  },
  {
    id: 2,
    name: "FantasyLand",
    theme: "Fantasy",
    description:
      "Step into a world of enchantment and fairy tales!",
    openingTime: "08:30",
    closingTime: "22:00",
    list_of_rides: ["Fill with Rides in Database"],
    imageUrl:
      "https://farm66.static.flickr.com/65535/52151137553_be9f29c533_b.jpg",
  },
  {
    id: 3,
    name: "Tomorrowland",
    theme: "Futuristic",
    description:
      "Step into the exciting world of the future! Step into the exciting world of the future! Step into the exciting world of the future! Step into the exciting world of the future! Step into the exciting world of the future!",
    openingTime: "10:00",
    closingTime: "20:00",
    list_of_rides: ["Space Mountain", "Buzz Lightyear Astro Blasters"],
    imageUrl:
      "https://i.pinimg.com/550x/65/bf/1d/65bf1d708f7df38bd1d46e636a7ee1c3.jpg",
  },
  {
    id: 4,
    name: "FrontierLand",
    theme: "Western",
    description:
      "Discover the rugged wilderness of the Old West",
    openingTime: "09:30",
    closingTime: "19:00",
    list_of_rides: ["Add rides in database"],
    imageUrl:
      "https://st.depositphotos.com/1679308/1352/i/450/depositphotos_13523937-stock-photo-saloon-in-the-frontierland.jpg",
  },
  // Add more fake data as needed
];

const ParkAreaPage: React.FC = () => {
  const [parkAreas, setParkAreas] = useState<ParkArea[]>(fakeParkAreas);
  const [openPopup, setOpenPopup] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<ParkArea>>({});
  const [selectedParkArea, setSelectedParkArea] = useState<ParkArea | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  const level = Number(localStorage.getItem("level"));
  const display_crud = level === 999 ? true : false;

  const handleCreateClick = () => {
    setFormData({});
    setIsEditing(false);
    setOpenPopup(true);
  };

  const handleFormSubmit = (formData: Partial<ParkArea>) => {
    if (isEditing && selectedParkArea) {
      const updatedParkAreas = parkAreas.map((area) =>
        area.id === selectedParkArea.id ? { ...area, ...formData } : area
      );
      setParkAreas(updatedParkAreas);
    } else {
      // Generate a new ID for the new park area
      const newId = parkAreas.length + 1;

      // Create a new park area object with the form data and the new ID
      const newParkArea: ParkArea = {
        id: newId,
        name: formData.name || "",
        theme: formData.theme || "",
        description: formData.description || "",
        openingTime: formData.openingTime || "",
        closingTime: formData.closingTime || "",
        list_of_rides: [],
        imageUrl: formData.imageUrl || "https://via.placeholder.com/150",
      };

      setParkAreas([...parkAreas, newParkArea]);
    }
    setOpenPopup(false);
  };

  const handleEditClick = (parkArea: ParkArea) => {
    setFormData(parkArea);
    setSelectedParkArea(parkArea);
    setIsEditing(true);
    setOpenPopup(true);
  };

  const handleDeleteClick = (parkArea: ParkArea) => {
    setSelectedParkArea(parkArea);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedParkArea) {
      const updatedParkAreas = parkAreas.filter(
        (area) => area.id !== selectedParkArea.id
      );
      setParkAreas(updatedParkAreas);
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
        {parkAreas.map((area) => (
          <Card
            key={area.id}
            sx={{
              margin: 1,
              width: 300,
              height: 660,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={area.imageUrl}
              alt="Park Area"
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
                {area.name}
              </Typography>
              <Divider sx={{ marginY: 1 }} />
              <Typography color="text.secondary" gutterBottom>
                {area.theme}
              </Typography>
              <Box
                sx={{
                  maxHeight: 120,
                  minHeight: 120,
                  overflow: "auto",
                  padding: 1,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2">{area.description}</Typography>
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
                  Opening Time: {area.openingTime}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  Closing Time: {area.closingTime}
                </Typography>
              </Box>
              <Divider sx={{ marginY: 1 }} />
              <Box
                sx={{
                  maxHeight: 140,
                  minHeight: 140,
                  overflow: "auto",
                  padding: 1,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                }}
              >
                <List dense>
                  {area.list_of_rides.map((ride, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={ride} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
            {display_crud && (
              <CardActions>
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEditClick(area)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDeleteClick(area)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            )}
          </Card>
        ))}
      </Box>
      <ParkPopup
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

export default ParkAreaPage;
