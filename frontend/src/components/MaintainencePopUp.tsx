import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormControlLabel, MenuItem, Box } from '@mui/material';

interface AffectedEntity {
    entityType: string;
    entityId: number;
    closureStatus: boolean;
}

interface Maintenance {
    MaintenanceID?: number;
    MaintenanceStartDate: Date;
    MaintenanceEndDate?: Date;
    Reason: string;
    Description: string;
    RequireClosure: boolean;
    AffectedEntities: AffectedEntity[];
}

interface MaintenancePopupProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Maintenance>) => void;
    formData: Partial<Maintenance>;
    isEditing: boolean;
}

const formatDate = (date) => {
  return date.toISOString().slice(0, 16);
};

const MaintenancePopup = ({ open, onClose, onSubmit, formData, isEditing }) => {
  const [maintenanceData, setMaintenanceData] = useState(() => ({
      MaintenanceID: formData.MaintenanceID || undefined,
      MaintenanceStartDate: formData.MaintenanceStartDate || new Date(),
      MaintenanceEndDate: formData.MaintenanceEndDate || new Date(),
      Reason: formData.Reason || '',
      Description: formData.Description || '',
      RequireClosure: formData.RequireClosure || false,
      AffectedEntities: formData.AffectedEntities || []
  }));

  useEffect(() => {
      if (open) {
          setMaintenanceData({
              ...formData,
              MaintenanceStartDate: formData.MaintenanceStartDate || new Date(),
              MaintenanceEndDate: formData.MaintenanceEndDate || new Date(),
              AffectedEntities: formData.AffectedEntities && formData.AffectedEntities.length > 0 ? formData.AffectedEntities : []
          });
      }
  }, [formData, open]);  // Depending on how formData is managed, you might adjust this

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setMaintenanceData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEntityChange = (index, event) => {
        const { name, type, value, checked } = event.target;
        const updatedEntities = maintenanceData.AffectedEntities.map((entity, idx) =>
            idx === index ? { ...entity, [name]: type === 'checkbox' ? checked : value } : entity
        );
        setMaintenanceData(prev => ({ ...prev, AffectedEntities: updatedEntities }));
    };

    const addEntity = () => {
        setMaintenanceData(prev => ({
            ...prev,
            AffectedEntities: [...prev.AffectedEntities, { entityType: '', entityId: 0, closureStatus: false }]
        }));
    };

    const removeEntity = (index) => {
        setMaintenanceData(prev => ({
            ...prev,
            AffectedEntities: prev.AffectedEntities.filter((_, idx) => idx !== index)
        }));
    };

    const handleSubmit = () => {
        onSubmit(maintenanceData);
        onClose();
    };

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
          <DialogTitle>{isEditing ? 'Edit Maintenance' : 'Add Maintenance'}</DialogTitle>
          <DialogContent>
              {/* Format dates properly for input */}
              <TextField
                  margin="dense"
                  label="Start Date and Time"
                  type="datetime-local"
                  fullWidth
                  variant="outlined"
                  name="MaintenanceStartDate"
                  value={formatDate(maintenanceData.MaintenanceStartDate)}
                  onChange={handleChange}
              />
              <TextField
                  margin="dense"
                  label="End Date and Time"
                  type="datetime-local"
                  fullWidth
                  variant="outlined"
                  name="MaintenanceEndDate"
                  value={maintenanceData.MaintenanceEndDate ? formatDate(maintenanceData.MaintenanceEndDate) : ''}
                  onChange={handleChange}
              />
                <TextField
                    margin="dense"
                    label="Reason"
                    fullWidth
                    variant="outlined"
                    name="Reason"
                    value={maintenanceData.Reason}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    name="Description"
                    value={maintenanceData.Description}
                    onChange={handleChange}
                />
                <FormControlLabel
                    control={<Checkbox checked={maintenanceData.RequireClosure} onChange={handleChange} name="RequireClosure" />}
                    label="Require Closure"
                />
                {maintenanceData.AffectedEntities.map((entity, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                            {['Ride', 'Events', 'Giftshops', 'Areas'].map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            margin="dense"
                            label="Entity ID"
                            type="number"
                            fullWidth
                            variant="outlined"
                            name="entityId"
                            value={entity.entityId}
                            onChange={(event) => handleEntityChange(index, event)}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={entity.closureStatus} onChange={(event) => handleEntityChange(index, event)} name="closureStatus" />}
                            label="Closure Status"
                        />
                        <Button onClick={() => removeEntity(index)} color="secondary">Remove</Button>
                    </Box>
                ))}
                <Button onClick={addEntity} color="primary">Add Entity</Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary">{isEditing ? 'Update' : 'Add'}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MaintenancePopup;
