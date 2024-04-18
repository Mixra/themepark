import React, { useState, useEffect } from "react";
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
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ParkPopup from "../../components/ParkPopup";
import DeleteConfirmationPopup from "../../components/DeleteConfirmationPopup";
import db from "../../components/db";
import { ParkArea } from "../../models/park.model";

const ParkAreaPage: React.FC = () => {
  const [parkAreas, setParkAreas] = useState<ParkArea[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedParkArea, setSelectedParkArea] = useState<ParkArea | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  const level = Number(localStorage.getItem("level"));
  const display_crud = level === 999 ? true : false;

  useEffect(() => {
    fetchParkAreas();
  }, []);

  const fetchParkAreas = async () => {
    try {
      const response = await db.get("/view/areas");
      const data = response.data;
      setParkAreas(data);
    } catch (error) {
      console.error("Error fetching park areas:", error);
    }
  };

  const fixTime = (time: string) => {
    const [hour, minute] = time.split(":");
    return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`;
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);
    date.setMilliseconds(0);

    const period = date.getHours() < 12 ? "AM" : "PM";
    const formattedHours = (((date.getHours() + 11) % 12) + 1).toString();
    const formattedMinutes = date.getMinutes().toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  const handleCreateClick = () => {
    setSelectedParkArea(null);
    setIsEditing(false);
    setOpenPopup(true);
  };

  const handleFormSubmit = async (formData: Partial<ParkArea>) => {
    try {
      formData.openingTime = fixTime(formData.openingTime as string);
      formData.closingTime = fixTime(formData.closingTime as string);
      if (isEditing && selectedParkArea) {
        const updatedParkArea = { ...selectedParkArea, ...formData };
        await db.put("/edit/areas", updatedParkArea);
        setParkAreas((prevParkAreas) =>
          prevParkAreas.map((area) =>
            area.areaID === selectedParkArea.areaID ? updatedParkArea : area
          )
        );
      } else {
        const response = await db.post("/create/areas", formData);
        const newParkArea = {
          ...formData,
          areaID: response.data.areaID,
        } as ParkArea;
        setParkAreas((prevParkAreas) => [...prevParkAreas, newParkArea]);
      }
      setOpenPopup(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEditClick = (parkArea: ParkArea) => {
    setSelectedParkArea(parkArea);
    setIsEditing(true);
    setOpenPopup(true);
  };

  const handleDeleteClick = (parkArea: ParkArea) => {
    setSelectedParkArea(parkArea);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedParkArea) {
        await db.delete(`/delete/areas/${selectedParkArea.areaID}`);
        setParkAreas((prevParkAreas) =>
          prevParkAreas.filter(
            (area) => area.areaID !== selectedParkArea.areaID
          )
        );
      }
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting park area:", error);
    }
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
            key={area.areaID}
            sx={{
              margin: 1,
              width: 300,
              height: 800,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={
                area.imageUrl
                  ? area.imageUrl
                  : "https://via.placeholder.com/150"
              }
              alt="Park Area"
              style={{ width: "100%", objectFit: "cover", height: "150px" }}
            />
            <CardContent sx={{ overflowY: "auto", padding: 1, flexGrow: 1 }}>
              <Typography variant="h5" component="div" gutterBottom>
                {area.areaName}
              </Typography>
              <Divider
                sx={{ marginY: 1, borderColor: "black", borderWidth: 2 }}
              />
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
                <Typography variant="body2" fontWeight="bold">
                  Opening Time:
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="white">
                  {formatTime(area.openingTime)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  Closing Time:
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="white">
                  {formatTime(area.closingTime)}
                </Typography>
              </Box>
              <Divider
                sx={{ marginY: 1, borderColor: "black", borderWidth: 2 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Rides
                  </Typography>
                  <Box
                    sx={{
                      maxHeight: 100,
                      minHeight: 100,
                      overflow: "auto",
                      padding: 1,
                      border: "1px solid #ccc",
                      borderRadius: 1,
                    }}
                  >
                    <List dense>
                      {area.rides ? (
                        area.rides.map((ride, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={ride.rideName} />
                          </ListItem>
                        ))
                      ) : (
                        <ListItem>
                          <ListItemText primary="No rides available" />
                        </ListItem>
                      )}
                    </List>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Gift Shops
                  </Typography>
                  <Box
                    sx={{
                      maxHeight: 100,
                      minHeight: 100,
                      overflow: "auto",
                      padding: 1,
                      border: "1px solid #ccc",
                      borderRadius: 1,
                    }}
                  >
                    <List dense>
                      {area.giftShops ? (
                        area.giftShops.map((shop, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={shop.shopName} />
                          </ListItem>
                        ))
                      ) : (
                        <ListItem>
                          <ListItemText primary="No gift shops available" />
                        </ListItem>
                      )}
                    </List>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Restaurants
                  </Typography>
                  <Box
                    sx={{
                      maxHeight: 100,
                      minHeight: 100,
                      overflow: "auto",
                      padding: 1,
                      border: "1px solid #ccc",
                      borderRadius: 1,
                    }}
                  >
                    <List dense>
                      {area.restaurants ? (
                        area.restaurants.map((restaurant, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={restaurant.restaurantName} />
                          </ListItem>
                        ))
                      ) : (
                        <ListItem>
                          <ListItemText primary="No restaurants available" />
                        </ListItem>
                      )}
                    </List>
                  </Box>
                </Grid>
              </Grid>
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
        selectedParkArea={selectedParkArea}
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
