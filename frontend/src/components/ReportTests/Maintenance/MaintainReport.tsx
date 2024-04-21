import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';
import { Typography } from '@mui/material';

export interface MaintenanceEntry {
  rideID: number;
  rideName: string;
  totalClosures: number;
  lastClosure: string | null;
  avgClosureLength: number | null;
  maxTotalClosures: number;
  minTotalClosures: number;
  maxAvgClosureLength: number | null;
  minAvgClosureLength: number | null;
}

export interface LatestMaintenanceProps {
  entries: MaintenanceEntry[];
}

export function LatestMaintenance({ entries }: LatestMaintenanceProps): React.JSX.Element {
  // Assuming you calculate these values somewhere or receive them from your API
  const generalInfo = {
    maxTotalClosures: entries.reduce((max, entry) => Math.max(max, entry.maxTotalClosures), 0),
    minTotalClosures: entries.reduce((min, entry) => Math.min(min, entry.minTotalClosures), Infinity),
    maxAvgClosureLength: entries.reduce((max, entry) => Math.max(max, entry.maxAvgClosureLength ?? 0), 0),
    minAvgClosureLength: entries.reduce((min, entry) => Math.min(min, entry.minAvgClosureLength ?? Infinity), Infinity),
  };

  return (
    <Card>
      <CardHeader title="Ride Closure Reports" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Ride ID</TableCell>
              <TableCell>Ride Name</TableCell>
              <TableCell>Total Closures</TableCell>
              <TableCell>Last Closure</TableCell>
              <TableCell>Average Closure Length (Days)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.rideID}>
                <TableCell>{entry.rideID}</TableCell>
                <TableCell>{entry.rideName}</TableCell>
                <TableCell>{entry.totalClosures}</TableCell>
                <TableCell>
                  {entry.lastClosure ? dayjs(entry.lastClosure).format('MMM D, YYYY') : 'N/A'}
                </TableCell>
                <TableCell>
                  {entry.avgClosureLength !== null ? entry.avgClosureLength : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          General Ride Closure Statistics
        </Typography>
        <Typography>
          Max Total Closures: {generalInfo.maxTotalClosures}
        </Typography>
        <Typography>
          Min Total Closures: {generalInfo.minTotalClosures}
        </Typography>
        <Typography>
          Max Average Closure Length (Days): {generalInfo.maxAvgClosureLength}
        </Typography>
        <Typography>
          Min Average Closure Length (Days): {generalInfo.minAvgClosureLength}
        </Typography>
      </Box>
    </Card>
  );
}
