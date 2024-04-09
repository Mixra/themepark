/*
import React, { useState } from 'react';
import { Button, IconButton, Grid, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Maintenance {
    LogID: number;
    AreaID: number;
    Type: string;
    Description: string;
    startDateTime: Date;
    endDateTime: string;
}

const initialMaintenance: Maintenance[] = [
    {
        LogID: 1,
        AreaID: 1,
        Type: 'Routine Checkup',
        Description: 'Regular maintenance checkup for equipment',
        startDateTime: new Date('2024-04-27T08:00:00'),
        endDateTime: '',
    },
    // Add more maintenance tasks as needed
];

function MaintenancePage() {
    const [maintenanceList, setMaintenanceList] = useState<Maintenance[]>(initialMaintenance);

    const addRow = () => {
        const newMaintenance: Maintenance = {
            LogID: maintenanceList.length + 1,
            AreaID: 0,
            Type: '',
            Description: '',
            startDateTime: new Date(),
            endDateTime: '',
        };
        setMaintenanceList([newMaintenance, ...maintenanceList]);
    };

    const handleChange = (index: number, field: keyof Maintenance, value: any) => {
        const updatedMaintenanceList = [...maintenanceList];
        if (field === 'startDateTime' || field === 'endDateTime') {
            updatedMaintenanceList[index][field] = new Date(value);
        } else {
            updatedMaintenanceList[index][field] = value;
        }
        setMaintenanceList(updatedMaintenanceList);
    };

    const deleteRow = (index: number) => {
        const updatedMaintenanceList = [...maintenanceList];
        updatedMaintenanceList.splice(index, 1);
        setMaintenanceList(updatedMaintenanceList);
    };

    return (
        <div>
            <Button variant="contained" onClick={addRow} style={{ marginBottom: '20px' }}>Create</Button>
            <Grid container spacing={2}>
                {maintenanceList.map((maintenance, index) => (
                    <Grid item xs={12} key={index}>
                        <Paper>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>LogID</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Start Date Time</TableCell>
                                            <TableCell>End Date Time</TableCell>
                                            <TableCell>Delete</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <TextField
                                                    value={maintenance.LogID}
                                                    onChange={(e) => handleChange(index, 'LogID', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={maintenance.Type}
                                                    onChange={(e) => handleChange(index, 'Type', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={maintenance.Description}
                                                    onChange={(e) => handleChange(index, 'Description', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="datetime-local"
                                                    value={maintenance.startDateTime}
                                                    onChange={(e) => handleChange(index, 'startDateTime', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="datetime-local"
                                                    value={maintenance.endDateTime}
                                                    onChange={(e) => handleChange(index, 'endDateTime', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <DeleteIcon onClick={() => deleteRow(index)}>Delete</DeleteIcon>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default MaintenancePage;*/



//redo all the variable names so that it doesnt go based on the park area
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmationPopup from "../../components/DeleteConfirmationPopup";
import MaintenancePopup from "../../components/MaintainencePopUp";

interface ParkArea {
    LogID: number;
    AreaID: number;
    Type: string;
    Description: string;
    startDateTime: Date;
    endDateTime: string;
}

const fakeParkAreas: ParkArea[] = [
    {
        LogID: 1,
        AreaID: 1,
        Type: 'Routine Checkup',
        Description: 'Regular maintenance checkup for equipment',
        startDateTime: new Date('2024-04-27T08:00:00'),
        endDateTime: '',
    },
    // Add more maintenance tasks as needed
];

const ParkAreaPage: React.FC = () => {
  const [parkAreas, setParkAreas] = useState<ParkArea[]>(fakeParkAreas);
  const [openPopup, setOpenPopup] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<ParkArea>>({});
  const [selectedParkArea, setSelectedParkArea] = useState<ParkArea | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  const level = Number(localStorage.getItem("level"));
  const display_crud = level === 999 ? true : false;

  const handleCreateClick = () => {
    setFormData({});
    setIsEditing(false);
    setOpenPopup(true);
  };

  const handleFormSubmit = (formData: Partial<ParkArea>) => {
    if (isEditing && selectedParkArea) {
      const updatedParkAreas = parkAreas.map((area) =>
        area.LogID === selectedParkArea.LogID ? { ...area, ...formData } : area
      );
      setParkAreas(updatedParkAreas);
    } else {
      // Generate a new ID for the new park area
      const newId = parkAreas.length + 1;

      // Create a new park area object with the form data and the new ID
      const newParkArea: ParkArea = {
        /*
        startDateTime: Date;
        endDateTime: string;
        */
        LogID: newId,
        AreaID: formData.AreaID || 0,
        Type: formData.Type || "",
        Description: formData.Description || "",
        startDateTime: formData.startDateTime || new Date('2024-04-27T08:00:00'),
        endDateTime: formData.endDateTime || "",
      };

      setParkAreas([...parkAreas, newParkArea]);
    }
    setOpenPopup(false);
  };

  const handleEditClick = (parkArea: ParkArea) => {
    setFormData(parkArea);
    setSelectedParkArea(parkArea);
    setIsEditing(true);
    setOpenPopup(true);
  };

  const handleDeleteClick = (parkArea: ParkArea) => {
    setSelectedParkArea(parkArea);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedParkArea) {
      const updatedParkAreas = parkAreas.filter(
        (area) => area.LogID !== selectedParkArea.LogID
      );
      setParkAreas(updatedParkAreas);
    }
    setOpenDeleteDialog(false);
  };
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {display_crud && (
        <Box
          sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}
        >
          <Button variant="contained" onClick={handleCreateClick}>
            Create
          </Button>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "100%",
        }}
      >
        {parkAreas.map((area) => (
          <Card
            key={area.LogID}
            sx={{
              margin: 1,
              width: 300,
              height: 660,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{
                overflowY: "auto",
                padding: 1,
                flexGrow: 1,
              }}
            >
              <Typography variant="h5" component="div" gutterBottom>
                {area.Type}
              </Typography>
              <Divider sx={{ marginY: 1 }} />
              <Typography color="text.secondary" gutterBottom>
                {area.AreaID}
              </Typography>
              <Box
                sx={{
                  maxHeight: 120,
                  minHeight: 120,
                  overflow: "auto",
                  padding: 1,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2">{area.Description}</Typography>
              </Box>
              <Divider sx={{ marginY: 1 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                
              </Box>
              <Divider sx={{ marginY: 1 }} />
            </CardContent>
            {display_crud && (
              <CardActions>
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEditClick(area)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDeleteClick(area)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            )}
          </Card>
        ))}
      </Box>
      <MaintenancePopup
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        onSubmit={handleFormSubmit}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />
      <DeleteConfirmationPopup
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default ParkAreaPage;

