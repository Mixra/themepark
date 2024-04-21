import React, { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import CreateUserDialog from "../../components/Management/CreateUserDialog";
import UserDataTable from "../../components/Management/UserDataTable";
import EditUserDialog from "../../components/Management/EditUsersDialog";
import AssignParkAreasDialog from "../../components/Management/AssignAreaDialog";
import { User, ParkArea } from "../../components/Management/types";
import { useTheme } from "@mui/material/styles";
import db from "../../components/db";

const UserManagement: React.FC = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignAreaDialogOpen, setIsAssignAreaDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [parkAreas, setParkAreas] = useState<ParkArea[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await db.get<User[]>("/admin/get_users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchParkAreas = async () => {
      try {
        const response = await db.get<ParkArea[]>("/admin/get_park_areas");
        setParkAreas(response.data);
      } catch (error) {
        console.error("Error fetching park areas:", error);
      }
    };

    fetchUsers();
    fetchParkAreas();
  }, []);

  const handleCreateUser = (newUser: User) => {
    setUsers([...users, newUser]);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(
      users.map((user) =>
        user.username === updatedUser.username ? updatedUser : user
      )
    );
    setEditingUser(null);
    setIsEditDialogOpen(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = async (username: string) => {
    try {
      await db.delete(`/admin/delete_user/${username}`);
      setUsers(users.filter((user) => user.username !== username));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleAssignArea = (username: string, areaIds: number[]) => {
    setUsers(
      users.map((user) =>
        user.username === username
          ? {
              ...user,
              parkAreas: areaIds.map((id) => ({ areaID: id, areaName: "" })),
            }
          : user
      )
    );
  };

  const handleOpenAssignAreaDialog = (user: User) => {
    setEditingUser(user);
    setIsAssignAreaDialogOpen(true);
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
        users={users.filter(
          (user) =>
            user &&
            user.username &&
            (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.firstName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (user.position &&
                user.position.name &&
                user.position.name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())))
        )}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onAssignArea={handleOpenAssignAreaDialog}
      />
      <CreateUserDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onUserCreated={handleCreateUser}
      />
      <EditUserDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onUserUpdated={handleUpdateUser}
        user={editingUser}
      />
      <AssignParkAreasDialog
        open={isAssignAreaDialogOpen}
        onClose={() => setIsAssignAreaDialogOpen(false)}
        user={editingUser}
        parkAreas={parkAreas}
        onAssignParkAreas={handleAssignArea}
      />
    </Box>
  );
};

export default UserManagement;
