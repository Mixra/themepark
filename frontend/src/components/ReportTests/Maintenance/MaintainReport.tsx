import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';

export interface MaintenanceEntry {
  rideId: number;
  rideName: string;
  totalClosures: number;
  lastClosure: Date;
  averageClosureLengthDays: number;
}

export interface LatestMaintenanceProps {
  entries?: MaintenanceEntry[];
  sx?: SxProps;
}

export function LatestMaintenance({ entries = [], sx }: LatestMaintenanceProps): React.JSX.Element {
  function getMostClosures(entries: MaintenanceEntry[]): { rideId: number; rideName: string; totalClosures: number } {
    let maxClosures = 0;
    let result: { rideId: number; rideName: string; totalClosures: number } = { rideId: 0, rideName: '', totalClosures: 0 };
    entries.forEach((entry) => {
      if (entry.totalClosures > maxClosures) {
        maxClosures = entry.totalClosures;
        result = { rideId: entry.rideId, rideName: entry.rideName, totalClosures: maxClosures };
      }
    });
    return result;
}

function getLeastClosures(entries: MaintenanceEntry[]): { rideId: number; rideName: string; totalClosures: number } {
    if (entries.length === 0) return { rideId: 0, rideName: '', totalClosures: 0 };
    let minClosures = entries[0].totalClosures;
    let result: { rideId: number; rideName: string; totalClosures: number } = { rideId: entries[0].rideId, rideName: entries[0].rideName, totalClosures: minClosures };
    entries.forEach((entry) => {
      if (entry.totalClosures < minClosures) {
        minClosures = entry.totalClosures;
        result = { rideId: entry.rideId, rideName: entry.rideName, totalClosures: minClosures };
      }
    });
    return result;
}

function getHighestAverage(entries: MaintenanceEntry[]): { rideId: number; rideName: string; averageClosureLengthDays: number } {
    if (entries.length === 0) return { rideId: 0, rideName: '', averageClosureLengthDays: 0 };
    let maxAverage = entries[0].averageClosureLengthDays;
    let result: { rideId: number; rideName: string; averageClosureLengthDays: number } = { rideId: entries[0].rideId, rideName: entries[0].rideName, averageClosureLengthDays: maxAverage };
    entries.forEach((entry) => {
      if (entry.averageClosureLengthDays > maxAverage) {
        maxAverage = entry.averageClosureLengthDays;
        result = { rideId: entry.rideId, rideName: entry.rideName, averageClosureLengthDays: maxAverage };
      }
    });
    return result;
}

function getLowestAverage(entries: MaintenanceEntry[]): { rideId: number; rideName: string; averageClosureLengthDays: number } {
    if (entries.length === 0) return { rideId: 0, rideName: '', averageClosureLengthDays: 0 };
    let minAverage = entries[0].averageClosureLengthDays;
    let result: { rideId: number; rideName: string; averageClosureLengthDays: number } = { rideId: entries[0].rideId, rideName: entries[0].rideName, averageClosureLengthDays: minAverage };
    entries.forEach((entry) => {
      if (entry.averageClosureLengthDays < minAverage) {
        minAverage = entry.averageClosureLengthDays;
        result = { rideId: entry.rideId, rideName: entry.rideName, averageClosureLengthDays: minAverage };
      }
    });
    return result;
}

  
  
  return (
    <Card sx={sx}>
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
              <TableCell>Average Closure Length (In Days)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow hover key={entry.rideId}>
                <TableCell>{entry.rideId}</TableCell>
                <TableCell>{entry.rideName}</TableCell>
                <TableCell>{entry.totalClosures}</TableCell>
                <TableCell>{dayjs(entry.lastClosure).format('MMM D, YYYY')}</TableCell>
                <TableCell>{entry.averageClosureLengthDays}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      


      <Box sx={{ overflowX: 'auto', mt: 2 }}>
      <CardHeader title="Ride Closure Stats" />
  <Table sx={{ minWidth: 400 }}>
  <TableHead>
    <TableRow>
      <TableCell>Statistic</TableCell>
      <TableCell>Ride ID</TableCell>
      <TableCell>Value</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Most Closures</TableCell>
      <TableCell>{getMostClosures(entries).rideId}</TableCell>
      <TableCell>{getMostClosures(entries).rideName} ({getMostClosures(entries).totalClosures})</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Least Closures</TableCell>
      <TableCell>{getLeastClosures(entries).rideId}</TableCell>
      <TableCell>{getLeastClosures(entries).rideName} ({getLeastClosures(entries).totalClosures})</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Highest Average Closure Length (Days)</TableCell>
      <TableCell>{getHighestAverage(entries).rideId}</TableCell>
      <TableCell>{getHighestAverage(entries).rideName} ({getHighestAverage(entries).averageClosureLengthDays})</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Lowest Average Closure Length (Days)</TableCell>
      <TableCell>{getLowestAverage(entries).rideId}</TableCell>
      <TableCell>{getLowestAverage(entries).rideName} ({getLowestAverage(entries).averageClosureLengthDays})</TableCell>
    </TableRow>
  </TableBody>
</Table>

</Box>


      
    </Card>
  );
}
