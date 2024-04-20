import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import Joker from "../../components/Joker";
import { useTheme } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Budget } from "../../components/ReportTests/Sales/TotalSales";
import { RideSale } from "../../components/ReportTests/Sales/RideSales";
import { GiftShopSale } from "../../components/ReportTests/Sales/GiftShopSale";
import { BestRide } from "../../components/ReportTests/Sales/BestRide";
import { WorstRide } from "../../components/ReportTests/Sales/LeastPerfomRide";
import { BestPark } from "../../components/ReportTests/Sales/BestPark";
import { WorstPark } from "../../components/ReportTests/Sales/LeastPerfPark";
import { ParkSales } from "../../components/ReportTests/Sales/totalParkSale";
import { BestGift } from "../../components/ReportTests/Sales/BestGift";
import { WorstGift } from "../../components/ReportTests/Sales/LeastPerfGift";
import { LatestMaintenance } from "../../components/ReportTests/Maintenance/MaintainReport";
import { EmployeeReport } from "../../components/ReportTests/Employee/EmployeeReport";
import db from "../../components/db";

type SalesReportData = {
  totalSales: number;
  rideSales: number;
  giftShopSales: number;
  bestRide: string;
  leastPerformingRide: string;
  bestPark: string;
  leastPerformingPark: string;
  totalParkSales: number;
  bestGiftshop: string;
  leastPerformingGiftShop: string;
};

type MaintenanceEntry = {
  entityType: string;
  entityID: string;
  maintenanceStartDate: string;
  maintenanceEndDate: string | "Ongoing";
  reason: string;
  maintenanceDescription: string;
};

type MaintenanceReportData = {
  entries: MaintenanceEntry[];
};

type EmployeeReportData = {
  username: string;
  fullName: string;
  assignedPark: string | null;
  employeeRole: string;
  employeeStatus: string;
};

//everything but the first three were new additions
const salesFields = [
  { label: "Total Sales", key: "totalSales", prefix: "$", trend: "up" },
  { label: "Ride Sales", key: "rideSales", prefix: "$", trend: "down" },
  { label: "Gift Shop Sales", key: "giftShopSales", prefix: "$", trend: "up" },
  { label: "Best Ride", key: "BestRide", prefix: "$", trend: "up" },
  { label: "Worst Ride", key: "WorstRide", prefix: "$", trend: "up" },
  { label: "Best Park", key: "BestPark", prefix: "$", trend: "up" },
  { label: "Worst Park", key: "WorstPark", prefix: "$", trend: "up" },
  { label: "Total Park Sales", key: "ParkSales", prefix: "$", trend: "up" },
  { label: "Best Giftshop Sales", key: "BestGift", prefix: "$", trend: "up" },
  { label: "Worst Giftshop Sales", key: "WorstGift", prefix: "$", trend: "up" }
];

//everything but the first three will be changed
const SaleComponentMap = {
  totalSales: Budget,
  rideSales: RideSale,
  giftShopSales: GiftShopSale,
  bestRide: BestRide,
  worstRide: WorstRide,
  bestPark: BestPark,
  worstPark: WorstPark,
  parkSales: ParkSales,
  bestGiftshop: BestGift,
  worstGift: WorstGift,
};

type ReportType = "sales" | "maintenance" | "employee";

const ReportingAnalytics: React.FC = () => {
  const theme = useTheme();
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [reportType, setReportType] = useState<ReportType | "">("");
  const [reportData, setReportData] = useState<any | null>(null);
  const [filteredMaintenanceEntries, setFilteredMaintenanceEntries] = useState<
    MaintenanceEntry[]
  >([]);
  const [filteredEmployees, setFilteredEmployees] = useState<
    EmployeeReportData[]
  >([]);
  const [showOngoingOnly, setShowOngoingOnly] = useState(true);
  const [showActiveOnly, setShowActiveOnly] = useState(true);



  useEffect(() => {
    if (reportType === "maintenance" && reportData && reportData.entries) {
      setFilteredMaintenanceEntries(
        showOngoingOnly
          ? reportData.entries.filter(
              (e: MaintenanceEntry) => e.maintenanceEndDate === "Ongoing"
            )
          : reportData.entries
      );
    } else if (
      reportType === "employee" &&
      reportData &&
      reportData.employees
    ) {
      setFilteredEmployees(
        showActiveOnly
          ? reportData.employees.filter(
              (employee: EmployeeReportData) =>
                employee.employeeStatus === "Active"
            )
          : reportData.employees
      );
    } else {
      setFilteredMaintenanceEntries([]);
      setFilteredEmployees([]);
    }
  }, [showOngoingOnly, showActiveOnly, reportData, reportType]);

  const handleReportTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setReportType(event.target.value as ReportType | "");
    setReportData(null);
  };

  //this is teh start of fetching from the database//check and see why its not printing 
  const fetchSalesReport = async (startDate, endDate) => {
    if (!startDate || !endDate) return;
  
    const formattedStartDate = startDate.format("YYYY-MM-DD");
    const formattedEndDate = endDate.format("YYYY-MM-DD");
  
    const params = new URLSearchParams({
      startDate: formattedStartDate,
      endDate: formattedEndDate
    }).toString();
  
    try {
      const response = await db.post(`/Reports/sales`, {
        StartDate: formattedStartDate,
        EndDate: formattedEndDate
      });
      setReportData(response.data);
    } catch (error) {
      console.error("Failed to fetch sales reports:", error);
      alert("Failed to fetch sales reports.");
    }
  };
  

  const fetchMaintenanceReports = async (startDate, endDate) => {
    if (!startDate) return;
    const formattedStartDate = startDate.format("YYYY-MM-DD");
    const formattedEndDate = endDate ? endDate.format("YYYY-MM-DD") : undefined;
  
    const params = new URLSearchParams({
      ...(formattedStartDate && { startDate: formattedStartDate }),
      ...(formattedEndDate && { endDate: formattedEndDate }),
    }).toString();
  
    try {
      const response = await db.get(`/Reports/maintenanceReports?${params}`);
      setReportData({ entries: response.data });
    } catch (error) {
      console.error("Failed to fetch maintenance reports:", error);
      alert("Failed to fetch maintenance reports.");
    }
  };
  
  const fetchEmployeeReports = async () => {
    try {
      const response = await db.get("/Reports/employee");
      setReportData({ employees: response.data });
    } catch (error) {
      console.error("Failed to fetch employee reports:", error);
      alert("Failed to fetch employee reports.");
    }
  };

  //this is teh end of fetching from database

  const handleViewReports = () => {
    if (reportType === "sales" && (!startDate || !endDate)) {
      alert("Please select both start and end dates for the sales report.");
      return;
    } else if (reportType === "maintenance" && !startDate) {
      alert("Please select a start date for the maintenance report.");
      return;
    }
    switch (reportType) {
      case "sales"://this is what I changed
        fetchSalesReport(startDate, endDate);
        // setReportData({
        //   totalSales: 100000,
        //   rideSales: 40000,
        //   giftShopSales: 15000,
        //   bestRide: "High Sky Adventure",
        //   leastPerformingRide: "Fairy Tale Carousel",
        //   bestPark: "FutureLand",
        //   leastPerformingPark: "FrontierLand",
        //   totalParkSales: 23222323,
        //   bestGiftShop: "fjfjff",
        //   leastPerformingGiftShop: "jfjfjf"
        // });
        break;
      case "employee":
        fetchEmployeeReports();
        break;
      case "maintenance":
        fetchMaintenanceReports(startDate, endDate);
        
        break;
    }
  };

  const renderDatePickers = () => {
    if (reportType === "sales" || reportType === "maintenance") {
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
          width: "100%",
        }}
      >
        <TextField
          select
          label="Report Type"
          value={reportType}
          onChange={handleReportTypeChange}
          sx={{ minWidth: 200 }}
        >
          {["sales", "maintenance", "employee"].map((type) => (
            <MenuItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)} Report
            </MenuItem>
          ))}
        </TextField>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {renderDatePickers()}
        </LocalizationProvider>
        <Button variant="contained" onClick={handleViewReports}>
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
          width: "100%",
        }}
      >
        {reportType && startDate && (
          <Typography sx={{ mt: 2, textAlign: "center" }}>
            Selected Date: {dayjs(startDate).format("MM/DD/YYYY")}
            {endDate && ` to ${dayjs(endDate).format("MM/DD/YYYY")}`}
          </Typography>
        )}
        {reportType === "maintenance" && (
          <>
            <FormControlLabel
              control={
                <Switch
                  checked={showOngoingOnly}
                  onChange={(e) => setShowOngoingOnly(e.target.checked)}
                />
              }
              label="Show Ongoing Only"
            />
            <LatestMaintenance entries={filteredMaintenanceEntries} />
          </>
        )}
        {reportType === "employee" && (
          <>
            <FormControlLabel
              control={
                <Switch
                  checked={showActiveOnly}
                  onChange={(e) => setShowActiveOnly(e.target.checked)}
                />
              }
              label="Show Active Only"
            />
            <EmployeeReport
              employees={filteredEmployees}
              showActiveOnly={showActiveOnly}
            />
          </>
        )}
        {reportType === "sales" && reportData && (
          <Box sx={{ padding: 4 }}>
            <Typography variant="h6">Sales Report</Typography>
            {salesFields.map((field) => {
              const SaleComponent = SaleComponentMap[field.key];
              return (
                <SaleComponent
                  key={field.key}
                  trend={field.trend as "up" | "down"}
                  value={`${field.prefix}${
                    reportData[field.key as keyof SalesReportData]
                  }`}
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
