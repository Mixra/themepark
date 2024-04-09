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
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { User, Position } from "./types";
import PositionDialog from "./PositionDialog";

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateUser: (newUser: User) => void;
  onUpdateUser: (updatedUser: User) => void;
  positions: Position[];
  onCreatePosition: (position: Position) => void;
  user: User | null;
}

const UserDialog: React.FC<UserDialogProps> = ({
  open,
  onClose,
  onCreateUser,
  onUpdateUser,
  positions,
  onCreatePosition,
  user,
}) => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isStaff, setIsStaff] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [ssn, setSSN] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [isFullTime, setIsFullTime] = useState(false);

  const [isPositionDialogOpen, setIsPositionDialogOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhone(user.phone);
      setIsStaff(!!user.position);
      setPosition(user.position || null);
      setHourlyRate(user.hourlyRate || 0);
      setSSN(user.ssn || "");
      setStartDate(user.startDate || "");
      setEndDate(user.endDate || "");
      setAddress(user.address || "");
      setEmergencyContactName(user.emergencyContactName || "");
      setEmergencyContactPhone(user.emergencyContactPhone || "");
      setIsFullTime(user.isFullTime || false);
    } else {
      resetForm();
    }
  }, [user]);

  const handleSaveUser = () => {
    const updatedUser: User = {
      username,
      firstName,
      lastName,
      email,
      phone,
      position: isStaff ? position : null,
      hourlyRate: isStaff ? hourlyRate : 0,
      ssn: isStaff ? ssn : "",
      startDate: isStaff ? startDate : "",
      endDate: isStaff ? endDate : "",
      address: isStaff ? address : "",
      emergencyContactName: isStaff ? emergencyContactName : "",
      emergencyContactPhone: isStaff ? emergencyContactPhone : "",
      isFullTime: isStaff ? isFullTime : false,
      parkAreas: user?.parkAreas || [],
    };

    if (user) {
      onUpdateUser(updatedUser);
    } else {
      onCreateUser(updatedUser);
    }
    onClose();
  };

  const handleCreatePosition = () => {
    setEditingPosition(null);
    setIsPositionDialogOpen(true);
  };

  const handleSavePosition = (position: Position) => {
    onCreatePosition(position);
    setPosition(position);
  };

  const resetForm = () => {
    setUsername("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setIsStaff(false);
    setPosition(null);
    setHourlyRate(0);
    setSSN("");
    setStartDate("");
    setEndDate("");
    setAddress("");
    setEmergencyContactName("");
    setEmergencyContactPhone("");
    setIsFullTime(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{user ? "Edit User" : "Create User"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isStaff}
              onChange={(e) => setIsStaff(e.target.checked)}
            />
          }
          label="Is Staff"
        />

        {isStaff && (
          <>
            <InputLabel id="position-label">Position</InputLabel>
            <Select
              labelId="position-label"
              value={position?.name || ""}
              onChange={(e) => {
                const selectedPosition = positions.find(
                  (p) => p.name === e.target.value
                );
                setPosition(selectedPosition || null);
              }}
              fullWidth
            >
              {positions.map((p) => (
                <MenuItem key={p.name} value={p.name}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
            <Button onClick={handleCreatePosition}>Create Position</Button>
            <TextField
              label="Hourly Rate"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              label="SSN"
              value={ssn}
              onChange={(e) => setSSN(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Emergency Contact Name"
              value={emergencyContactName}
              onChange={(e) => setEmergencyContactName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Emergency Contact Phone"
              value={emergencyContactPhone}
              onChange={(e) => setEmergencyContactPhone(e.target.value)}
              fullWidth
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isFullTime}
                  onChange={(e) => setIsFullTime(e.target.checked)}
                />
              }
              label="Is Full Time"
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSaveUser}>{user ? "Update" : "Create"}</Button>
      </DialogActions>
      <PositionDialog
        open={isPositionDialogOpen}
        onClose={() => setIsPositionDialogOpen(false)}
        onSavePosition={handleSavePosition}
        position={editingPosition}
      />
    </Dialog>
  );
};

export default UserDialog;
