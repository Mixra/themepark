import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EventPopup from "../../components/EventPopup";
import DeleteConfirmationPopup from "../../components/DeleteConfirmationPopup";


interface Event {
  EventID: number;
  AreaID: number;
  Name: string;
  Description: string;
  EventType: string;
  StartDateTime: string;
  EndDateTime: string;
  AgeRestriction: number;
  ImageUrl?: string;
  hasCrud?:boolean;
}

const initialEvents: Event[] = [
  {
    EventID: 1,
    AreaID:1,
    Name: 'FireWorks Showing',
    Description: 'The amazing firework showing with Buggy the Clown!',
    EventType: 'Showcase',
    StartDateTime: '(12:00AM) 04-04-24',
    EndDateTime: '(1:00AM) 04-04-24',
    AgeRestriction: 5,
    hasCrud: true,
    ImageUrl:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fusopps-froggy-hat.tumblr.com%2Fpost%2F732752965818023936%2Fep-1080&psig=AOvVaw0ELYizwsAIrWGmAh0JCw5K&ust=1711677841669000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCOiX_YHvlYUDFQAAAAAdAAAAABAE",
  },
  // Add more events as needed
];

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [openPopup, setOpenPopup] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Event>>({});
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const level = Number(localStorage.getItem("level"));
  const displayCrud = level === 999 ? true : false;

  const handleCreateClick = () => {
    setFormData({});
    setIsEditing(false);
    setOpenPopup(true);
  };

  const handleFormSubmit = (formData: Partial<Event>) => {
    if (isEditing && selectedEvent) {
      const updatedEvent = events.map((thisevent) =>
      thisevent.EventID === selectedEvent.EventID ? { ...thisevent, ...formData } : thisevent
      );
      setEvents(updatedEvent);
    } else {
      const newId = Math.max(...events.map(r => r.EventID)) + 1; // Simplistic approach to generate a new ID
        const newEvent: Event = {
          EventID: newId,
          AreaID:formData.AreaID||0,
          Name: formData.Name||'',
          Description: formData.Description||'',
          EventType: formData.EventType||'',
          StartDateTime: formData.StartDateTime||'',
          EndDateTime: formData.EndDateTime||'',
          AgeRestriction: formData.AgeRestriction||0,//No Age Restiction on creation
          ImageUrl:"https://via.placeholder.com/150",
        };
      

      setEvents([...events, newEvent]);
    }
    setOpenPopup(false);
  };

  const handleEditClick = (event: Event) => {
    setFormData(event);
    setSelectedEvent(event);
    setIsEditing(true);
    setOpenPopup(true);
  };

  const handleDeleteClick = (event: Event) => {
    setSelectedEvent(event);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedEvent) {
      const updatedEvent = events.filter(
        (event) => event.EventID !== selectedEvent?.EventID
      );
      setEvents(updatedEvent);
    }
    setOpenDeleteDialog(false);
  };

  

  return (<Box
    sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
  >
    {displayCrud && (
      <Box
        sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}
      >
        <Button variant="contained" onClick={handleCreateClick}>
          Create
        </Button>
      </Box>
    )}
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        maxWidth: "100%",
      }}
    >
      {events.map((thisevent) => (
        <Card
          key={thisevent.EventID}
          sx={{
            margin: 1,
            width: 300,
            height: 660,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <img
            src={thisevent.ImageUrl}
            alt="Event"
            style={{ width: "100%", objectFit: "cover", height: "150px" }}
          />
          <CardContent
            sx={{
              overflowY: "auto",
              padding: 1,
              flexGrow: 1,
            }}
          >
            <Typography variant="h5" component="div" gutterBottom>
              {thisevent.Name}
            </Typography>
            <Divider sx={{ marginY: 1 }} />
            <Typography color="text.secondary" gutterBottom>
              {thisevent.EventType}
            </Typography>
            <Box
              sx={{
                maxHeight: 120,
                minHeight: 120,
                overflow: "auto",
                padding: 1,
                border: "1px solid #ccc",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">{thisevent.Description}</Typography>
            </Box>
            <Divider sx={{ marginY: 1 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" fontWeight="bold">
                Opening Time: {thisevent.StartDateTime}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                Closing Time: {thisevent.EndDateTime}
              </Typography>
            </Box>
            <Divider sx={{ marginY: 1 }} />
            <Box
              sx={{
                maxHeight: 140,
                minHeight: 140,
                overflow: "auto",
                padding: 1,
                border: "1px solid #ccc",
                borderRadius: 1,
              }}
            >
            </Box>
          </CardContent>
          {thisevent.hasCrud && (
            <CardActions>
              <IconButton
                aria-label="edit"
                onClick={() => handleEditClick(thisevent)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                onClick={() => handleDeleteClick(thisevent)}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          )}
        </Card>
      ))}
    </Box>
    <EventPopup
      open={openPopup}
      onClose={() => setOpenPopup(false)}
      onSubmit={handleFormSubmit}
      formData={formData}
      setFormData={setFormData}
      isEditing={isEditing}
    />
    <DeleteConfirmationPopup
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
      />
  </Box>
);
};

export default EventsPage;
