/*<TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Log ID</TableCell>
                            <TableCell>Area ID</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Start Date Time</TableCell>
                            <TableCell>End Date Time</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {maintenanceList.map((maintenance) => (
                            <TableRow key={maintenance.LogID}>
                                <TableCell>{maintenance.LogID}</TableCell>
                                <TableCell>{maintenance.AreaID}</TableCell>
                                <TableCell>{maintenance.Type}</TableCell>
                                <TableCell>{maintenance.Description}</TableCell>
                                <TableCell>{maintenance.StartDateTime.toLocaleString()}</TableCell>
                                <TableCell>{maintenance.EndDateTime.toLocaleString()}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => openPopupToEdit(maintenance)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => deleteRow(maintenance.LogID)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
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
                />
            )}*/
import React, { useState, useCallback } from 'react';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Accordion, AccordionSummary, AccordionDetails, Typography, MenuItem, InputLabel, FormControl, Select, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MaintenancePopup from '../../components/MaintainencePopUp';
import { useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
            
interface AffectedEntity {
  entityType: string;
  entityId: number;
  closureStatus: boolean;
}
            
interface Maintenance {
  MaintenanceID: number;
  MaintenanceStartDate: Date;
  MaintenanceEndDate?: Date;
  Reason: string;
  Description: string;
  RequireClosure: boolean;
  AffectedEntities: AffectedEntity[];
}
            
const initialMaintenance: Maintenance[] = [
  {
      MaintenanceID: 1,
      MaintenanceStartDate: new Date('2024-04-27T08:00:00'),
      MaintenanceEndDate: new Date('2024-04-27T10:00:00'),
      Reason: 'Routine Checkup',
      Description: 'Regular maintenance checkup for equipment',
      RequireClosure: false,
      AffectedEntities: [
          { entityType: 'GiftShop', entityId: 2, closureStatus: true },
          { entityType: 'Restaurant', entityId: 3, closureStatus: false }
      ],
  },
  {
      MaintenanceID: 2,
      MaintenanceStartDate: new Date('2024-04-27T08:00:00'),
      MaintenanceEndDate: new Date('2024-04-27T10:00:00'),
      Reason: 'Routine Checkup',
      Description: 'Regular maintenance checkup for equipment',
      RequireClosure: true,
      AffectedEntities: [
          { entityType: 'GiftShop', entityId: 2, closureStatus: true },
          { entityType: 'Restaurant', entityId: 3, closureStatus: false }
      ],
  },
  // Additional initial maintenance logs
];
            
const MaintenancePage: React.FC = () => {
  const [maintenanceList, setMaintenanceList] = useState<Maintenance[]>(initialMaintenance);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [currentMaintenance, setCurrentMaintenance] = useState<Partial<Maintenance> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByClosure, setFilterByClosure] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const theme = useTheme();

  const openPopupToAdd = useCallback(() => {
      console.log("Opening popup to add new maintenance.");
      setCurrentMaintenance(null);  // Ensure this is null for adding new entries
      setPopupOpen(true);
  }, []);

  const toggleSort = useCallback(() => {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  const openPopupToEdit = useCallback((maintenance) => {
      console.log("Opening popup to edit maintenance:", maintenance.MaintenanceID);
      setCurrentMaintenance({
          ...maintenance,
          MaintenanceStartDate: new Date(maintenance.MaintenanceStartDate),
          MaintenanceEndDate: maintenance.MaintenanceEndDate ? new Date(maintenance.MaintenanceEndDate) : null
      });
      setPopupOpen(true);
  }, []);
  
  const closePopup = useCallback(() => {
      console.log("Closing popup.");
      setPopupOpen(false);
  }, []);

  const handleSearchChange = event => {
      setSearchTerm(event.target.value.toLowerCase());
  };
  
  const handleFilterChange = event => {
      setFilterByClosure(event.target.value);
  };
  
  const filteredMaintenanceList = maintenanceList.filter(maintenance => {
      const maintenanceIDString = maintenance.MaintenanceID.toString();
      return (
          maintenanceIDString.includes(searchTerm) ||
          maintenance.Reason.toLowerCase().includes(searchTerm) ||
          maintenance.Description.toLowerCase().includes(searchTerm)
      ) && (filterByClosure === '' || (filterByClosure === 'yes' && maintenance.RequireClosure) || (filterByClosure === 'no' && !maintenance.RequireClosure));
  });

  const handleAddOrEditMaintenance = useCallback((formData: Partial<Maintenance>) => {
      if (formData.MaintenanceID) {
          // Edit mode
          setMaintenanceList(current => current.map(item =>
              item.MaintenanceID === formData.MaintenanceID ? { ...item, ...formData, MaintenanceStartDate: new Date(formData.MaintenanceStartDate!), MaintenanceEndDate: formData.MaintenanceEndDate ? new Date(formData.MaintenanceEndDate) : undefined } : item
          ));
      } else {
          // Add mode
          const newMaintenance = {
              ...formData,
              MaintenanceID: maintenanceList.reduce((max, item) => Math.max(max, item.MaintenanceID), 0) + 1,
              MaintenanceStartDate: new Date(formData.MaintenanceStartDate!),
              MaintenanceEndDate: formData.MaintenanceEndDate ? new Date(formData.MaintenanceEndDate) : undefined
          } as Maintenance;
          setMaintenanceList(current => [...current, newMaintenance]);
      }
      closePopup();
  }, [closePopup, maintenanceList]);

  const deleteRow = useCallback((MaintenanceID: number) => {
      setMaintenanceList(current => current.filter(item => item.MaintenanceID !== MaintenanceID));
  }, []);

  const [visibleColumns, setVisibleColumns] = useState({
      maintenanceID: true,
      startDate: true,
      endDate: true,
      reason: true,
      description: true,
      requireClosure: true,
      actions: true
  });
  
  const toggleColumnVisibility = (column) => {
      setVisibleColumns(prev => ({
          ...prev,
          [column]: !prev[column]
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
          <Button variant="contained" onClick={openPopupToAdd} sx={{ mb: 2 }}>Add Maintenance</Button>

      </Box>
      <Box sx={{ width: "100%", maxWidth: 1200, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
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
              <React.Fragment key={maintenance.MaintenanceID}>
                <TableRow>
                  <TableCell>{maintenance.MaintenanceID}</TableCell>
                  <TableCell>{maintenance.MaintenanceStartDate.toLocaleString()}</TableCell>
                  <TableCell>{maintenance.MaintenanceEndDate ? maintenance.MaintenanceEndDate.toLocaleString() : 'N/A'}</TableCell>
                  <TableCell>{maintenance.Reason}</TableCell>
                  <TableCell>{maintenance.Description}</TableCell>
                  <TableCell>
                    {maintenance.RequireClosure ? <CheckIcon style={{ color: 'green' }} /> : <CloseIcon style={{ color: 'red' }} />}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => openPopupToEdit(maintenance)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteRow(maintenance.MaintenanceID)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
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
                            {maintenance.AffectedEntities.map((entity, index) => (
                              <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                  {entity.entityType}
                                </TableCell>
                                <TableCell>{entity.entityId}</TableCell>
                                <TableCell>{entity.closureStatus ? 'Closed' : 'Open'}</TableCell>
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
          isEditing={!!currentMaintenance?.MaintenanceID}
      />
      
      )}
    </Box>
  );
};
            
export default MaintenancePage;