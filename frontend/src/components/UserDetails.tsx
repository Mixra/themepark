import React from "react";
import { TextField, Box, Typography, Grid } from "@mui/material";
import { UserData } from "../models/profile.model";

interface UserDetailsProps {
  userData: UserData;
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  userData,
  isEditing,
  handleChange,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: 5,
        borderRadius: 1,
      }}
    >
      <Typography
        variant="h5"
        sx={{ color: "black", marginBottom: 2, fontWeight: "bold" }}
      >
        User Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Username"
            value={userData.username}
            disabled
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Password"
            type="password"
            value={userData.password}
            disabled={!isEditing}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="First Name"
            name="first_name"
            value={userData.first_name}
            disabled={!isEditing}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Last Name"
            name="last_name"
            value={userData.last_name}
            disabled={!isEditing}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Email"
            name="email"
            value={userData.email}
            disabled={!isEditing}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Phone"
            name="phone"
            value={userData.phone}
            disabled={!isEditing}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDetails;
