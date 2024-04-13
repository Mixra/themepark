import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface Rides {
  name?: string;
  areaID?: number;
  description?: string;
  openingTime?: string;
  closingTime?: string;
  imageUrl?: string;
  type?: string;
  minHeight?: number,
  maxCapacity?: number;
  duration?: number;
  price?:number;
}

interface RidesPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<Rides>) => void;
  formData: Partial<Rides>;
  setFormData: (formData: Partial<Rides>) => void;
  isEditing: boolean;
}

const RidesPopup: React.FC<RidesPopupProps> = ({
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
      <DialogTitle>
        {isEditing ? "Edit Rides" : "Create Rides"}
      </DialogTitle>
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
          name="type"
          label="Type"
          value={formData.type || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="minHeight"
          label="Minimum Height Required"
          value={formData.minHeight || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="max Seating"
          label="Maximum seating on ride"
          value={formData.maxCapacity || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="duration"
          label="Duration of the ride"
          value={formData.duration || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="price"
          label="Price"
          value={formData.price || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          margin="dense"
          id="description"
          label="Description"
          type="text"
          multiline
          rows={4}
          fullWidth
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <TextField
          margin="dense"
          id="openingTime"
          label="Opening Time"
          type="time"
          fullWidth
          value={formData.openingTime || ""}
          onChange={(e) =>
            setFormData({ ...formData, openingTime: e.target.value })
          }
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          id="closingTime"
          label="Closing Time"
          type="time"
          fullWidth
          value={formData.closingTime || ""}
          onChange={(e) =>
            setFormData({ ...formData, closingTime: e.target.value })
          }
          InputLabelProps={{
            shrink: true,
          }}
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

export default RidesPopup;
