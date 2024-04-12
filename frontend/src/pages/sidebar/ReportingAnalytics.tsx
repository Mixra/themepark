import React from "react";
import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Joker from "../../components/Joker";
import { useTheme } from "@mui/material/styles";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const ReportingAnalytics: React.FC = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  const handleOpenChatbot = () => {
    setShowChatbot(true);
  };

  const handleCloseChatbot = () => {
    setShowChatbot(false);
  };
  //this is what i addedd
  const theme = useTheme();
  const [date, setDate] = useState(new Date());
  return (
    <div>
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <Typography variant="body1">
          Can't find what you're looking for?{" "}
          <Button onClick={handleOpenChatbot}>Try asking Joker</Button>
        </Typography>
      </Box>
        <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
        }}
        >
          <div>
            <h1>Starting Date:</h1>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Start Date Time" />
            </LocalizationProvider>

            <h1>Endind Date:</h1>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="End Date Time" />
            </LocalizationProvider>
          </div>
        </Box>
      <Joker open={showChatbot} onClose={handleCloseChatbot} />
    </div>
  );
};

export default ReportingAnalytics;
