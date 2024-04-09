import React from "react";
import { TextField, Box, Typography, Grid } from "@mui/material";
import { StaffInfoProps } from "../models/profile.model";
import { useTheme } from "@mui/material/styles";

const StaffDetails: React.FC<StaffInfoProps> = ({ staffInfo, isEditing }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: 5,
        borderRadius: 1,
        marginTop: 2,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: theme.palette.text.primary,
          marginBottom: 2,
          fontWeight: "bold",
        }}
      >
        Staff Info
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            label="Assigned Area"
            value={(staffInfo.areas || []).join(", ") || ""}
            disabled={!isEditing}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="SSN"
            value={staffInfo.ssn || ""}
            disabled={!isEditing}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Address"
            value={staffInfo.address || ""}
            disabled={!isEditing}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Hourly Rate"
            value={staffInfo.hourlyRate ? staffInfo.hourlyRate.toString() : ""}
            disabled={!isEditing}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Start Date"
            value={staffInfo.startDate || ""}
            disabled={!isEditing}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="End Date"
            value={staffInfo.endDate || ""}
            disabled={!isEditing}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Emergency Contact Name"
            value={staffInfo.emergencyContactName || ""}
            disabled={!isEditing}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Emergency Contact Phone"
            value={staffInfo.emergencyContactPhone || ""}
            disabled={!isEditing}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Full Time"
            value={staffInfo.fullTime ? "Yes" : "No"}
            disabled={!isEditing}
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StaffDetails;
