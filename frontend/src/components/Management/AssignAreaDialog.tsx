import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Chip,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { User, ParkArea } from "./types";

interface AssignParkAreasDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  parkAreas: ParkArea[];
  onAssignParkAreas: (userId: number, parkAreasIds: number[]) => void;
}

const AssignParkAreasDialog: React.FC<AssignParkAreasDialogProps> = ({
  open,
  onClose,
  user,
  parkAreas,
  onAssignParkAreas,
}) => {
  const [selectedParkAreas, setSelectedParkAreas] = useState<number[]>([]);
  const [availableParkAreas, setAvailableParkAreas] = useState<ParkArea[]>([]);
  const [newParkAreaId, setNewParkAreaId] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      setSelectedParkAreas(user.parkAreas.map((area) => area.id));
      setAvailableParkAreas(
        parkAreas.filter(
          (area) => !user.parkAreas.some((a) => a.id === area.id)
        )
      );
    }
  }, [user, parkAreas]);

  const handleAddParkArea = () => {
    if (newParkAreaId) {
      setSelectedParkAreas([...selectedParkAreas, newParkAreaId]);
      setAvailableParkAreas(
        availableParkAreas.filter((area) => area.id !== newParkAreaId)
      );
      setNewParkAreaId(null);
    }
  };

  const handleRemoveParkArea = (areaId: number) => {
    setSelectedParkAreas(selectedParkAreas.filter((id) => id !== areaId));
    setAvailableParkAreas([
      ...availableParkAreas,
      parkAreas.find((area) => area.id === areaId)!,
    ]);
  };

  const handleClose = () => {
    if (user) {
      onAssignParkAreas(user.id, selectedParkAreas);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box>
            <InputLabel id="new-park-area-label">Add New Park Area</InputLabel>
            <Select
              labelId="new-park-area-label"
              value={newParkAreaId || ""}
              onChange={(e) => setNewParkAreaId(parseInt(e.target.value, 10))}
              fullWidth
            >
              <MenuItem value="">Select a park area</MenuItem>
              {availableParkAreas.map((area) => (
                <MenuItem key={area.id} value={area.id}>
                  {area.name}
                </MenuItem>
              ))}
            </Select>
            <Button onClick={handleAddParkArea}>Add</Button>
          </Box>
          <Box>
            <InputLabel>Assigned Park Areas</InputLabel>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {selectedParkAreas.map((areaId) => (
                <Chip
                  key={areaId}
                  label={
                    parkAreas.find((area) => area.id === areaId)?.name || ""
                  }
                  onDelete={() => handleRemoveParkArea(areaId)}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AssignParkAreasDialog;
