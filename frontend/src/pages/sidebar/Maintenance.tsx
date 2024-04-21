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
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MaintenancePopup from "../../components/MaintainencePopUp";
import { useTheme } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import db from "../../components/db";
import { AffectedEntity, Maintenance } from "../../models/maintenance.model";
import DeleteConfirmationPopup from "../../components/DeleteConfirmationPopup";

const MaintenancePage: React.FC = () => {
  const [maintenanceList, setMaintenanceList] = useState<Maintenance[]>([]);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [currentMaintenance, setCurrentMaintenance] =
    useState<Partial<Maintenance> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [maintenanceToDelete, setMaintenanceToDelete] = useState<number | null>(
    null
  );
  const theme = useTheme();

  const fetchMaintenance = useCallback(async () => {
    try {
      const { data } = await db.get("/maintenance");
      setMaintenanceList(
        data.map((item: any) => ({
          ...item,
          maintenanceStartDate: item.maintenanceStartDate,
          maintenanceEndDate: item.maintenanceEndDate || null,
          affectedEntities: item.affectedEntities
            ? item.affectedEntities.map((entity: AffectedEntity) => ({
                ...entity,
                entityName: `${entity.entityName}`,
              }))
            : [],
        }))
      );
    } catch (error) {
      console.error("Error fetching maintenance records:", error);
    }
  }, []);

  useEffect(() => {
    fetchMaintenance();
  }, [fetchMaintenance]);

  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleString(undefined, {
      dateStyle: "full",
      timeStyle: "short",
    });
  };

  const deleteRow = useCallback((maintenanceID: number) => {
    setMaintenanceToDelete(maintenanceID);
    setShowDeleteConfirmation(true);
  }, []);

  const handleDeleteConfirmed = useCallback(async () => {
    if (maintenanceToDelete !== null) {
      try {
        await db.delete(`/Maintenance/${maintenanceToDelete}`);
        setMaintenanceList((prevMaintenanceList) =>
          prevMaintenanceList.filter(
            (maintenance) => maintenance.maintenanceID !== maintenanceToDelete
          )
        );
      } catch (error) {
        console.error("Error deleting maintenance record:", error);
      } finally {
        setShowDeleteConfirmation(false);
        setMaintenanceToDelete(null);
      }
    }
  }, [maintenanceToDelete]);

  const openPopupToAdd = useCallback(() => {
    console.log("Opening popup to add new maintenance.");
    setCurrentMaintenance(null); // Ensure this is null for adding new entries
    setPopupOpen(true);
  }, []);

  const openPopupToEdit = useCallback((maintenance: Maintenance) => {
    console.log(
      "Opening popup to edit maintenance:",
      maintenance.maintenanceID
    );
    setCurrentMaintenance({
      ...maintenance,
      maintenanceStartDate: maintenance.maintenanceStartDate,
      maintenanceEndDate: maintenance.maintenanceEndDate,
    });
    setPopupOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    console.log("Closing popup.");
    setPopupOpen(false);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const getActiveMaintenance = useCallback(() => {
    return maintenanceList.filter((item) => !item.deletedAt);
  }, [maintenanceList]);

  const filteredMaintenanceList = getActiveMaintenance().filter(
    (maintenance) => {
      const maintenanceIDString = maintenance.maintenanceID.toString();
      return (
        maintenanceIDString.includes(searchTerm) ||
        maintenance.reason.toLowerCase().includes(searchTerm) ||
        maintenance.description.toLowerCase().includes(searchTerm)
      );
    }
  );

  const handleCreateMaintenance = async (formData: Partial<Maintenance>) => {
    try {
      const { data } = await db.post("/maintenance", formData);
      setMaintenanceList((prevMaintenanceList: Maintenance[]) => [
        {
          ...formData,
          maintenanceID: data.maintenanceID,
          maintenanceStartDate: formData.maintenanceStartDate,
          maintenanceEndDate: formData.maintenanceEndDate || null,
          affectedEntities: formData.affectedEntities
            ? formData.affectedEntities.map((entity) => ({
                ...entity,
                entityName: `${entity.entityName}`,
              }))
            : [],
        } as Maintenance,
        ...prevMaintenanceList,
      ]);
      setPopupOpen(false);
      setCurrentMaintenance(null);
    } catch (error) {
      console.error("Error creating maintenance record:", error);
    }
  };

  const handleEditMaintenance = async (formData: Partial<Maintenance>) => {
    try {
      await db.put(`/maintenance/${formData.maintenanceID}`, formData);
      setMaintenanceList((prevMaintenanceList: Maintenance[]) =>
        prevMaintenanceList.map((item) =>
          item.maintenanceID === formData.maintenanceID
            ? ({
                ...formData,
                maintenanceStartDate: formData.maintenanceStartDate,
                maintenanceEndDate: formData.maintenanceEndDate || null,
                affectedEntities: formData.affectedEntities
                  ? formData.affectedEntities.map((entity) => ({
                      ...entity,
                      entityName: `${entity.entityName}`,
                    }))
                  : [],
              } as Maintenance)
            : item
        )
      );
      setPopupOpen(false);
      setCurrentMaintenance(null);
    } catch (error) {
      console.error("Error updating maintenance record:", error);
    }
  };

  const handleAddOrEditMaintenance = useCallback(
    (formData: Partial<Maintenance>) => {
      if (formData.maintenanceID) {
        handleEditMaintenance(formData);
      } else {
        handleCreateMaintenance(formData);
      }
    },
    [handleCreateMaintenance, handleEditMaintenance]
  );

  const handleMaintenanceCompletion = useCallback((maintenanceID: number) => {
    setMaintenanceList((current) =>
      current.map((item) => {
        if (item.maintenanceID === maintenanceID) {
          const updatedAffectedEntities = item.affectedEntities?.map(
            (entity) => ({
              ...entity,
              closureStatus: false,
            })
          );

          return {
            ...item,
            maintenanceEndDate: new Date().toISOString(),
            affectedEntities: updatedAffectedEntities,
          };
        }
        return item;
      })
    );
  }, []);

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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMaintenanceList.map((maintenance) => (
              <React.Fragment key={maintenance.maintenanceID}>
                <TableRow>
                  <TableCell>{maintenance.maintenanceID}</TableCell>
                  <TableCell>
                    {formatTime(maintenance.maintenanceStartDate)}
                  </TableCell>
                  <TableCell>
                    {maintenance.maintenanceEndDate
                      ? formatTime(maintenance.maintenanceEndDate)
                      : "N/A"}
                  </TableCell>
                  <TableCell>{maintenance.reason}</TableCell>
                  <TableCell>{maintenance.description}</TableCell>
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
                              <TableCell>Entity Name</TableCell>
                              <TableCell>Closure Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {maintenance.affectedEntities?.map(
                              (entity, index) => (
                                <TableRow key={index}>
                                  <TableCell component="th" scope="row">
                                    {entity.entityType}
                                  </TableCell>
                                  <TableCell>{entity.entityName}</TableCell>
                                  <TableCell>
                                    {entity.closureStatus ? "Closed" : "Open"}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
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
      <DeleteConfirmationPopup
        open={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteConfirmed}
      />
    </Box>
  );
};

export default MaintenancePage;
