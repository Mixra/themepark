/*import React from "react";
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
            
          </div>
        </Box>
      <Joker open={showChatbot} onClose={handleCloseChatbot} />
    </div>
  );
};

export default ReportingAnalytics;*/

import React, { useState, ChangeEvent } from 'react';
import { Box, Button, Typography, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import Joker from '../../components/Joker'; // Ensure Joker is properly typed if needed
import { useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';  // Ensure dayjs is installed and typed

const ReportingAnalytics: React.FC = () => {
  const theme = useTheme();
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [reportType, setReportType] = useState<string>('');
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>('');

  const handleOpenChatbot = () => {
    setShowChatbot(true);
  };

  const handleCloseChatbot = () => {
    setShowChatbot(false);
  };

  const reportTypes = [
    { value: 'maintenance', label: 'Maintenance Report' },
    { value: 'employee', label: 'Employee Report' },
    { value: 'sales', label: 'Sales Report' },
  ];

  const handleReportTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setReportType(event.target.value);
  };

  const handleViewReports = () => {
    switch (reportType) {
      case 'maintenance':
        setPopupMessage('Maintenance');
        break;
      case 'employee':
        setPopupMessage('Employee');
        break;
      case 'sales':
        setPopupMessage('Sales');
        break;
      default:
        setPopupMessage('No report selected.');
    }
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

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
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          padding: 4,
          width: "100%"
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={setEndDate}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <TextField
          select
          label="Report Type"
          value={reportType}
          onChange={handleReportTypeChange}
          sx={{ minWidth: 200 }}
        >
          {reportTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          onClick={handleViewReports}
        >
          View Reports
        </Button>
      </Box>
      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogTitle>Report Details</DialogTitle>
        <DialogContent>
          <DialogContentText>{popupMessage} Report</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup}>Close</Button>
        </DialogActions>
      </Dialog>
      <Joker open={showChatbot} onClose={handleCloseChatbot} />
    </div>
  );
};

export default ReportingAnalytics;
