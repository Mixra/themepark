import React, { useState, ChangeEvent } from 'react';
import { Box, Button, Typography, TextField, MenuItem } from '@mui/material';
import Joker from '../../components/Joker';
import { useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs'; // Ensure dayjs is installed
import { Budget } from '../../components/ReportTests/Sales/TotalSales';
import { RideSale } from '../../components/ReportTests/Sales/RideSales';
import { GiftShopSale } from '../../components/ReportTests/Sales/GiftShopSale';
import { RestaurantSale } from '../../components/ReportTests/Sales/RestaurauntSale';
import { LatestMaintenance } from '../../components/ReportTests/Maintenance/MaintainReport';
import { EmployeeReport } from '../../components/ReportTests/Employee/EmployeeReport';

type SalesReportData = {
  totalSales: number;
  rideSales: number;
  giftShopSales: number;
  restaurantSales: number;
  bestRide: string;
  leastPerformingRide: string;
  bestPark: string;
  leastPerformingPark: string;
};

//update so that the dates not a string if needed
type MaintenanceEntry = {
  entityType: string;
  entityID: string;
  maintenanceStartDate: string;
  maintenanceEndDate: string | 'Ongoing'; // 'Ongoing' if null
  maintenanceDescription: string;
};

type MaintenanceReportData = {
  entries: MaintenanceEntry[];
};


type EmployeeReportData = {
  employeeName: string;
  employeeID: string;
  employeePark: string;
  employeePosition: string;
  employeeActive: string | 'Active'; //active if null
};

type EmployeeData = {
  employees: EmployeeReportData[];
};

type ReportType = 'sales' | 'maintenance' | 'employee';

const salesFields = [
  { label: 'Total Sales', key: 'totalSales', prefix: '$', trend: 'up' },
  { label: 'Ride Sales', key: 'rideSales', prefix: '$', trend: 'down' },
  { label: 'Gift Shop Sales', key: 'giftShopSales', prefix: '$', trend: 'up' },
  { label: 'Restaurant Sales', key: 'restaurantSales', prefix: '$', trend: 'down' },
];

const SaleComponentMap = {
  totalSales: Budget,
  rideSales: RideSale,
  giftShopSales: GiftShopSale,
  restaurantSales: RestaurantSale,
};

const displaySales = (data: SalesReportData) => (
  <Box sx={{ padding: 4 }}>
    <Typography variant="h6">Sales Report</Typography>
    {salesFields.map((field) => {
      const SaleComponent = SaleComponentMap[field.key];  // Dynamically select the component based on field key
      return (
        <SaleComponent
          key={field.key}
          trend={field.trend as 'up' | 'down'}
          value={`${field.prefix}${data[field.key as keyof SalesReportData]}`}
          diff={Math.floor(Math.random() * 100) + 1} // Example dynamic difference
          sx={{ my: 2 }}
        />
      );
    })}
  </Box>
);

const displayMaintenance = ({ entries }: MaintenanceReportData) => (
  <Box sx={{ padding: 4, maxWidth: '1000px', margin: 'auto' }}>
    <Typography variant="h6" sx={{ mb: 2 }}>Maintenance Report</Typography>
    <LatestMaintenance entries={entries} />
  </Box>
);

const displayEmployee = ({ employees }: EmployeeData) => (
  <Box sx={{ padding: 4 }}>
    <Typography variant="h6">Employee Report</Typography>
    <EmployeeReport employees={employees} />
  </Box>
);

const reportDisplayFunctions: Record<ReportType, (data: any) => JSX.Element> = {
  sales: displaySales,
  maintenance: displayMaintenance,
  employee: displayEmployee,
};

const ReportingAnalytics: React.FC = () => {
  const theme = useTheme();
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [reportType, setReportType] = useState<ReportType | ''>('');
  const [reportData, setReportData] = useState<any | null>(null);

  const handleReportTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setReportType(event.target.value as ReportType | '');
  };

  const handleViewReports = () => {//this is where i will make the changes to get the data from the db
    if (reportType === 'sales' && (!startDate || !endDate)) {
      alert("Please select both start and end dates for the sales report.");
      return;
  } else if (reportType === 'maintenance' && !startDate) {
      alert("Please select a start date for the maintenance report.");
      return;
  }
    switch (reportType) {
      case 'sales':
        const salesData: SalesReportData = {
          totalSales: 100000,
          rideSales: 40000,
          giftShopSales: 15000,
          restaurantSales: 45000,
          bestRide: 'High Sky Adventure',
          leastPerformingRide: 'Fairy Tale Carousel',
          bestPark: 'FutureLand',
          leastPerformingPark: 'FrontierLand',
        };
        setReportData(salesData);
        break;
      case 'employee':
        const employeeData: EmployeeData = {
          employees: [
            {
              employeeName: 'Timmy Chra',
              employeeID: '2dd4dg4g',
              employeePark: 'FutureLand',
              employeePosition: 'Manager',
              employeeActive: 'Active'
            },
            {
              employeeName: 'Billy Baker',
              employeeID: '1145ffds',
              employeePark: 'FrontierLand',
              employeePosition: 'Admin',
              employeeActive: 'Inactive'
            }
          ]
        };
        setReportData(employeeData);
        break;
      case 'maintenance':
        const maintenanceData: MaintenanceReportData = {
          entries: [
            {
              entityType: 'Roller Coaster',
              entityID: 'RC101',
              maintenanceStartDate: '2024-04-12',
              maintenanceEndDate: '2024-04-14',
              maintenanceDescription: 'Routine annual maintenance check and safety verification.'
            },
            {
              entityType: 'Water Slide',
              entityID: 'WS205',
              maintenanceStartDate: '2024-04-13',
              maintenanceEndDate: 'Ongoing',
              maintenanceDescription: 'Replacement of water pumps and slide surface resealing due to unexpected leakage.'
            },
          ]
          };
          setReportData(maintenanceData);
          break;
        
      default:
        setReportData(null);
    }
  };

  return (
    <div>
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <Typography variant="body1">
          Can't find what you're looking for?{" "}
          <Button onClick={() => setShowChatbot(true)}>Try asking Joker</Button>
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
          {['sales', 'maintenance', 'employee'].map((type) => (
            <MenuItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)} Report
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
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          padding: 4,
          width: "100%"
        }}
      >
      {reportType === 'sales' && startDate && endDate && (
          <Typography sx={{ mt:2, textAlign: 'center' }}>
            Selected Dates: {dayjs(startDate).format('MM/DD/YYYY')} to {dayjs(endDate).format('MM/DD/YYYY')}
          </Typography>
        )}
      {reportType === 'maintenance' && startDate && (
          <Typography sx={{ mt:2, textAlign: 'center' }}>
            Selected Date: {dayjs(startDate).format('MM/DD/YYYY')}
          </Typography>
      )}
      {reportType && reportData && reportDisplayFunctions[reportType](reportData)}
      </Box>
      
      <Joker open={showChatbot} onClose={() => setShowChatbot(false)} />
    </div>
  );
};

export default ReportingAnalytics;