import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";

interface MenuPopupProps {
  open: boolean;
  onClose: () => void;
  menuItems: string[]; // Define the type of menuItems
  onSave: (menuItems: string[]) => void;
}

const MenuPopup: React.FC<MenuPopupProps> = ({
  open,
  onClose,
  menuItems: initialMenuItems,
  onSave,
}) => {
  const [editedMenuItems, setEditedMenuItems] = useState<string[]>([]);
  
  useEffect(() => {
    setEditedMenuItems(initialMenuItems);
  }, [initialMenuItems]);

  const handleAddMenuItem = () => {
    setEditedMenuItems([...editedMenuItems, ""]);
  };

  const handleMenuChange = (index: number, value: string) => {
    const updatedMenuItems = [...editedMenuItems];
    updatedMenuItems[index] = value;
    setEditedMenuItems(updatedMenuItems);
  };

  const handleDeleteMenuItem = (index: number) => {
    const updatedMenuItems = [...editedMenuItems];
    updatedMenuItems.splice(index, 1);
    setEditedMenuItems(updatedMenuItems);
  };

  const handleSave = () => {
    onSave(editedMenuItems);
    onClose();
  };

  const handleClose = () => {
    onClose();
    setEditedMenuItems(initialMenuItems); // Reset editedMenuItems to initialMenuItems when closing without saving
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Typography variant="h6">Menu Items:</Typography>
        {editedMenuItems.map((menuItem, index) => (
          <div key={index}>
            <TextField
              fullWidth
              label={`Menu Item ${index + 1}`}
              value={menuItem}
              onChange={(e) => handleMenuChange(index, e.target.value)}
            />
            <Button onClick={() => handleDeleteMenuItem(index)}>Delete</Button>
          </div>
        ))}
        <Button onClick={handleAddMenuItem}>Add Menu Item</Button>
      </DialogContent>
      <div style={{ padding: 20 }}>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </div>
    </Dialog>
  );
};

export default MenuPopup;
