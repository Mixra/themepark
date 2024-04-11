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
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MaintenancePopup from '../../components/MaintainencePopUp';
import { useTheme } from '@emotion/react';

interface Maintenance {
    LogID: number;
    AreaID: number;
    Type: string;
    //AreasAffected: string,
    Description: string;
    StartDateTime: Date;
    EndDateTime: Date;
}

const initialMaintenance: Maintenance[] = [
    {
        LogID: 1,
        AreaID: 1,
        Type: 'Routine Checkup',
        //AreasAffected: 'WonderLand',
        Description: 'Regular maintenance checkup for equipment',
        StartDateTime: new Date('2024-04-27T08:00:00'),
        EndDateTime: new Date('2024-04-27T10:00:00'),
    },
    // Additional initial maintenance logs
];

const MaintenancePage: React.FC = () => {
    const [maintenanceList, setMaintenanceList] = useState<Maintenance[]>(initialMaintenance);
    const [popupOpen, setPopupOpen] = useState<boolean>(false);
    const [currentMaintenance, setCurrentMaintenance] = useState<Partial<Maintenance> | null>(null);
    const theme = useTheme();
    const openPopupToAdd = useCallback(() => {
        setCurrentMaintenance(null);
        setPopupOpen(true);
    }, []);

    const openPopupToEdit = useCallback((maintenance: Maintenance) => {
        setCurrentMaintenance(maintenance);
        setPopupOpen(true);
    }, []);

    const closePopup = useCallback(() => {
        setPopupOpen(false);
    }, []);

    const handleAddOrEditMaintenance = useCallback((maintenance: Partial<Maintenance>) => {
        const updatedOrNewMaintenance = {
            ...currentMaintenance,
            ...maintenance,
            LogID: currentMaintenance?.LogID ?? maintenanceList.reduce((max, item) => Math.max(max, item.LogID), 0) + 1,
            StartDateTime: new Date(maintenance.StartDateTime || new Date()),
            EndDateTime: new Date(maintenance.EndDateTime || new Date()),
        };

        if (currentMaintenance) {
            const updatedList = maintenanceList.map((item) =>
                item.LogID === currentMaintenance.LogID ? updatedOrNewMaintenance as Maintenance : item
            );
            setMaintenanceList(updatedList);
        } else {
            setMaintenanceList(prevList => [...prevList, updatedOrNewMaintenance as Maintenance]);
        }
        closePopup();
    }, [currentMaintenance, maintenanceList, closePopup]);

    const deleteRow = useCallback((logID: number) => {
        setMaintenanceList(current => current.filter(item => item.LogID !== logID));
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
          <Button variant="contained" onClick={openPopupToAdd} sx={{ mb: 2 }}>Add Maintenance</Button>
        </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Log ID</TableCell>
                            <TableCell>Area ID</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Areas Affected</TableCell>
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
            )}
        </Box>
    );
};

export default MaintenancePage;
