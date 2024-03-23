import React, { useState } from "react";
import { Grid } from '@mui/material';
import { GenericCard } from "../../components/Card";
import ButtonComponent from "../../components/ButtonComponent";


interface Event {
  id: number;
  name: string;
  description: string;
  StartDateTime: Date;
  EndDateTime: Date;
  AgeRestriction: number;
}

const initialEvents: Event[] = [
  {
    id: 1,
    name: 'FireWorks Showing',
    description: 'The amazing firework showing with Buggy the Clown!',
    StartDateTime: new Date('2024-04-27T00:00:00'),
    EndDateTime: new Date('2024-04-27T23:59:59'),
    AgeRestriction: 5,
  },
  // Add more events as needed
];

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const handleDelete = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleCreateCard = () => {
    const newEvent: Event = {
      id: events.length + 1,
      name: 'New Event',
      description: 'Description of the new event',
      StartDateTime: new Date(),
      EndDateTime: new Date(),
      AgeRestriction: 0,
    };
    setEvents([...events, newEvent]);
  };

  return (
    <Grid container spacing={3}>
      {/* Event cards */}
      {events.map((event) => (
        <Grid item key={event.id} xs={12} sm={6} md={4}>
          <GenericCard
            item={event}
            onDelete={() => handleDelete(event.id)}
            onEdit={(updatedEvent) => console.log(updatedEvent)}
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

export default EventsPage;
