import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { ParkArea } from "../models/park.model";

interface ParkPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<ParkArea>) => void;
  selectedParkArea: ParkArea | null;
  isEditing: boolean;
}

const ParkPopup: React.FC<ParkPopupProps> = ({
  open,
  onClose,
  onSubmit,
  selectedParkArea,
  isEditing,
}) => {
  const [formData, setFormData] = useState<Partial<ParkArea>>({});

  useEffect(() => {
    if (selectedParkArea) {
      setFormData(selectedParkArea);
    } else {
      setFormData({});
    }
  }, [selectedParkArea]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {isEditing ? "Edit Park Area" : "Create Park Area"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            margin="dense"
            name="imageUrl"
            label="Image URL"
            type="text"
            required
            fullWidth
            value={formData.imageUrl || ""}
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            name="areaName"
            label="Area Name"
            type="text"
            required
            fullWidth
            value={formData.areaName || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="theme"
            label="Theme"
            type="text"
            required
            fullWidth
            value={formData.theme || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            required
            fullWidth
            multiline
            rows={4}
            value={formData.description || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="openingTime"
            label="Opening Time"
            type="time"
            fullWidth
            required
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
            required
            fullWidth
            value={formData.closingTime || ""}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">{isEditing ? "Save" : "Create"}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ParkPopup;
