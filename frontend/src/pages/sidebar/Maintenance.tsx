import React, { useState } from "react";
import { Grid } from '@mui/material';
import { GenericCard } from "../../components/Card";
import ButtonComponent from "../../components/ButtonComponent";

interface Maintenance {
  id: number;
  name: string;
  description: string;
  startDateTime: Date;
  endDateTime: Date;
}

const initialMaintenance: Maintenance[] = [
  {
    id: 1,
    name: 'Routine Checkup',
    description: 'Regular maintenance checkup for equipment',
    startDateTime: new Date('2024-04-27T08:00:00'),
    endDateTime: new Date('2024-04-27T17:00:00'),
  },
  // Add more maintenance tasks as needed
];

const MaintenancePage: React.FC = () => {
  const [maintenance, setMaintenance] = useState<Maintenance[]>(initialMaintenance);

  const handleDelete = (id: number) => {
    setMaintenance(maintenance.filter(task => task.id !== id));
  };

  const handleCreateCard = () => {
    const newMaintenance: Maintenance = {
      id: maintenance.length + 1,
      name: 'New Maintenance Task',
      description: 'Description of the new maintenance task',
      startDateTime: new Date(),
      endDateTime: new Date(),
    };
    setMaintenance([...maintenance, newMaintenance]);
  };

  return (
    <Grid container spacing={3}>
      {/* Maintenance task cards */}
      {maintenance.map((task) => (
        <Grid item key={task.id} xs={12} sm={6} md={4}>
          <GenericCard
            item={task}
            onDelete={() => handleDelete(task.id)}
            onEdit={(updatedTask) => console.log(updatedTask)}
          />
        </Grid>
      ))}
      {/* Create Button */}
      <Grid item xs={12} sm={6} md={4}>
        <ButtonComponent variant="contained" color="primary" size="small" onClickCreate={handleCreateCard}>
          Create
        </ButtonComponent>
      </Grid>
    </Grid>
  );
};

export default MaintenancePage;
