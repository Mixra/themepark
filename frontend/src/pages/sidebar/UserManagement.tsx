import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee' | 'customer';
  ssn: string;
  position: string;
  areaId: string | null;
}

// Fake user data
export const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', ssn: '123-45-6789', position: 'Administrator', areaId: null },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'manager', ssn: '987-65-4321', position: 'Area Manager', areaId: '1' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'employee', ssn: '456-78-9012', position: 'Ride Operator', areaId: '2' },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com', role: 'customer', ssn: '', position: '', areaId: null },
];

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#269dff',
    },
    secondary: {
      main: '#5fa2d9',
    },
    background: {
      default: '#121212',
    },
    text: {
      primary: '#ffffff',
    },
  },
});



const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({});

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'role', headerName: 'Role', width: 150 },
    { field: 'ssn', headerName: 'SSN', width: 150 },
    { field: 'position', headerName: 'Position', width: 200 },
    { field: 'areaId', headerName: 'Area ID', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-around">
          <Button variant="contained" color="primary" onClick={() => handleEditUser(params.row)}>
            Edit
          </Button>
          <Button variant="contained" color="error" onClick={() => handleDeleteUser(params.row.id)}>
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleUpdateUser = () => {
    // Update the user in the database or state
    console.log('Update user:', editingUser);
    setEditingUser(null);
  };

  const handleCreateUser = () => {
    // Create a new user in the database or state
    console.log('Create new user:', newUser);
    setNewUser({});
  };

  const handleDeleteUser = (userId: string) => {
    // Delete the user from the database or state
    console.log('Delete user:', userId);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: 'background.default', color: 'text.primary' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <TextField
            label="Search Users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              style: { color: 'white' }, // Set the input text color
            }}
          />
          <Button variant="contained" color="primary" onClick={() => setEditingUser({ id: '', name: '', email: '', role: 'customer', ssn: '', position: '', areaId: null })}>
            Create New User
          </Button>
        </Box>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          // pageSize={10}
          sx={{
            '& .MuiDataGrid-cell': {
              color: 'text.primary', // Set the cell text color
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: 'background.default', // Set the column header background color
              color: 'text.primary', // Set the column header text color
            },
          }}
        />

        <Dialog open={!!editingUser} onClose={() => setEditingUser(null)}>
          <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
          <DialogContent>
            <DialogContentText>Please enter the user details.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={editingUser?.name || newUser.name || ''}
              onChange={(e) => {
                if (editingUser) {
                  setEditingUser({ ...editingUser, name: e.target.value });
                } else {
                  setNewUser({ ...newUser, name: e.target.value });
                }
              }}
              InputProps={{
                style: { color: 'white' }, // Set the input text color
              }}
            />
            <TextField
              margin="dense"
              label="Email"
              fullWidth
              value={editingUser?.email || newUser.email || ''}
              onChange={(e) => {
                if (editingUser) {
                  setEditingUser({ ...editingUser, email: e.target.value });
                } else {
                  setNewUser({ ...newUser, email: e.target.value });
                }
              }}
              InputProps={{
                style: { color: 'white' }, // Set the input text color
              }}
            />
            <TextField
              margin="dense"
              label="Role"
              fullWidth
              value={editingUser?.role || newUser.role || ''}
              onChange={(e) => {
                if (editingUser) {
                  setEditingUser({ ...editingUser, role: e.target.value as User['role'] });
                } else {
                  setNewUser({ ...newUser, role: e.target.value as User['role'] });
                }
              }}
              InputProps={{
                style: { color: 'white' }, // Set the input text color
              }}
            />
            <TextField
              margin="dense"
              label="SSN"
              fullWidth
              value={editingUser?.ssn || newUser.ssn || ''}
              onChange={(e) => {
                if (editingUser) {
                  setEditingUser({ ...editingUser, ssn: e.target.value });
                } else {
                  setNewUser({ ...newUser, ssn: e.target.value });
                }
              }}
              InputProps={{
                style: { color: 'white' }, // Set the input text color
              }}
            />
            <TextField
              margin="dense"
              label="Position"
              fullWidth
              value={editingUser?.position || newUser.position || ''}
              onChange={(e) => {
                if (editingUser) {
                  setEditingUser({ ...editingUser, position: e.target.value });
                } else {
                  setNewUser({ ...newUser, position: e.target.value });
                }
              }}
              InputProps={{
                style: { color: 'white' }, // Set the input text color
              }}
            />
            <TextField
              margin="dense"
              label="Area ID"
              fullWidth
              value={editingUser?.areaId || newUser.areaId || ''}
              onChange={(e) => {
                if (editingUser) {
                  setEditingUser({ ...editingUser, areaId: e.target.value || null });
                } else {
                  setNewUser({ ...newUser, areaId: e.target.value || null });
                }
              }}
              InputProps={{
                style: { color: 'white' }, // Set the input text color
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button onClick={editingUser ? handleUpdateUser : handleCreateUser} color="primary">
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default UserManagement;
