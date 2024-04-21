import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
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
import {
  InventoryReport,
  InventoryReportProps,
} from "../../components/ReportTests/InventoryReport/InventoryReport";
import db from "../../components/db";

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

const salesFields = [
  { label: "Total Sales", key: "totalSales", prefix: "$", trend: "up" },
  { label: "Ride Sales", key: "rideSales", prefix: "$", trend: "down" },
  { label: "Gift Shop Sales", key: "giftShopSales", prefix: "$", trend: "up" },
  { label: "Best Ride", key: "bestRide", prefix: "", trend: "up" },
  { label: "Worst Ride", key: "leastPerformingRide", prefix: "", trend: "up" },
  { label: "Best Giftshop", key: "bestGiftshop", prefix: "", trend: "up" },
  { label: "Worst Giftshop", key: "worstGiftshop", prefix: "", trend: "up" },
];

const SaleComponentMap = {
  totalSales: Budget,
  rideSales: RideSale,
  giftShopSales: GiftShopSale,
  bestRide: BestRide,
  leastPerformingRide: WorstRide,
  bestGiftshop: BestGift,
  worstGiftshop: WorstGift,
};

type ReportType = "sales" | "maintenance" | "inventory";

const ReportingAnalytics: React.FC = () => {
  const theme = useTheme();
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [reportType, setReportType] = useState<ReportType | "">("");
  const [reportData, setReportData] = useState<InventoryReportProps | null>(
    null
  );
  const [filteredMaintenanceEntries, setFilteredMaintenanceEntries] = useState<
    MaintenanceEntry[]
  >([]);
 
  const [showOngoingOnly, setShowOngoingOnly] = useState(true);

  const [rideId, setRideId] = useState<number>();
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceEntry[]>([]);


  useEffect(() => {
    if (reportType === "maintenance" && reportData && reportData.entries) {
      setFilteredMaintenanceEntries(
        showOngoingOnly
          ? reportData.entries.filter(
              (e: MaintenanceEntry) => e.maintenanceEndDate === "Ongoing"
            )
          : reportData.entries
      );
    } else {
      setFilteredMaintenanceEntries([]);
    }
  }, [showOngoingOnly, reportData, reportType]);




  const handleReportTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setReportType(event.target.value as ReportType | "");
    setReportData(null);
  };



  const fetchSalesReport = async (startDate, endDate) => {
    if (!startDate || !endDate) return;
    const formattedStartDate = startDate.format("YYYY-MM-DD");
    const formattedEndDate = endDate.format("YYYY-MM-DD");

    try {
      const response = await db.post(`/Reports/sales`, {
        StartDate: formattedStartDate,
        EndDate: formattedEndDate,
      });
      if (!response.data || response.data.length === 0) {
        alert("No sales data available for the selected period.");
        setReportData(null);
      } else {
        setReportData(response.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch sales reports:", error);
      alert("Failed to fetch sales reports.");
    }
  };
  
  const fetchMaintenanceReport = async (startDate, endDate) => {
    if (!startDate || !endDate) return;
    const formattedStartDate = startDate.format("YYYY-MM-DD");
    const formattedEndDate = endDate.format("YYYY-MM-DD");
  
    try {
      const response = await db.post(`/Reports/rideReport`, {  // Check if this is the correct endpoint
        StartDate: formattedStartDate,
        EndDate: formattedEndDate,
      });
      if (!response.data || response.data.length === 0) {
        alert("No maintenance data available for the selected period.");
        setMaintenanceData([]);  // Make sure to reset or set an empty array if no data is available
      } else {
        setMaintenanceData(response.data);  // Assuming `response.data` is the array of maintenance entries
      }
    } catch (error) {
      console.error("Failed to fetch maintenance reports:", error);
      alert("Failed to fetch maintenance reports.");
    }
  };
  
  
  
  const fetchInventoryReport = async () => {
    try {
      const response = await db.post("/reports/inventory", {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      });

      setReportData(response.data);
    } catch (error) {
      console.error("Failed to fetch inventory report:", error);
      alert("Failed to fetch inventory report.");
    }
  };

  const handleViewReports = () => {
    if ((reportType === "sales" || reportType === "inventory"|| reportType === "maintenance" ) && (!startDate || !endDate)) {
      alert("Please select both start and end dates for the report.");
      return;
    }
    
    switch (reportType) {
      case "sales":
        fetchSalesReport(startDate, endDate);
        break;
      case "maintenance":
          //get the data from fetchInventoryHere
        
        fetchMaintenanceReport(startDate, endDate);
        break;
  
      case "inventory":
        fetchInventoryReport();
        break;
    }
  };

  const renderDatePickers = () => {
    if (reportType === "sales" || reportType === "inventory"||reportType === "maintenance") {
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
          {["sales", "maintenance", "inventory"].map((type) => (
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
        {reportType === "maintenance" && maintenanceData && (
          <LatestMaintenance entries={maintenanceData} />
        )}


        {reportType === "sales" && reportData && (
          <Box sx={{ padding: 4 }}>
            <Typography variant="h6">Sales Report</Typography>
            {salesFields.map((field) => {
              const SaleComponent = SaleComponentMap[field.key];
              if (!SaleComponent || reportData[field.key] === undefined) {
                console.log(
                  `No component or data available for key: ${field.key}`
                );
                return null;
              }
              return (
                <SaleComponent
                  key={field.key}
                  trend={field.trend}
                  value={`${field.prefix}${reportData[field.key]}`}
                  diff={Math.floor(Math.random() * 100) + 1}
                  sx={{ my: 2 }}
                />
              );
            })}
          </Box>
        )}
        {reportType === "inventory" && reportData && (
          <InventoryReport
            stores={reportData.stores}
            overallBestItem={reportData.overallBestItem}
            overallWorstItem={reportData.overallWorstItem}
          />
        )}
      </Box>
    </div>
  );
};

export default ReportingAnalytics;
