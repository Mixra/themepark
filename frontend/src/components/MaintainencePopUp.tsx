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

interface ParkArea {
  LogID?: number;
  AreaID?: number;
  Type?: string;
  Description?: string;
  startDateTime?: Date; // Now a Date object
  endDateTime?: Date; // Now a Date object
}

interface ParkPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<ParkArea>) => void;
  formData: Partial<ParkArea>;
  setFormData: (formData: Partial<ParkArea>) => void;
  isEditing: boolean;
}

const MaintenancePopup: React.FC<ParkPopupProps> = ({
  open,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEditing,
}) => {
  const [localFormData, setLocalFormData] = useState<Partial<ParkArea>>(formData);

  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name) {
      if (name === "startDateTime" || name === "endDateTime") {
        // Convert the string back to a Date object when changing the date fields
        const dateValue = value ? new Date(value as string) : new Date();
        setLocalFormData({ ...localFormData, [name]: dateValue });
      } else {
        setLocalFormData({ ...localFormData, [name]: value });
      }
    }
  };

  const handleSubmit = () => {
    onSubmit(localFormData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditing ? "Edit Maintenance" : "Create Maintenance"}</DialogTitle>
      <DialogContent>
      <TextField
          margin="dense"
          name="LogID"
          label="Log ID"
          type="number"
          fullWidth
          value={localFormData.LogID || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="AreaID"
          label="Area ID"
          type="number"
          fullWidth
          value={localFormData.AreaID || ""}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="type-select-label">Type</InputLabel>
          <Select
            labelId="type-select-label"
            id="Type"
            name="Type"
            value={localFormData.Type || ''}
            label="Type"
            onChange={handleChange}
          >
            <MenuItem value={"Routine Checkup"}>Routine Checkup</MenuItem>
            <MenuItem value={"Emergency Repair"}>Emergency Repair</MenuItem>
            <MenuItem value={"Scheduled Upgrade"}>Scheduled Upgrade</MenuItem>
            {/* Add more types as needed */}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          name="Description"
          label="Description"
          type="text"
          multiline
          rows={4}
          fullWidth
          value={localFormData.Description || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="startDateTime"
          label="Start Date Time"
          type="datetime-local"
          fullWidth
          value={localFormData.startDateTime ? localFormData.startDateTime.toISOString().slice(0, 16) : ""}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          name="endDateTime"
          label="End Date Time"
          type="datetime-local"
          fullWidth
          value={localFormData.endDateTime ? localFormData.endDateTime.toISOString().slice(0, 16) : ""}
          onChange={handleChange}
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

export default MaintenancePopup;
