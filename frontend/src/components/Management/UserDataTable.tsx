import React, { useState } from "react";
import { DataGrid, GridColDef, GridInitialState } from "@mui/x-data-grid";
import { ParkArea, User } from "./types";
import UserActionButtons from "./UserActionButtons";
import DeleteConfirmationPopup from "../DeleteConfirmationPopup";

interface UserDataTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (username: string) => void;
  onAssignArea: (username: string) => void;
}

const UserDataTable: React.FC<UserDataTableProps> = ({
  users,
  onEditUser,
  onDeleteUser,
  onAssignArea,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleDeleteUser = (user: User) => {
    if (user.username) {
      setUserToDelete(user);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (userToDelete && userToDelete.username) {
      onDeleteUser(userToDelete.username);
    }
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const columns: GridColDef[] = [
    { field: "username", headerName: "Username", width: 150 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      hideable: true,
    },
    {
      field: "position",
      headerName: "Position",
      width: 150,
      valueGetter: (params) => params.row.position?.name || "-",
    },
    {
      field: "parkAreas",
      headerName: "Park Areas",
      width: 200,
      valueGetter: (params) =>
        params.row.parkAreas?.map((area: ParkArea) => area.name).join(", ") ||
        "-",
    },
    {
      field: "hourlyRate",
      headerName: "Hourly Rate",
      width: 150,
      hideable: true,
    },
    {
      field: "ssn",
      headerName: "SSN",
      width: 150,
      hideable: true,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 150,
      hideable: true,
    },
    {
      field: "endDate",
      headerName: "End Date",
      width: 150,
      hideable: true,
    },
    {
      field: "address",
      headerName: "Address",
      width: 200,
      hideable: true,
    },
    {
      field: "emergencyContactName",
      headerName: "Emergency Contact Name",
      width: 200,
      hideable: true,
    },
    {
      field: "emergencyContactPhone",
      headerName: "Emergency Contact Phone",
      width: 200,
      hideable: true,
    },
    {
      field: "isFullTime",
      headerName: "Full Time",
      width: 100,
      hideable: true,
      valueGetter: (params) => (params.row.isFullTime ? "✅" : "❌"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <UserActionButtons
          user={params.row}
          onEdit={onEditUser}
          onDelete={handleDeleteUser}
          onAssignArea={onAssignArea}
        />
      ),
    },
  ];

  const initialState: GridInitialState = {
    columns: {
      columnVisibilityModel: {
        phone: false,
        parkAreas: false,
        hourlyRate: false,
        ssn: false,
        startDate: false,
        endDate: false,
        address: false,
        emergencyContactName: false,
        emergencyContactPhone: false,
        isFullTime: false,
      },
    },
  };

  return (
    <>
      <DataGrid
        rows={users}
        getRowId={(row) => row.username}
        columns={columns}
        initialState={initialState}
        sx={{
          maxHeight: 660,
          maxWidth: 1200,
          overflow: "auto",
          "& .MuiDataGrid-cell": {
            color: "text.primary",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "background.default",
            color: "text.primary",
          },
        }}
      />
      <DeleteConfirmationPopup
        open={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete the user "${userToDelete?.username}"?`}
      />
    </>
  );
};

export default UserDataTable;
