import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react';

 const statusMap = {
   'Inactive': { label: 'Inactive', color: 'warning' },
   'Active': { label: 'Active', color: 'success' }
} as const;

export interface Employee {
  employeeName: string;
  employeeID: string;
  employeePark: string;
  employeePosition: string;
  employeeActive: string | string;
}

export interface EmployeeReportData {
  employees?: Employee[];
  sx?: SxProps;
}

export function EmployeeReport({ employees = [], sx }: EmployeeReportData): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardHeader title="Latest Employee Activities" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Employee Name</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Employee Assigned Park</TableCell>
              <TableCell>Employee Assigned Role</TableCell>
              <TableCell>Employee Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((entry) => {
              const statusLabel = entry.employeeActive === 'Active' ? 'Active' : 'Inactive';
              const { label, color } = statusMap[statusLabel];

              return (
                <TableRow hover key={entry.employeeID}>
                  <TableCell>{entry.employeeName}</TableCell>
                  <TableCell>{entry.employeeID}</TableCell>
                  <TableCell>{entry.employeePark}</TableCell>
                  <TableCell>{entry.employeePosition}</TableCell>
                  <TableCell>
                    <Chip color={color} label={label} size="small" />
                  </TableCell>
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
