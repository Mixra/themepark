import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface Restaurant {
  RestaurantID?: number;
  AreaID?: number;
  Name?: string;
  CuisineType?: string;
  OpeningTime?: string;
  ClosingTime?: string;
  MenuDescription?: string;
  SeatingCapacity?: number;
  imageUrl?: string;
  Menulist?: string[];
}

interface RestaurantPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<Restaurant>) => void;
  formData: Partial<Restaurant>;
  setFormData: (formData: Partial<Restaurant>) => void;
  isEditing: boolean;
}

const RestaurantPopup: React.FC<RestaurantPopupProps> = ({
  open,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEditing,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) || 0 });
  };

  const handleMenuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const menuItems = e.target.value.split(',').map(item => item.trim());
    setFormData({ ...formData, Menulist: menuItems });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditing ? "Edit Restaurant" : "Create Restaurant"}</DialogTitle>
      <DialogContent>
      <TextField
          name="imageUrl"
          label="Image URL"
          value={formData.imageUrl || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="Name"
          label="Name"
          value={formData.Name || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
         <TextField
          name="areaID"
          label="Area ID"
          type="number"
          value={formData.AreaID || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="CuisineType"
          label="Cuisine Type"
          value={formData.CuisineType || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="MenuDescription"
          label="Menu Description"
          value={formData.MenuDescription || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          name="SeatingCapacity"
          label="Seating Capacity"
          type="number"
          value={formData.SeatingCapacity || ""}
          onChange={handleNumberChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="OpeningTime"
          label="Opening Time"
          type="time"
          value={formData.OpeningTime || ""}
          onChange={handleChange}
          fullWidth
          margin="dense"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          name="ClosingTime"
          label="Closing Time"
          type="time"
          value={formData.ClosingTime || ""}
          onChange={handleChange}
          fullWidth
          margin="dense"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          name="Menulist"
          label="Menu Items (separated by commas)"
          value={formData.Menulist ? formData.Menulist.join(", ") : ""}
          onChange={handleMenuChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {isEditing ? "Save" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestaurantPopup;
