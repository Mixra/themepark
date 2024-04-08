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

export default MaintenancePage;