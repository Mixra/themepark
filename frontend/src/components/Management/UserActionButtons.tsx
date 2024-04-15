import React from "react";
import { Button, Box } from "@mui/material";
import { User } from "./types";

interface UserActionButtonsProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onAssignArea?: (user: User) => void;
}

const UserActionButtons: React.FC<UserActionButtonsProps> = ({
  user,
  onEdit,
  onDelete,
  onAssignArea,
}) => {
  return (
    <Box>
      {onAssignArea && (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onAssignArea(user)}
          sx={{ mr: 1 }}
        >
          Assign Area
        </Button>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() => onEdit(user)}
        sx={{ mr: 1 }}
      >
        Edit
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={() => onDelete(user)}
        sx={{ mr: 1 }}
      >
        Delete
      </Button>
    </Box>
  );
};

export default UserActionButtons;
