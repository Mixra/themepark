import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import db from "./db";

interface Ride {
  imageUrl: string | null;
  rideID: number;
  rideName: string;
  description: string | null;
  type: string;
  minimumHeight: number;
  maximumCapacity: number;
  openingTime: string | null;
  closingTime: string | null;
  duration: number;
  unitPrice: number | null;
  area: {
    areaID: number;
    areaName: string;
  };
  hasCrud: boolean;
}

interface RidesPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<Ride>) => void;
  formData: Partial<Ride>;
  setFormData: (formData: Partial<Ride>) => void;
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
  const [areas, setAreas] = useState<{ areaID: number; areaName: string }[]>(
    []
  );

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await db.get("/view/allowed_areas");
        setAreas(response.data);
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    };
    fetchAreas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedArea = areas.find(
      (area) => area.areaID === parseInt(e.target.value)
    );
    setFormData({
      ...formData,
      area: {
        areaID: parseInt(e.target.value),
        areaName: selectedArea?.areaName || "",
      },
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditing ? "Edit Ride" : "Create Ride"}</DialogTitle>
      <DialogContent>
        <TextField
          name="imageUrl"
          label="Image URL"
          value={formData.imageUrl || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="rideName"
          label="Name"
          value={formData.rideName || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="area-select-label">Area</InputLabel>
          <Select
            labelId="area-select-label"
            id="area-select"
            value={formData.area?.areaID?.toString() || ""}
            onChange={handleAreaChange}
          >
            {areas.map((area) => (
              <MenuItem key={area.areaID} value={area.areaID.toString()}>
                {area.areaName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          name="type"
          label="Type"
          value={formData.type || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="minimumHeight"
          type="number"
          label="Minimum Height Required(cm)"
          value={formData.minimumHeight || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="maximumCapacity"
          type="number"
          label="Maximum Capacity"
          value={formData.maximumCapacity || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="duration"
          type="number"
          label="Duration in Seconds"
          value={formData.duration || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="unitPrice"
          label="Price"
          type="number"
          value={formData.unitPrice || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
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
          required
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
          required
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
          required
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
