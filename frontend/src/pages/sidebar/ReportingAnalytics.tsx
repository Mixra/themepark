import React, { useState, ChangeEvent, useEffect } from 'react';
import { Box, Button, Typography, TextField, MenuItem, FormControlLabel, Switch } from '@mui/material';
import Joker from '../../components/Joker';
import { useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Budget } from '../../components/ReportTests/Sales/TotalSales';
import { RideSale } from '../../components/ReportTests/Sales/RideSales';
import { GiftShopSale } from '../../components/ReportTests/Sales/GiftShopSale';
//import { RestaurantSale } from '../../components/ReportTests/Sales/RestaurantSale';
import { LatestMaintenance } from '../../components/ReportTests/Maintenance/MaintainReport';
import { EmployeeReport } from '../../components/ReportTests/Employee/EmployeeReport';
import db from '../../components/db';

type SalesReportData = {
  totalSales: number;
  rideSales: number;
  giftShopSales: number;
  bestRide: string;
  leastPerformingRide: string;
  bestPark: string;
  leastPerformingPark: string;
};

type MaintenanceEntry = {
  entityType: string;
  entityID: string;
  maintenanceStartDate: string;
  maintenanceEndDate: string | 'Ongoing';
  maintenanceDescription: string;
};

type MaintenanceReportData = {
  entries: MaintenanceEntry[];
};

type EmployeeReportData = {
  employeeName: string;
  employeePark: string;
  employeePosition: string;
  employeeActive: string | 'Active';
};

const salesFields = [
  { label: 'Total Sales', key: 'totalSales', prefix: '$', trend: 'up' },
  { label: 'Ride Sales', key: 'rideSales', prefix: '$', trend: 'down' },
  { label: 'Gift Shop Sales', key: 'giftShopSales', prefix: '$', trend: 'up' },
];

const SaleComponentMap = {
  totalSales: Budget,
  rideSales: RideSale,
  giftShopSales: GiftShopSale,
  restaurantSales: RestaurantSale,
};

type ReportType = 'sales' | 'maintenance' | 'employee';

const ReportingAnalytics: React.FC = () => {
  const theme = useTheme();
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [reportType, setReportType] = useState<ReportType | ''>('');
  const [reportData, setReportData] = useState<any | null>(null);
  const [filteredMaintenanceEntries, setFilteredMaintenanceEntries] = useState<MaintenanceEntry[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeReportData[]>([]);
  const [showOngoingOnly, setShowOngoingOnly] = useState(true);
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  useEffect(() => {
    if (reportType === 'maintenance' && reportData && reportData.entries) {
      setFilteredMaintenanceEntries(
        showOngoingOnly ? reportData.entries.filter((e: MaintenanceEntry) => e.maintenanceEndDate === 'Ongoing') : reportData.entries
      );
    } else if (reportType === 'employee' && reportData && reportData.employees) {
      setFilteredEmployees(
        showActiveOnly ? reportData.employees.filter((e: EmployeeReportData) => e.employeeActive === 'Active') : reportData.employees
      );
    } else {
      setFilteredMaintenanceEntries([]);
      setFilteredEmployees([]);
    }
  }, [showOngoingOnly, showActiveOnly, reportData, reportType]);

  const handleReportTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setReportType(event.target.value as ReportType | '');
    setReportData(null);
  };

  const fetchMaintenanceReports = async (startDate: dayjs.Dayjs | null) => {
    if (!startDate) return;
    try {
      const response = await db.get(`/maintenance?startDate=${startDate.format('YYYY-MM-DD')}`);
      setReportData({ entries: response.data });
    } catch (error) {
      console.error('Failed to fetch maintenance reports:', error);
      alert('Failed to fetch maintenance reports.');
    }
  };

  const handleViewReports = () => {
    if (reportType === 'sales' && (!startDate || !endDate)) {
      alert("Please select both start and end dates for the sales report.");
      return;
    } else if (reportType === 'maintenance' && !startDate) {
      alert("Please select a start date for the maintenance report.");
      return;
    }
    switch (reportType) {
      case 'sales':
        setReportData({
          totalSales: 100000,
          rideSales: 40000,
          giftShopSales: 15000,
          bestRide: 'High Sky Adventure',
          leastPerformingRide: 'Fairy Tale Carousel',
          bestPark: 'FutureLand',
          leastPerformingPark: 'FrontierLand',
        });
        break;
      case 'employee':
        setReportData({
          employees: [
            {
              employeeName: 'Timmy Chra',
              employeePark: 'FutureLand',
              employeePosition: 'Manager',
              employeeActive: 'Active'
            },
            {
              employeeName: 'Billy Baker',
              employeePark: 'FrontierLand',
              employeePosition: 'Admin',
              employeeActive: 'Inactive'
            }
          ]
        });
        break;
      case 'maintenance':
        fetchMaintenanceReports(startDate);
        break;
    }
  };

  const renderDatePickers = () => {
    if (reportType === 'sales') {
      return (
        <>
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
        </>
      );
    } else if (reportType === 'maintenance') {
      return (
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={setStartDate}
          renderInput={(params) => <TextField {...params} />}
        />
      );
    }
    return null;
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {renderDatePickers()}
        </LocalizationProvider>
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
        {reportType && startDate && (
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            Selected Date: {dayjs(startDate).format('MM/DD/YYYY')}
            {endDate && ` to ${dayjs(endDate).format('MM/DD/YYYY')}`}
          </Typography>
        )}
        {reportType === 'maintenance' && (
          <>
            <FormControlLabel
              control={<Switch checked={showOngoingOnly} onChange={(e) => setShowOngoingOnly(e.target.checked)} />}
              label="Show Ongoing Only"
            />
            <LatestMaintenance entries={filteredMaintenanceEntries} />
          </>
        )}
        {reportType === 'employee' && (
          <>
            <FormControlLabel
              control={<Switch checked={showActiveOnly} onChange={(e) => setShowActiveOnly(e.target.checked)} />}
              label="Show Active Only"
            />
            <EmployeeReport employees={filteredEmployees} />
          </>
        )}
        {reportType === 'sales' && reportData && (
          <Box sx={{ padding: 4 }}>
            <Typography variant="h6">Sales Report</Typography>
            {salesFields.map((field) => {
              const SaleComponent = SaleComponentMap[field.key];
              return (
                <SaleComponent
                  key={field.key}
                  trend={field.trend as 'up' | 'down'}
                  value={`${field.prefix}${reportData[field.key as keyof SalesReportData]}`}
                  diff={Math.floor(Math.random() * 100) + 1}
                  sx={{ my: 2 }}
                />
              );
            })}
          </Box>
        )}
      </Box>
      <Joker open={showChatbot} onClose={() => setShowChatbot(false)} />
    </div>
  );
};

export default ReportingAnalytics;
