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
  SelectChangeEvent,
  FormHelperText,
} from "@mui/material";
import db from "./db";
import { Restaurant } from "../models/restaurant.model";

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

  const handleAreaChange = (e: SelectChangeEvent<string>) => {
    const selectedAreaId = parseInt(e.target.value);
    const selectedArea =
      areas.find((area) => area.areaID === selectedAreaId) || null;

    setFormData({
      ...formData,
      area: {
        areaID: selectedAreaId,
        areaName: selectedArea?.areaName || "",
      },
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {isEditing ? "Edit Restaurant" : "Create Restaurant"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            name="imageURL"
            label="Image URL"
            value={formData.imageURL || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="restaurantName"
            label="Name"
            value={formData.restaurantName || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="area-select-label">Area</InputLabel>
            <Select
              labelId="area-select-label"
              id="area-select"
              value={formData.area?.areaID?.toString() || ""}
              onChange={(event: SelectChangeEvent<string>) =>
                handleAreaChange(event)
              }
            >
              {areas.map((area) => (
                <MenuItem key={area.areaID} value={area.areaID.toString()}>
                  {area.areaName}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Required</FormHelperText>
          </FormControl>
          <TextField
            name="cuisineType"
            label="Cuisine Type"
            value={formData.cuisineType || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="menuDescription"
            label="Menu Description"
            value={formData.menuDescription || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />
          <TextField
            name="seatingCapacity"
            label="Seating Capacity"
            type="number"
            value={formData.seatingCapacity || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="openingTime"
            label="Opening Time"
            type="time"
            value={formData.openingTime || ""}
            onChange={handleChange}
            fullWidth
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            name="closingTime"
            label="Closing Time"
            type="time"
            value={formData.closingTime || ""}
            onChange={handleChange}
            fullWidth
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {isEditing ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RestaurantPopup;
