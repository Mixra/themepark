import React from "react";
import { Box, Button } from "@mui/material";
import { User } from "./types";

interface UserActionButtonsProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (username: string) => void;
  onAssignArea: (username: string) => void;
}

const UserActionButtons: React.FC<UserActionButtonsProps> = ({
  user,
  onEdit,
  onDelete,
  onAssignArea,
}) => {
  return (
    <Box display="flex" justifyContent="space-around">
      <Button
        variant="contained"
        color="secondary"
        onClick={() => onAssignArea(user.username)}
      >
        Assign Area
      </Button>
      <Button variant="contained" color="primary" onClick={() => onEdit(user)}>
        Edit
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={() => onDelete(user.username)}
      >
        Delete
      </Button>
    </Box>
  );
};

export default UserActionButtons;
