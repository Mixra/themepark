import React, { useState } from "react";
import { Box, Button, TextField, makeStyles } from "@mui/material";
import CreateUserDialog from "../../components/Management/UserDialog";
import UserDataTable from "../../components/Management/UserDataTable";
import AssignAreaDialog from "../../components/Management/AssignAreaDialog";
import { User, Position, ParkArea } from "../../components/Management/types";
import { PrivilegeLevel } from "../../components/Management/types";
import { useTheme } from "@mui/material/styles";

const mockUsers: User[] = [
  {
    username: "johndoe",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    position: {
      name: "Administrator",
      level: PrivilegeLevel.AdminPrivilege,
    },
    hourlyRate: 25.5,
    ssn: "123456789",
    startDate: "2022-01-01",
    endDate: "2023-12-31",
    address: "123 Main Street, Cityville, ST 12345",
    emergencyContactName: "Jane Doe",
    emergencyContactPhone: "9876543210",
    isFullTime: true,
    parkAreas: [
      { id: 1, name: "Roller Coaster Area" },
      { id: 2, name: "Water Park Area" },
    ],
  },
  {
    username: "janesmith",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "0987654321",
    position: {
      name: "Area Manager",
      level: PrivilegeLevel.EmployeePrivilege,
    },
    hourlyRate: 20.0,
    ssn: "987654321",
    startDate: "2020-05-15",
    endDate: "2023-05-14",
    address: "456 Oak Road, Townville, ST 67890",
    emergencyContactName: "John Smith",
    emergencyContactPhone: "1234509876",
    isFullTime: false,
    parkAreas: [{ id: 2, name: "Water Park Area" }],
  },
  // Add more mock users as needed
];

const UserManagement: React.FC = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({});
  const [positions, setPositions] = useState<Position[]>([]);
  const [parkAreas, setParkAreas] = useState<ParkArea[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignAreaDialogOpen, setIsAssignAreaDialogOpen] = useState(false);

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.position?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsCreateDialogOpen(true);
  };

  const handleCreateUser = (newUser: User) => {
    console.log("Create new user:", newUser);
    setNewUser({});
    setIsCreateDialogOpen(false);
  };

  const handleDeleteUser = (username: string) => {
    console.log("Delete user:", username);
  };

  const handleAssignArea = (username: string, areaIds: number[]) => {
    console.log("Assign areas to user:", username, areaIds);
    setIsAssignAreaDialogOpen(false);
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
        <TextField
          label="Search Users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            style: { color: theme.palette.text.primary },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Create New User
        </Button>
      </Box>
      <UserDataTable
        users={filteredUsers}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onAssignArea={(username) => setIsAssignAreaDialogOpen(true)}
      />
      <CreateUserDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateUser={handleCreateUser}
        onUpdateUser={(updatedUser) => console.log("Update user:", updatedUser)}
        positions={positions}
        onCreatePosition={() => console.log("Create position")}
        user={editingUser}
      />
      <AssignAreaDialog
        open={isAssignAreaDialogOpen}
        onClose={() => setIsAssignAreaDialogOpen(false)}
        onAssignArea={handleAssignArea}
        parkAreas={parkAreas}
      />
    </Box>
  );
};

export default UserManagement;
