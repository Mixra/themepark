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
    if (name === "merchlist") {
      // Convert string to merchlist object
      const items = value.split("\n").map((item) => item.split(":"));
      const merchlist = items.reduce((acc, [key, val]) => {
        if (key && val) {
          acc[key.trim()] = parseInt(val.trim(), 10) || 0;
        }
        return acc;
      }, {} as { [item: string]: number });
      setFormData({ ...formData, [name]: merchlist });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Function to convert the merchlist object to a string for the TextField
  const merchlistToString = (merchlist?: { [item: string]: number }) => {
    return merchlist
      ? Object.entries(merchlist)
          .map(([item, price]) => `${item}: ${price}`)
          .join("\n")
      : "";
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {isEditing ? "Edit Gift Shop" : "Create Gift Shop"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Name"
          type="text"
          fullWidth
          value={formData.name || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={formData.description || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="areaID"
          label="Area ID"
          type="number"
          fullWidth
          value={formData.areaID || ""}
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
          margin="dense"
          name="merchandiseType"
          label="Merchandise Type"
          type="text"
          fullWidth
          value={formData.merchandiseType || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="imageUrl"
          label="Image URL"
          type="text"
          fullWidth
          value={formData.imageUrl || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="merchlist"
          label="Merchandise List (item: price)"
          helperText="Enter each item on a new line in the format: item: price"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={merchlistToString(formData.merchlist)}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {isEditing ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GiftShopPopup;
