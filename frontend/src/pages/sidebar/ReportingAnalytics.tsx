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
import { Box, Button, Typography, TextField, MenuItem } from '@mui/material';
import Joker from '../../components/Joker';
import { useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';

type SalesReportData = {
  totalSales: string;
  bestRide: string;
};

type MaintenanceReportData = {
  rideName: string;
};

type EmployeeReportData = {
  employee: string;
}

type ReportType = 'sales' | 'maintenance' | 'employee';

const displaySales = (data: SalesReportData) => (
  <Box sx={{ padding: 4 }}>
    <Typography variant="h6">Sales Report</Typography>
    <Typography>Total Sales: {data.totalSales}</Typography>
    <Typography>Best Performing Ride: {data.bestRide}</Typography>
  </Box>
);

const displayMaintenance = (data: MaintenanceReportData) => (
  <Box sx={{ padding: 4 }}>
    <Typography variant="h6">Maintenance Report</Typography>
    <Typography>Ride Name: {data.rideName}</Typography>
  </Box>
);

const displayEmployee = (data: EmployeeReportData) => (
  <Box sx={{ padding: 4 }}>
    <Typography variant="h6">Employee Report</Typography>
    <Typography>Employee Name: {data.employee}</Typography>
  </Box>
);

const reportDisplayFunctions: Record<ReportType, (data: any) => JSX.Element> = {
  sales: displaySales,
  maintenance: displayMaintenance,
  // Ensure you define displayEmployee
  employee: displayEmployee, // This needs to be defined
};

const ReportingAnalytics: React.FC = () => {
  const theme = useTheme();
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [reportType, setReportType] = useState<ReportType | ''>('');
  const [reportData, setReportData] = useState<any | null>(null); // Use 'any' or a more specific type if needed

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

//handles the selection of reports from the dropdown  //hardcoded for the moment
  const handleReportTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const type = event.target.value as ReportType | '';
    setReportType(type);
  };

  const handleViewReports = () => {
    if (reportType === 'sales') {
      const salesData: SalesReportData = {
        totalSales: '100,000',
        bestRide: 'Roller Coaster',
      };
      setReportData(salesData);
    }
    else if (reportType === 'employee') {
      const employeeData: EmployeeReportData = {
        employee: 'Timmy Cha',
      };
      setReportData(employeeData)
    }
    else if (reportType === 'maintenance') {
      const maintenanceData: MaintenanceReportData = {
        rideName: 'Ferris Wheel',
      };
      setReportData(maintenanceData);
    }
  
    else {
      setReportData(null);
    }
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
      
      {reportType && reportData && reportDisplayFunctions[reportType]?.(reportData)}
      
      <Joker open={showChatbot} onClose={handleCloseChatbot} />
    </div>
  );
};

export default ReportingAnalytics;