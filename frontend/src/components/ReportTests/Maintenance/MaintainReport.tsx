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

const statusMap = {
  'Ongoing': { label: 'Ongoing', color: 'warning' },
  'Completed': { label: 'Completed', color: 'success' }
} as const;

export interface MaintenanceEntry {
  entityID: string;
  entityType: string;
  maintenanceStartDate: Date;
  maintenanceEndDate: string | Date; // 'Ongoing' if null
  maintenanceDescription: string;
}

export interface LatestMaintenanceProps {
  entries?: MaintenanceEntry[];
  sx?: SxProps;
}

export function LatestMaintenance({ entries = [], sx }: LatestMaintenanceProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardHeader title="Latest Maintenance Activities" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Entity Type</TableCell>
              <TableCell>Entity ID</TableCell>
              <TableCell>Date Started</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => {
              const statusLabel = entry.maintenanceEndDate === 'Ongoing' ? 'Ongoing' : 'Completed';
              const { label, color } = statusMap[statusLabel];

              return (
                <TableRow hover key={entry.entityID}>
                  <TableCell>{entry.entityType}</TableCell>
                  <TableCell>{entry.entityID}</TableCell>
                  <TableCell>{dayjs(entry.maintenanceStartDate).format('MMM D, YYYY')}</TableCell>
                  <TableCell>
                    <Chip color={color} label={label} size="small" />
                  </TableCell>
                  <TableCell>{entry.maintenanceDescription}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
}
