import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Snackbar,
  Alert,
  Slide,
  SlideProps,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import db from "./db";
import { MenuListItem as MenuItemModel } from "../models/restaurant.model";

interface MenuPopupProps {
  open: boolean;
  onClose: () => void;
  restaurantId: number;
  initialMenuItems: MenuItemModel[];
  onMenuItemsUpdated: (updatedMenuItems: MenuItemModel[]) => void;
}

const MenuPopup: React.FC<MenuPopupProps> = ({
  open,
  onClose,
  restaurantId,
  initialMenuItems,
  onMenuItemsUpdated,
}) => {
  const [editedMenuItems, setEditedMenuItems] = useState<MenuItemModel[]>([]);
  const [newMenuItemName, setNewMenuItemName] = useState("");
  const [newMenuItemPrice, setNewMenuItemPrice] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    setEditedMenuItems(initialMenuItems);
  }, [initialMenuItems]);

  const handleAddMenuItem = async () => {
    if (newMenuItemName.trim() && newMenuItemPrice > 0) {
      try {
        const newMenuItem: Omit<MenuItemModel, "itemID"> = {
          itemName: newMenuItemName.trim(),
          price: newMenuItemPrice,
        };
        const response = await db.post(
          `/restaurant/${restaurantId}/menu`,
          newMenuItem
        );
        const newMenuItemWithID: MenuItemModel = {
          itemID: response.data.itemID,
          itemName: newMenuItem.itemName,
          price: newMenuItem.price,
        };
        setEditedMenuItems([...editedMenuItems, newMenuItemWithID]);
        onMenuItemsUpdated([...editedMenuItems, newMenuItemWithID]);
        setNewMenuItemName("");
        setNewMenuItemPrice(0);
        setSnackbarMessage("Menu item added successfully");
        setShowSnackbar(true);
      } catch (error) {
        console.error("Error adding menu item:", error);
        setSnackbarMessage("Error adding menu item");
        setShowSnackbar(true);
      }
    }
  };

  const handleMenuItemChange = (
    index: number,
    field: keyof MenuItemModel,
    value: string | number
  ) => {
    const updatedMenuItems = [...editedMenuItems];
    if (field === "itemName") {
      updatedMenuItems[index].itemName = value as string;
    } else if (field === "price") {
      updatedMenuItems[index].price = value as number;
    }
    setEditedMenuItems(updatedMenuItems);
  };

  const handleDeleteMenuItem = async (menuItem: MenuItemModel) => {
    try {
      await db.delete(`/restaurant/${restaurantId}/menu/${menuItem.itemID}`);
      const updatedMenuItems = editedMenuItems.filter(
        (item) => item.itemID !== menuItem.itemID
      );
      setEditedMenuItems(updatedMenuItems);
      onMenuItemsUpdated(updatedMenuItems);
      setSnackbarMessage("Menu item deleted successfully");
      setShowSnackbar(true);
    } catch (error) {
      console.error("Error deleting menu item:", error);
      setSnackbarMessage("Error deleting menu item");
      setShowSnackbar(true);
    }
  };

  const handleSaveMenuItem = async (menuItem: MenuItemModel) => {
    try {
      await db.put(
        `/restaurant/${restaurantId}/menu/${menuItem.itemID}`,
        menuItem
      );
      const updatedMenuItems = editedMenuItems.map((item) =>
        item.itemID === menuItem.itemID ? menuItem : item
      );
      setEditedMenuItems(updatedMenuItems);
      onMenuItemsUpdated(updatedMenuItems);
      setSnackbarMessage("Menu item updated successfully");
      setShowSnackbar(true);
    } catch (error) {
      console.error("Error saving menu item:", error);
      setSnackbarMessage("Error saving menu item");
      setShowSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const snackbarTransition = (props: SlideProps) => (
    <Slide {...props} direction="up" />
  );

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Menu Items
          </Typography>
          {editedMenuItems.map((menuItem, index) => (
            <Box
              key={menuItem.itemID}
              display="flex"
              alignItems="center"
              marginY={1}
            >
              <TextField
                label="Name"
                value={menuItem.itemName || ""}
                onChange={(e) =>
                  handleMenuItemChange(index, "itemName", e.target.value)
                }
                margin="dense"
                style={{ flexGrow: 1 }}
              />
              <TextField
                label="Price"
                type="number"
                value={menuItem.price || 0}
                onChange={(e) =>
                  handleMenuItemChange(
                    index,
                    "price",
                    parseFloat(e.target.value)
                  )
                }
                margin="dense"
                style={{ marginLeft: 8, width: 100 }}
              />
              <IconButton
                onClick={() => handleSaveMenuItem(menuItem)}
                style={{ marginLeft: 8 }}
              >
                <SaveIcon />
              </IconButton>
              <IconButton
                onClick={() => handleDeleteMenuItem(menuItem)}
                style={{ marginLeft: 8 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </DialogContent>
        <Box display="flex" justifyContent="space-between" padding={2}>
          <Box display="flex" alignItems="center">
            <TextField
              label="Item Name"
              value={newMenuItemName}
              onChange={(e) => setNewMenuItemName(e.target.value)}
              margin="dense"
              style={{ flexGrow: 1 }}
            />
            <TextField
              label="Price"
              type="number"
              value={newMenuItemPrice}
              onChange={(e) => setNewMenuItemPrice(parseFloat(e.target.value))}
              margin="dense"
              style={{ marginLeft: 8, width: 100 }}
            />
            <Button
              variant="contained"
              onClick={handleAddMenuItem}
              style={{ marginLeft: 8 }}
            >
              Add
            </Button>
          </Box>
          <Button onClick={onClose}>Close</Button>
        </Box>
      </Dialog>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        TransitionComponent={snackbarTransition}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarMessage.includes("Error") ? "error" : "success"}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MenuPopup;
