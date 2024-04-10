import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface GiftShop {
  shopID?: number;
  areaID?: number;
  name?: string;
  description?: string;
  openingTime?: string;
  closingTime?: string;
  merchandiseType?: string;
  imageUrl?: string;
  merchlist?: { [item: string]: number };
}

interface GiftShopPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<GiftShop>) => void;
  formData: Partial<GiftShop>;
  setFormData: (formData: Partial<GiftShop>) => void;
  isEditing: boolean;
}

const GiftShopPopup: React.FC<GiftShopPopupProps> = ({
  open,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEditing,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'merchlist') {
      // Split the value by newlines and then by colons to create key-value pairs
      const items = value.split('\n').map((item) => item.split(':'));
      // Create an object from the key-value pairs
      const merchlist = items.reduce((acc, [key, val]) => {
        if (key && val) {
          acc[key.trim()] = parseInt(val.trim()) || 0;
        }
        return acc;
      }, {});
      setFormData({ ...formData, [name]: merchlist });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditing ? "Edit Gift Shop" : "Create Gift Shop"}</DialogTitle>
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
          name="name"
          label="Name"
          value={formData.name || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="areaID"
          label="Area ID"
          type="number"
          value={formData.areaID || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          multiline
          rows={4}
          fullWidth
          value={formData.description || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="openingTime"
          label="Opening Time"
          type="time"
          fullWidth
          value={formData.openingTime || ""}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          name="closingTime"
          label="Closing Time"
          type="time"
          fullWidth
          value={formData.closingTime || ""}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          name="merchandiseType"
          label="Merchandise Type"
          value={formData.merchandiseType || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          margin="dense"
          name="merchlist"
          label="Merchandise List"
          type="text"
          multiline
          rows={4}
          fullWidth
          value={formData.merchlist || ""}
          onChange={handleChange}
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

export default GiftShopPopup;
