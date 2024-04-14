import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  MenuItem,
  FormControlLabel,
} from "@mui/material";
import { Event } from "../models/event.model";

interface EventPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<Event>) => void;
  formData: Partial<Event>;
  setFormData: (formData: Partial<Event>) => void;
  isEditing: boolean;
}

const EventPopup: React.FC<EventPopupProps> = ({
  open,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEditing,
}) => {
  const [ticketsRequired, setTicketsRequired] = useState<boolean>(
    formData.requireTicket || false
  );

  useEffect(() => {
    setTicketsRequired(formData.requireTicket || false);
  }, [formData.requireTicket]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: isNaN(value) ? 0 : value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicketsRequired(e.target.checked);
    setFormData({
      ...formData,
      requireTicket: e.target.checked,
      unitPrice: e.target.checked ? 0 : undefined,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const ageOptions = ["13+", "18+", "21+", "All Age"];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditing ? "Edit Event" : "Create Event"}</DialogTitle>
      <form onSubmit={handleSubmit}>
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
            name="eventName"
            label="Name"
            value={formData.eventName || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="eventType"
            label="Type"
            value={formData.eventType || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="description"
            label="Description"
            value={formData.description || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />
          <TextField
            name="ageRestriction"
            label="Age Restriction"
            select
            value={formData.ageRestriction || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            {ageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="startDate"
            label="Opening Time and Date"
            type="datetime-local"
            value={formData.startDate || ""}
            onChange={handleChange}
            fullWidth
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            name="endDate"
            label="Closing Time and Date"
            type="datetime-local"
            value={formData.endDate || ""}
            onChange={handleChange}
            fullWidth
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={ticketsRequired}
                onChange={handleCheckboxChange}
                name="requireTicket"
                color="primary"
              />
            }
            label="Requires Tickets"
          />
          {ticketsRequired && (
            <TextField
              name="unitPrice"
              label="Price"
              type="number"
              value={formData.unitPrice || ""}
              onChange={handleNumberChange}
              fullWidth
              margin="normal"
              required
            />
          )}
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

export default EventPopup;
