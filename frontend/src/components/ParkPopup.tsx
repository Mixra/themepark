import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface ParkArea {
  name?: string;
  theme?: string;
  description?: string;
  openingTime?: string;
  closingTime?: string;
  imageUrl?: string;
}

interface ParkPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<ParkArea>) => void;
  formData: Partial<ParkArea>;
  setFormData: (formData: Partial<ParkArea>) => void;
  isEditing: boolean;
}

const ParkPopup: React.FC<ParkPopupProps> = ({
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
        {isEditing ? "Edit Park Area" : "Create Park Area"}
      </DialogTitle>
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
          name="theme"
          label="Theme"
          value={formData.theme || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="imageUrl"
          label="Image URL"
          value={formData.imageUrl || ""}
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

export default ParkPopup;
