/*import React, { useState } from 'react';
import './css/GiftShops.css'; 
import Burger from '../../assets/images/BurgerSpot.jpeg';
import {GenericCard} from '../../components/Card';
import ButtonComponent from '../../components/ButtonComponent';
import './css/Restauraunt.css';
type Restaurant = {
  id: number;
  Name: string;
  imageUrl: string;
  ClosingTime: string;
  OpeningTime: string;
  SeatingCapacity: number;
  Description: string;
  Menu: {
    Name: string;
    Description: string;
    Price: number;
    Category: string;
  }[];
};

// Assuming initialRestaurants is your initial data array
const initialRestaurants: Restaurant[] = [
  {
    id: 1,
    Name: 'Fat Burger',
    imageUrl: Burger,
    ClosingTime: '10:00 PM',
    OpeningTime: '8:00 AM',
    SeatingCapacity: 100,
    Description: 'Fat Burger, known for its juicy oversized burgers, offering a fun and flavorful escape for thrill-seekers and food lovers alike.',
    Menu: [
      {
        Name: 'Colossal Coaster Burger',
        Description: 'A towering feast featuring a trio of beef patties, layered with crispy bacon, cheddar cheese, onion rings, and a special coaster sauce, served on a toasted sesame bun.',
        Price: 12.99,
        Category: 'Main Course',
      },
      // Add more menu items as needed
    ],
  },
  {
    id: 2,
    Name: 'Fat Burger',
    imageUrl: Burger,
    ClosingTime: '10:00 PM',
    OpeningTime: '8:00 AM',
    SeatingCapacity: 100,
    Description: 'Fat Burger, known for its juicy oversized burgers, offering a fun and flavorful escape for thrill-seekers and food lovers alike.',
    Menu: [
      {
        Name: 'Colossal Coaster Burger',
        Description: 'A towering feast featuring a trio of beef patties, layered with crispy bacon, cheddar cheese, onion rings, and a special coaster sauce, served on a toasted sesame bun.',
        Price: 12.99,
        Category: 'Main Course',
      },
      // Add more menu items as needed
    ],
  },
  // Add more restaurants as needed
];
const handleCreateCard = () => {}
const RestaurantsPage: React.FC = () => {
  // Use useState to manage the restaurants state
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);

  // Handler function for deleting a restaurant
  const handleDelete = (id: number) => {
    setRestaurants(restaurants.filter(restaurant => restaurant.id !== id));
  };

  return (
    <div className="grid-container">
      {restaurants.map((restaurant) => (
        <GenericCard 
          key={restaurant.id} 
          item={restaurant} 
          onDelete={() => handleDelete(restaurant.id)} // Pass the delete handler
        >
          <div style={{ marginTop: '100px' }}>
            <img src={restaurant.imageUrl} alt={restaurant.Name} style={{ width: '100%', height: 'auto' }} />
          </div>
          <div>
            <p><strong>Opening Time:</strong> {restaurant.OpeningTime}</p>
            <p><strong>Closing Time:</strong> {restaurant.ClosingTime}</p>
            <p><strong>Seating Capacity:</strong> {restaurant.SeatingCapacity}</p>
            {restaurant.Menu.map((menu, index) => (
              <div key={index}>
                <p><strong>Menu Item:</strong> {menu.Name}</p>
                <p><strong>Description:</strong> {menu.Description}</p>
                <p><strong>Price:</strong> {menu.Price}</p>
                <p><strong>Category:</strong> {menu.Category}</p>
              </div>
            ))}
          </div>
        </GenericCard>
      ))}
   {}
   <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <ButtonComponent variant="contained" color="primary" size="small" onClick={handleCreateCard}>
          Create
        </ButtonComponent>
      </div>
    </div>
  );
};
export default RestaurantsPage;
*/
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
import RestaurantPopup from "../../components/RestaurantsPopup";
import DeleteConfirmationPopup from "../../components/DeleteConfirmationPopup";

interface Restaurant {
  RestaurantID: number;
  AreaID: number;
  Name: string;
  CuisineType: string;
  OpeningTime: string;
  ClosingTime: string;
  MenuDescription: string;
  SeatingCapacity: number;
  //hasCrud?: boolean;
  imageUrl?: string;
  Menulist: string[];
}

const fakeRestaurants: Restaurant[] = [
  // Add some fake data here for demonstration purposes
  {
    RestaurantID: 1,
    AreaID: 1, // Assuming this corresponds to an existing park area
    Name: "The Explorers Eatery",
    CuisineType: "International",
    OpeningTime: "10:00",
    ClosingTime: "22:00",
    MenuDescription: "A culinary journey around the globe, featuring dishes from various countries.",
    SeatingCapacity: 100,
    //hasCrud: true,
    Menulist:["Blood Pudding"],
    imageUrl: "https://4.bp.blogspot.com/-VLzbxqBg9aI/XJtFo_RQJEI/AAAAAAABmFg/w27B82VpVNsuua7iUdEzZ1Q1I4Xw7zJUACLcBGAs/s1600/2016-12-08_0312.jpg", // Placeholder image URL
  },
  {
    RestaurantID: 2,
    AreaID: 2, // Assuming this corresponds to an existing park area
    Name: "Pirate Cove Cafe",
    CuisineType: "Seafood",
    OpeningTime: "11:00",
    ClosingTime: "21:00",
    MenuDescription: "Fresh seafood and pirate-themed delights in a nautical setting.",
    SeatingCapacity: 80,
    //hasCrud: false,
    Menulist: ["Coconut Curry"],
    imageUrl: "https://blog.discoveruniversal.com/wp-content/uploads/2023/06/Lombards-Seafood-Grille-full-scope.jpg"
  },
  {
    RestaurantID: 3,
    AreaID: 3, // Assuming this corresponds to an existing park area
    Name: "Frosty Treats",
    CuisineType: "Desserts",
    OpeningTime: "12:00",
    ClosingTime: "20:00",
    MenuDescription: "Cool off with our assortment of ice creams, sundaes, and frozen delights.",
    SeatingCapacity: 50,
    //hasCrud: false,
    Menulist:["Bannana Split"],
    imageUrl: "https://cdn1.parksmedia.wdprapps.disney.com/media/blog/wp-content/uploads/2016/07/DLICM499875.jpg"
  },
  {
    RestaurantID: 6,
    AreaID: 6, // Assuming this corresponds to an existing park area
    Name: "Wild West BBQ and Grill",
    CuisineType: "Barbecue",
    OpeningTime: "11:00",
    ClosingTime: "20:00",
    MenuDescription: "Hearty barbecue favorites with a western spin.",
    SeatingCapacity: 130,
    //hasCrud: false,
    Menulist: ["Texas Toast"],
    imageUrl: "https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/1920/1080/75/dam/wdpro-assets/gallery/dining/downtown-disney/smokehouse/smokehouse-gallery00.jpg?1692734886976"
  },
  // Add more fake restaurants as needed
];

const RestaurantsPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(fakeRestaurants);
  const [openPopup, setOpenPopup] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Restaurant>>({});
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const level = Number(localStorage.getItem("level"));
  const displayCrud = level === 999 ? true : false;

  const handleCreateClick = () => {
    setFormData({});
    setIsEditing(false);
    setOpenPopup(true);
  };

  const handleFormSubmit = (formData: Partial<Restaurant>) => {
    if (isEditing && selectedRestaurant) {
      const updatedRestaurants = restaurants.map((restaurant) =>
        restaurant.RestaurantID === selectedRestaurant.RestaurantID ? { ...restaurant, ...formData } : restaurant
      );
      setRestaurants(updatedRestaurants);
    } else {
      const newId = Math.max(...restaurants.map(r => r.RestaurantID)) + 1; // Simplistic approach to generate a new ID

      const newRestaurant: Restaurant = {
        RestaurantID: newId,
        AreaID: formData.AreaID || 0, // Defaulting to 0 if not specified
        Name: formData.Name || "",
        CuisineType: formData.CuisineType || "",
        OpeningTime: formData.OpeningTime || "",
        ClosingTime: formData.ClosingTime || "",
        MenuDescription: formData.MenuDescription || "",
        SeatingCapacity: formData.SeatingCapacity || 0,
        Menulist: formData.Menulist ||[""],
        imageUrl: formData.imageUrl || "https://via.placeholder.com/150",
      };

      setRestaurants([...restaurants, newRestaurant]);
    }
    setOpenPopup(false);
  };

  const handleEditClick = (restaurant: Restaurant) => {
    setFormData(restaurant);
    setSelectedRestaurant(restaurant);
    setIsEditing(true);
    setOpenPopup(true);
  };

  const handleDeleteClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedRestaurant) {
      const updatedRestaurants = restaurants.filter(
        (restaurant) => restaurant.RestaurantID !== selectedRestaurant.RestaurantID
      );
      setRestaurants(updatedRestaurants);
    }
    setOpenDeleteDialog(false);
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {displayCrud && (
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
        {restaurants.map((restaurant) => (
          <Card
            key={restaurant.RestaurantID}
            sx={{
              margin: 1,
              width: 300,
              height: 660, // Adjust height as needed
              display: "flex",
              flexDirection: "column",
           
            }}
            >
              <img
              src={restaurant.imageUrl}
              alt="Restaurant Image"
              style={{ width: "100%", objectFit: "cover", height: "150px" }}
            />
              <CardContent
                sx={{
                  flexGrow: 1,
                  padding: 2,
                }}
              >
                <Typography variant="h5" component="div" gutterBottom>
                  {restaurant.Name}
                </Typography>
                <Divider sx={{ marginY: 1 }} />
                <Typography color="text.secondary" gutterBottom>
                  Cuisine: {restaurant.CuisineType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Seating Capacity: {restaurant.SeatingCapacity}
                </Typography>
                <Divider sx={{ marginY: 1 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    Opening Time: {restaurant.OpeningTime}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    Closing Time: {restaurant.ClosingTime}
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
                  <Typography variant="body2">{restaurant.MenuDescription}</Typography>
                </Box>
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
                <Typography variant="body2">Menu:</Typography>
                {restaurant.Menulist.map((menuItem, index) => (
                  <Typography key={index} variant="body2">
                    - {menuItem}
                  </Typography>
                ))}
              </Box>
              </CardContent>
              {displayCrud && (
                <CardActions>
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleEditClick(restaurant)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteClick(restaurant)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              )}
            </Card>
          ))}
        </Box>
        <RestaurantPopup
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

export default RestaurantsPage;