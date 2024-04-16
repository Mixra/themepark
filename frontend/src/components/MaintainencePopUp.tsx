import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormControlLabel, MenuItem, Box } from '@mui/material';
import db from "./db";
import { Maintenance, AffectedEntity } from "../models/maintenance.model";




interface MaintenancePopupProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Maintenance>) => void;
    formData: Partial<Maintenance>;
    isEditing: boolean;
}

const formatDate = (date) => {
    if (!date) return '';
    // Check if date is a string and seems to be formatted correctly
    if (typeof date === 'string' && date.length === 16 && date.includes('T')) {
        return date;
    }
    // Convert Date objects to the correct string format
    return date instanceof Date ? date.toISOString().slice(0, 16) : '';
};

  const MaintenancePopup: React.FC<MaintenancePopupProps> = ({ open, onClose, onSubmit, formData, isEditing }) => {
    const [maintenanceData, setMaintenanceData] = useState<Partial<Maintenance>>({
        ...formData,
        maintenanceStartDate: formData.maintenanceStartDate ? new Date(formData.maintenanceStartDate) : new Date(),
        maintenanceEndDate: formData.maintenanceEndDate ? new Date(formData.maintenanceEndDate) : null,
        affectedEntities: formData.affectedEntities || []
    });

    useEffect(() => {
        if (open) {
            setMaintenanceData({
                ...formData,
                maintenanceStartDate: formData.maintenanceStartDate ? new Date(formData.maintenanceStartDate) : new Date(),
                maintenanceEndDate: formData.maintenanceEndDate ? new Date(formData.maintenanceEndDate) : null,
                affectedEntities: formData.affectedEntities || []
            });
        }
    }, [formData, open]);
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        if (type === 'datetime-local') {
            // Parse the date string to a Date object
            const adjustedDate = new Date(value);
            console.log(`Parsed date for ${name}:`, adjustedDate);
            setMaintenanceData(prev => ({
                ...prev,
                [name]: adjustedDate
            }));
        } else {
            setMaintenanceData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };
    
  
    const handleEntityChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedEntities = (maintenanceData.affectedEntities || []).map((entity, idx) =>
            idx === index ? { ...entity, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value } : entity
        );
        setMaintenanceData(prev => ({ ...prev, affectedEntities: updatedEntities }));
    };
  
    const addEntity = () => {
      setMaintenanceData(prev => ({
        ...prev,
        affectedEntities: [...(prev.affectedEntities || []), { entityType: '', entityId: '', closureStatus: false }]
      }));
    };
  
    const removeEntity = (index: number) => {
      setMaintenanceData(prev => ({
        ...prev,
        affectedEntities: (prev.affectedEntities || []).filter((_, idx) => idx !== index)
      }));
    };
  
    const handleSubmit = () => {
        if (!maintenanceData.maintenanceStartDate || !maintenanceData.maintenanceEndDate) {
            console.error('Date fields are missing!');
            return;
        }
        onSubmit({
            ...maintenanceData,
            maintenanceStartDate: maintenanceData.maintenanceStartDate.toISOString(),
            maintenanceEndDate: maintenanceData.maintenanceEndDate ? maintenanceData.maintenanceEndDate.toISOString() : null,
        });
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
                  name="maintenanceStartDate"
                  value={formatDate(maintenanceData.maintenanceStartDate)}
                  onChange={handleChange}
              />
              <TextField
    margin="dense"
    label="End Date and Time"
    type="datetime-local"
    fullWidth
    variant="outlined"
    name="maintenanceEndDate"
    value={formatDate(maintenanceData.maintenanceEndDate)}
    onChange={handleChange}
    InputLabelProps={{
        shrink: true,  // This prop ensures the label is displayed correctly with a datetime-local input
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
                <FormControlLabel
                    control={<Checkbox checked={maintenanceData.requireClosure} onChange={handleChange} name="requireClosure" />}
                    label="Require Closure"
                />
                {maintenanceData.affectedEntities.map((entity, index) => (
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