import React, { useState, useCallback, useEffect } from "react";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MaintenancePopup from "../../components/MaintainencePopUp";
import { useTheme } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import db from "../../components/db";
import {Maintenance, AffectedEntity } from "../../models/maintenance.model";

const MaintenancePage: React.FC = () => {
const [maintenanceList, setMaintenanceList] = useState<Maintenance[]>([]);
const [popupOpen, setPopupOpen] = useState<boolean>(false);
const [currentMaintenance, setCurrentMaintenance] = useState<Partial<Maintenance> | null>(null);
const [searchTerm, setSearchTerm] = useState("");
const [filterByClosure, setFilterByClosure] = useState("");
const [sortDirection, setSortDirection] = useState("asc");
const theme = useTheme();

const fetchMaintenance = useCallback(async () => {
  try {
    const { data } = await db.get("/maintenance/maintenance");
    console.log("API Data:", data);
    const formattedData = data ? data.map((item: any) => ({
      ...item,
      maintenanceStartDate: new Date(item.maintenanceStartDate),
      maintenanceEndDate: item.maintenanceEndDate ? new Date(item.maintenanceEndDate) : null,
      affectedEntities: item.affectedEntities ? item.affectedEntities.map(entity => ({
        ...entity,
        entityName: entity.entityType + ' ' + entity.entityID
      })) : []
    })) : [];
    setMaintenanceList(formattedData);
  } catch (error) {
    console.error("Error fetching maintenance records:", error);
  }
}, []);


useEffect(() => {
  fetchMaintenance();
}, [fetchMaintenance]);


const handleOpenPopup = (maintenance?: Maintenance) => {
  setCurrentMaintenance(maintenance || null); // Pass null for new maintenance
  setPopupOpen(true);
};

const handleClosePopup = () => {
  setPopupOpen(false);
};

const handleSaveMaintenance = async (formData: Partial<Maintenance>) => {
  const endpoint = formData.maintenanceID ? `/maintenance/${formData.maintenanceID}` : "/api/maintenance";
  const method = formData.maintenanceID ? "put" : "post";

  try {
    const { data } = await db[method](endpoint, formData);
    console.log(data.message); // Display success message
    fetchMaintenance(); // Refresh list after save
  } catch (error) {
    console.error("Error saving maintenance record:", error);
  }

  handleClosePopup();
};

const handleDeleteMaintenance = async (maintenanceID) => {
  try {
    await db.delete(`/Maintenance/maintenance/${maintenanceID}`);
    setMaintenanceList((prevMaintenanceList) =>
      prevMaintenanceList.filter(
        (maintenance) => maintenance.maintenanceID !== maintenanceID
      )
    );
    // Close any dialogs or popups if necessary, e.g.:
    // setOpenDeleteDialog(false);
  } catch (error) {
    console.error("Error deleting maintenance record:", error);
  }
};

  const openPopupToAdd = useCallback(() => {
    console.log("Opening popup to add new maintenance.");
    setCurrentMaintenance(null); // Ensure this is null for adding new entries
    setPopupOpen(true);
  }, []);

  const toggleSort = useCallback(() => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const openPopupToEdit = useCallback((maintenance) => {
    console.log(
      "Opening popup to edit maintenance:",
      maintenance.maintenanceID
    );
    setCurrentMaintenance({
      ...maintenance,
      maintenanceStartDate: new Date(maintenance.maintenanceStartDate),
      maintenanceEndDate: maintenance.maintenanceEndDate
        ? new Date(maintenance.maintenanceEndDate)
        : null,
    });
    setPopupOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    console.log("Closing popup.");
    setPopupOpen(false);
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleFilterChange = (event) => {
    setFilterByClosure(event.target.value);
  };

  const getActiveMaintenance = useCallback(() => {
    return maintenanceList.filter((item) => !item.DeletedAt);
  }, [maintenanceList]);

  const filteredMaintenanceList = getActiveMaintenance().filter(maintenance => {
    const maintenanceIDString = maintenance.maintenanceID.toString();
    return (
      maintenanceIDString.includes(searchTerm) ||
      maintenance.reason.toLowerCase().includes(searchTerm) ||
      maintenance.description.toLowerCase().includes(searchTerm)
    ) && (
      filterByClosure === "" ||
      (filterByClosure === "yes" && maintenance.requireClosure) ||
      (filterByClosure === "no" && !maintenance.requireClosure)
    );
  });
  
  const handleCreateMaintenance = async (formData) => {
    try {
      // If you need to adjust formData before sending, do it here
      const { data } = await db.post("/maintenance/maintenance", formData);
      
      // Assuming 'data' returned by your backend contains the new maintenance record,
      // including its 'maintenanceID' assigned by the server
      setMaintenanceList(prevMaintenanceList => [...prevMaintenanceList, data]);
      
      // Close the popup and reset any state as needed
      setPopupOpen(false);
      setCurrentMaintenance(null);
    } catch (error) {
      console.error("Error creating maintenance record:", error);
    }
  };

  const handleEditMaintenance = async (formData) => {
    try {
      // Make sure formData includes 'maintenanceID' of the maintenance you're editing
      const { data } = await db.put(`maintenance/maintenance/${formData.maintenanceID}`, formData);
  
      // Assuming 'data' returned by your backend is the updated maintenance record
      setMaintenanceList((prevMaintenanceList) =>
        prevMaintenanceList.map((maintenance) =>
          maintenance.maintenanceID === data.maintenanceID ? data : maintenance
        )
      );
      
      // Close the popup and reset any state as needed
      setPopupOpen(false);
      setCurrentMaintenance(null);
    } catch (error) {
      console.error("Error updating maintenance record:", error);
    }
  };
  const handleAddOrEditMaintenance = useCallback(
    (formData: Partial<Maintenance>) => {
      // Determine if we are adding or editing based on if 'maintenanceID' is present
      if (formData.maintenanceID) {
        handleEditMaintenance(formData); // Edit existing record
      } else {
        handleCreateMaintenance(formData); // Create new record
      }
    },
    // Add any other dependencies for these functions if needed
    [handleCreateMaintenance, handleEditMaintenance]
  );

  const deleteRow = useCallback((maintenanceID: number) => {
    setMaintenanceList((current) =>
      current.map((item) =>
        item.maintenanceID === maintenanceID
          ? {
              ...item,
              DeletedAt: new Date(),
            }
          : item
      )
    );
  }, []);

  const handleMaintenanceCompletion = useCallback((maintenanceID: number) => {
    setMaintenanceList((current) =>
      current.map((item) => {
        if (item.maintenanceID === maintenanceID) {
          // Update the affected entities to reopen them
          const updatedAffectedEntities = item.affectedEntities.map(
            (entity) => ({
              ...entity,
              closureStatus: false,
            })
          );

          return {
            ...item,
            MaintenanceEndDate: new Date(),
            AffectedEntities: updatedAffectedEntities,
          };
        }
        return item;
      })
    );
  }, []);

  const [visibleColumns, setVisibleColumns] = useState({
    maintenanceID: true,
    startDate: true,
    endDate: true,
    reason: true,
    description: true,
    requireClosure: true,
    actions: true,
  });

  const toggleColumnVisibility = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  return (
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
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Button variant="contained" onClick={openPopupToAdd} sx={{ mb: 2 }}>
          Add Maintenance
        </Button>
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          onChange={handleSearchChange}
          sx={{ mr: 2 }}
        />
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Require Closure</InputLabel>
          <Select
            value={filterByClosure}
            onChange={handleFilterChange}
            label="Require Closure"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Maintenance ID</TableCell>
              <TableCell>Start Date Time</TableCell>
              <TableCell>End Date Time</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Require Closure</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMaintenanceList.map((maintenance) => (
              <React.Fragment key={maintenance.maintenanceID}>
                <TableRow>
                  <TableCell>{maintenance.maintenanceID}</TableCell>
                  <TableCell>
                    {maintenance.maintenanceStartDate.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {maintenance.maintenanceEndDate
                      ? maintenance.maintenanceEndDate.toLocaleString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>{maintenance.reason}</TableCell>
                  <TableCell>{maintenance.description}</TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={maintenance.requireClosure}
                          disabled
                          color="primary"
                        />
                      }
                      label={maintenance.requireClosure ? "Yes" : "No"}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => openPopupToEdit(maintenance)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => deleteRow(maintenance.maintenanceID)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    {maintenance.maintenanceEndDate ? null : (
                      <IconButton
                        onClick={() =>
                          handleMaintenanceCompletion(maintenance.maintenanceID)
                        }
                      >
                        <CheckIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={9}
                  >
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>Affected Entities</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Table size="small" aria-label="purchases">
                          <TableHead>
                            <TableRow>
                              <TableCell>Entity Type</TableCell>
                              <TableCell>Entity ID</TableCell>
                              <TableCell>Closure Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
  {maintenance.affectedEntities.map((entity, index) => (
    <TableRow key={index}>
      <TableCell component="th" scope="row">
        {entity.entityType}
      </TableCell>
      <TableCell>{entity.entityID}</TableCell>
      <TableCell>
        {entity.closureStatus ? "Closed" : "Open"}
      </TableCell>
    </TableRow>
  ))}
</TableBody>
                        </Table>
                      </AccordionDetails>
                    </Accordion>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {popupOpen && (
    <MaintenancePopup
      open={popupOpen}
      onClose={closePopup}
      onSubmit={handleAddOrEditMaintenance}
      formData={currentMaintenance || {}}
      isEditing={!!currentMaintenance?.maintenanceID}
    />
  )}
    </Box>
  );
};

export default MaintenancePage;
