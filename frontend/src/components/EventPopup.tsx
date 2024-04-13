import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

interface Event {
  EventID?: number;
  AreaID?: number;
  Name?: string;
  Description?: string;
  eventType?: string;
  StartDateTime?: string;
  EndDateTime?: string;
  AgeRestriction?: number;
  ImageUrl?: string;
  RequiresTickets?: boolean;
  Price?: number;
}

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
    formData.RequiresTickets || false
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: parseInt(e.target.value) || 0,
    });
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTicketsRequired(e.target.checked);
    setFormData({ ...formData, RequiresTickets: e.target.checked });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditing ? "Edit Event" : "Create Event"}</DialogTitle>
      <DialogContent>
        <TextField
          name="imageUrl"
          label="Image URL"
          value={formData.ImageUrl || ""}
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
          name="Description"
          label="Description"
          value={formData.Description || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          name="AgeRestriction"
          label="AgeRestriction"
          value={formData.AgeRestriction || ""}
          onChange={handleNumberChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="StartDateTime"
          label="Opening Time and Date"
          type="datetime-local"
          value={formData.StartDateTime || ""}
          onChange={handleChange}
          fullWidth
          margin="dense"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          name="EndDateTime"
          label="Closing Time and Date"
          type="datetime-local"
          value={formData.EndDateTime || ""}
          onChange={handleChange}
          fullWidth
          margin="dense"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={ticketsRequired}
              onChange={handleCheckboxChange}
              name="requiresTickets"
              color="primary"
            />
          }
          label="Requires Tickets"
        />
        {ticketsRequired && (
          <TextField
            name="Price"
            label="Price"
            type="number"
            value={formData.Price || ""}
            onChange={handleNumberChange}
            fullWidth
            margin="normal"
          />
        )}
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

export default EventPopup;
