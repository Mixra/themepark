import React, { useState } from "react";
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
} from "@mui/material";
import { Position, PrivilegeLevel } from "./types";

interface PositionDialogProps {
  open: boolean;
  onClose: () => void;
  onSavePosition: (position: Position) => void;
  position: Position | null;
}

const PositionDialog: React.FC<PositionDialogProps> = ({
  open,
  onClose,
  onSavePosition,
  position,
}) => {
  const [name, setName] = useState(position?.name || "");
  const [level, setLevel] = useState(
    position?.level || PrivilegeLevel.NoPrivilege
  );

  const handleSavePosition = () => {
    const updatedPosition: Position = {
      name,
      level,
    };
    onSavePosition(updatedPosition);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {position ? "Edit Position" : "Create Position"}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Position Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <InputLabel id="position-level-label">Position Level</InputLabel>
        <Select
          labelId="position-level-label"
          value={level}
          onChange={(e) => setLevel(e.target.value as PrivilegeLevel)}
          fullWidth
        >
          <MenuItem value={PrivilegeLevel.NoPrivilege}>No Privilege</MenuItem>
          <MenuItem value={PrivilegeLevel.EmployeePrivilege}>
            Employee Privilege
          </MenuItem>
          <MenuItem value={PrivilegeLevel.AdminPrivilege}>
            Admin Privilege
          </MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSavePosition}>
          {position ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PositionDialog;
