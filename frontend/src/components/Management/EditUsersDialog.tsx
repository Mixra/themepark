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
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { User, Position } from "./types";
import PositionDialog from "./PositionDialog";
import db from "../../components/db";
import { PrivilegeLevel } from "./types";

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  onUserUpdated: (updatedUser: User) => void;
  user: User | null;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  onClose,
  onUserUpdated,
  user,
}) => {
  const [isPositionsLoading, setIsPositionsLoading] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isStaff, setIsStaff] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const [hourlyRate, setHourlyRate] = useState(0);
  const [ssn, setSSN] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [isFullTime, setIsFullTime] = useState(false);

  const [isPositionDialogOpen, setIsPositionDialogOpen] = useState(false);

  const fetchPositions = async () => {
    let isMounted = true;

    try {
      setIsPositionsLoading(true);
      const response = await db.get<Position[]>("/view/positions");
      if (isMounted) {
        setPositions(response.data);
      }
    } catch (error) {
      console.error("Error fetching positions:", error);
    } finally {
      if (isMounted) {
        setIsPositionsLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  };

  const formatDate = (date: Date | null | string) => {
    if (!date) return "";

    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return "";

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchPositions();

    if (user) {
      setUsername(user.username);
      setPassword(user.password);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhone(user.phone);
      setIsStaff(!!user.position);
      setSelectedPosition(user.position || null);
      setHourlyRate(user.hourlyRate || 0);
      setSSN(user.ssn || "");
      setStartDate(formatDate(user.startDate));
      setEndDate(formatDate(user.endDate));
      setAddress(user.address || "");
      setEmergencyContactName(user.emergencyContactName || "");
      setEmergencyContactPhone(user.emergencyContactPhone || "");
      setIsFullTime(user.isFullTime || false);
    }
  }, [user]);

  const handleUpdateUser = async () => {
    if (user) {
      const updatedUser: User = {
        ...user,
        password,
        firstName,
        lastName,
        email,
        phone,
        isStaff,
        position: isStaff ? selectedPosition : null,
        hourlyRate: isStaff ? hourlyRate : 0,
        ssn: isStaff ? ssn : "",
        startDate: isStaff ? new Date(startDate) : null,
        endDate: isStaff ? new Date(endDate) : null,
        address: isStaff ? address : "",
        emergencyContactName: isStaff ? emergencyContactName : "",
        emergencyContactPhone: isStaff ? emergencyContactPhone : "",
        isFullTime: isStaff ? isFullTime : false,
      };

      try {
        await db.put("/admin/update_user", updatedUser);
        onUserUpdated(updatedUser);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  const handleCreatePosition = () => {
    setIsPositionDialogOpen(true);
  };

  const handlePositionCreated = () => {
    fetchPositions(); // Refetch positions after creating a new one
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField
          label="Username"
          value={username}
          disabled
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
            <Autocomplete
              id="position-autocomplete"
              options={positions}
              getOptionLabel={(option) =>
                `${option.name} (${
                  option.level !== undefined
                    ? PrivilegeLevel[option.level]
                    : "Unknown"
                })`
              }
              loading={isPositionsLoading}
              value={selectedPosition}
              onChange={(_, newValue) => setSelectedPosition(newValue)}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Position"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {isPositionsLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />

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
              type="date"
              margin="normal"
            />
            <TextField
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              type="date"
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
        <Button onClick={handleUpdateUser}>Update</Button>
      </DialogActions>
      <PositionDialog
        open={isPositionDialogOpen}
        onClose={() => setIsPositionDialogOpen(false)}
        onPositionCreated={handlePositionCreated}
        position={null}
      />
    </Dialog>
  );
};

export default EditUserDialog;
