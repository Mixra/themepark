import React, { useState } from "react";
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
    <div>
      {/* Maintenance task cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {maintenance.map((task) => (
          <div key={task.id} style={{ margin: '10px' }}>
            <GenericCard
              item={task}
              onDelete={() => handleDelete(task.id)}
              onEdit={(updatedTask) => console.log(updatedTask)}
            />
          </div>
        ))}
      </div>
      {/* Create Button */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <ButtonComponent variant="contained" color="primary" size="small" onClickCreate={handleCreateCard}>
          Create
        </ButtonComponent>
      </div>
    </div>
  );
};  

export default MaintenancePage;
