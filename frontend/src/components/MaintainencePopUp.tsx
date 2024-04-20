import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Box,
} from "@mui/material";
import db from "./db";
import { Maintenance, MaintenanceEntity } from "../models/maintenance.model";

interface MaintenancePopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Maintenance>) => void;
  formData: Partial<Maintenance>;
  isEditing: boolean;
}

const MaintenancePopup: React.FC<MaintenancePopupProps> = ({
  open,
  onClose,
  onSubmit,
  formData,
  isEditing,
}) => {
  const [maintenanceData, setMaintenanceData] = useState<Partial<Maintenance>>({
    maintenanceStartDate: new Date().toISOString().slice(0, 16),
    maintenanceEndDate: "",
    reason: "",
    description: "",
    affectedEntities: [],
  });
  const [entityOptions, setEntityOptions] = useState<{
    [key: string]: MaintenanceEntity[];
  }>({
    Ride: [],
    Restaurant: [],
    GiftShop: [],
  });

  const toLocalISOString = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000; // Convert offset to milliseconds
    const localISOTime = new Date(date.getTime() - offset)
      .toISOString()
      .slice(0, 16);
    return localISOTime;
  };

  useEffect(() => {
    if (open) {
      if (!formData.maintenanceID) {
        // If it's a new maintenance record, reset the state
        setMaintenanceData({
          maintenanceStartDate: toLocalISOString(new Date()),
          reason: "",
          description: "",
          affectedEntities: [],
          ...formData,
        });
      } else {
        // If it's an existing maintenance record, update the state
        setMaintenanceData({
          ...formData,
          maintenanceStartDate: formData.maintenanceStartDate || "",
          maintenanceEndDate: formData.maintenanceEndDate,
          affectedEntities: formData.affectedEntities || [],
        });
      }
      fetchEntityOptions();
    }
  }, [formData, open]);

  const fetchEntityOptions = async () => {
    try {
      const [ridesResponse, restaurantsResponse, giftshopsResponse] =
        await Promise.all([
          db.get("/Maintenance/rides"),
          db.get("/Maintenance/restaurants"),
          db.get("/Maintenance/shops"),
        ]);

      setEntityOptions({
        Ride: ridesResponse.data,
        Restaurant: restaurantsResponse.data,
        GiftShop: giftshopsResponse.data,
      });
    } catch (error) {
      console.error("Error fetching entity options:", error);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = event.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setMaintenanceData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEntityChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedEntities = (maintenanceData.affectedEntities || []).map(
      (entity, idx) =>
        idx === index
          ? {
              ...entity,
              [event.target.name]:
                event.target.type === "checkbox"
                  ? (event.target as HTMLInputElement).checked
                  : event.target.value,
            }
          : entity
    );

    // Update the entityName based on the selected entityType and entityID
    const updatedEntity = updatedEntities[index];
    const selectedEntity = entityOptions[updatedEntity.entityType]?.find(
      (option) => option.entityID === updatedEntity.entityID
    );
    updatedEntity.entityName = selectedEntity?.entityName || "";

    setMaintenanceData((prev) => ({
      ...prev,
      affectedEntities: updatedEntities,
    }));
  };

  const addEntity = () => {
    setMaintenanceData((prev) => ({
      ...prev,
      affectedEntities: [
        ...(prev.affectedEntities || []),
        { entityType: "", entityName: "", entityID: 0, closureStatus: false },
      ],
    }));
  };

  const removeEntity = (index: number) => {
    setMaintenanceData((prev) => ({
      ...prev,
      affectedEntities: (prev.affectedEntities || []).filter(
        (_, idx) => idx !== index
      ),
    }));
  };

  const handleSubmit = () => {
    onSubmit(maintenanceData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? "Edit Maintenance" : "Add Maintenance"}
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Start Date and Time"
          type="datetime-local"
          fullWidth
          variant="outlined"
          name="maintenanceStartDate"
          value={maintenanceData.maintenanceStartDate}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          label="End Date and Time"
          type="datetime-local"
          fullWidth
          variant="outlined"
          name="maintenanceEndDate"
          value={maintenanceData.maintenanceEndDate || ""}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          label="Reason"
          fullWidth
          variant="outlined"
          name="reason"
          value={maintenanceData.reason}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          name="description"
          value={maintenanceData.description}
          onChange={handleChange}
        />
        {maintenanceData.affectedEntities?.map((entity, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            <TextField
              margin="dense"
              label="Entity Type"
              select
              fullWidth
              variant="outlined"
              name="entityType"
              value={entity.entityType}
              onChange={(event) => handleEntityChange(index, event)}
            >
              {Object.keys(entityOptions).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              margin="dense"
              label="Entity"
              select
              fullWidth
              variant="outlined"
              name="entityID"
              value={entity.entityID}
              onChange={(event) => handleEntityChange(index, event)}
            >
              {entityOptions[entity.entityType]?.map((option) => (
                <MenuItem key={option.entityID} value={option.entityID}>
                  {option.entityName}
                </MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              control={
                <Checkbox
                  checked={entity.closureStatus}
                  onChange={(event) => handleEntityChange(index, event)}
                  name="closureStatus"
                />
              }
              label="Closure Status"
            />
            <Button onClick={() => removeEntity(index)} color="secondary">
              Remove
            </Button>
          </Box>
        ))}
        <Button onClick={addEntity} color="primary">
          Add Entity
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {isEditing ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaintenancePopup;
