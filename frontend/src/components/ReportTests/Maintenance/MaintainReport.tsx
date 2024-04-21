import * as React from 'react';
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

export interface MaintenanceEntry {
  rideID: number;
  rideName: string;
  totalClosures: number;
  lastClosure: Date;
  averageClosureLengthDays: number;
  maxTotalClosures: number;
  minTotalClosures: number;
  maxAvgClosureLength: number;
  minAvgClosureLength: number;
}

export interface LatestMaintenanceProps {
  entries: MaintenanceEntry[];
}

export function LatestMaintenance({ entries }: LatestMaintenanceProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader title="Ride Closure Reports" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Ride Id</TableCell>
              <TableCell>Ride Name</TableCell>
              <TableCell>Total Closures</TableCell>
              <TableCell>Last Closure</TableCell>
              <TableCell>Average Closure Length (Days)</TableCell>
              <TableCell>Max Total Closures</TableCell>
              <TableCell>Min Total Closures</TableCell>
              <TableCell>Max Avg Closure Length (Days)</TableCell>
              <TableCell>Min Avg Closure Length (Days)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.rideID}>
                <TableCell>{entry.rideID}</TableCell>
                <TableCell>{entry.rideName}</TableCell>
                <TableCell>{entry.totalClosures}</TableCell>
                <TableCell>{dayjs(entry.lastClosure).format('MMM D, YYYY')}</TableCell>
                <TableCell>{entry.averageClosureLengthDays}</TableCell>
                <TableCell>{entry.maxTotalClosures}</TableCell>
                <TableCell>{entry.minTotalClosures}</TableCell>
                <TableCell>{entry.maxAvgClosureLength}</TableCell>
                <TableCell>{entry.minAvgClosureLength}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}
