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
import db from "../db";
import { DialogActions } from "@mui/material";

interface AssignParkAreasDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  parkAreas: ParkArea[];
  onAssignParkAreas: (username: string, areaIds: number[]) => void;
}

const AssignParkAreasDialog: React.FC<AssignParkAreasDialogProps> = ({
  open,
  onClose,
  user,
  parkAreas,
  onAssignParkAreas,
}) => {
  const [assignedAreas, setAssignedAreas] = useState<ParkArea[]>([]);
  const [availableAreas, setAvailableAreas] = useState<ParkArea[]>([]);
  const [newAreaId, setNewAreaId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAssignedAreas = async () => {
      if (user?.username) {
        try {
          const response = await db.get<ParkArea[]>(
            `/admin/get_assigned_areas/${user.username}`
          );
          setAssignedAreas(response.data);
          setAvailableAreas(
            parkAreas.filter(
              (area) =>
                !response.data.some(
                  (userArea) => userArea.areaID === area.areaID
                )
            )
          );
        } catch (error) {
          console.error("Error fetching assigned areas:", error);
        }
      }
    };

    fetchAssignedAreas();
  }, [user, parkAreas]);

  const handleAddArea = async () => {
    if (user?.username && newAreaId) {
      try {
        await db.post("/admin/assign_area", {
          areaID: newAreaId,
          username: user.username,
        });
        const addedArea = availableAreas.find(
          (area) => area.areaID === newAreaId
        );
        setAssignedAreas([...assignedAreas, addedArea!]);
        setAvailableAreas(
          availableAreas.filter((area) => area.areaID !== newAreaId)
        );
        setNewAreaId(null);
      } catch (error) {
        console.error("Error assigning area:", error);
      }
    }
  };

  const handleRemoveArea = async (areaId: number) => {
    if (user?.username) {
      try {
        await db.delete("/admin/unassign_area", {
          data: {
            areaID: areaId,
            username: user.username,
          },
        });
        const removedArea = assignedAreas.find(
          (area) => area.areaID === areaId
        );
        setAssignedAreas(
          assignedAreas.filter((area) => area.areaID !== areaId)
        );
        setAvailableAreas([...availableAreas, removedArea!]);
      } catch (error) {
        console.error("Error unassigning area:", error);
      }
    }
  };

  const handleClose = () => {
    onAssignParkAreas(
      user?.username || "",
      assignedAreas.map((area) => area.areaID)
    );
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Assign Park Areas</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "400px",
            maxHeight: "400px",
            overflow: "auto",
          }}
        >
          <Box>
            <InputLabel id="new-park-area-label">Add New Park Area</InputLabel>
            <Select
              labelId="new-park-area-label"
              value={newAreaId || ""}
              onChange={(e) =>
                setNewAreaId(parseInt(e.target.value.toString(), 10))
              }
              fullWidth
            >
              <MenuItem value="">Select a park area</MenuItem>
              {availableAreas.map((area) => (
                <MenuItem key={area.areaID} value={area.areaID}>
                  {area.areaName}
                </MenuItem>
              ))}
            </Select>
            <Button onClick={handleAddArea}>Add</Button>
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
              {assignedAreas.map((area) => (
                <Chip
                  key={area.areaID}
                  label={area.areaName}
                  size="small"
                  sx={{ bgcolor: "primary.main", color: "white" }}
                  onDelete={() => handleRemoveArea(area.areaID)}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignParkAreasDialog;
