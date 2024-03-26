import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

// Adjusting the interface for GiftShop attributes
interface GiftShop {
  shopID?: number;
  areaID?: number;
  name?: string;
  description?: string;
  openingTime?: string;
  closingTime?: string;
  merchandiseType?: string;
}

// Updating the Props interface to use GiftShop instead of ParkArea
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
