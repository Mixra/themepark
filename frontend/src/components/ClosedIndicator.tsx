import React from "react";
import Chip from "@mui/material/Chip";

export const ClosedIndicator: React.FC = () => (
  <Chip
    label="Closed"
    size="small"
    sx={{ ml: 1, bgcolor: "error.main", color: "white" }}
  />
);
