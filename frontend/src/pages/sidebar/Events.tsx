import React from "react";
import { Grid, Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';

interface Events {
  /*
Columns needed:
-Name (from Events )
-Description (from Events)
-StartDateTime (from Events)
-EndDateTime (from Events)
-AgeRestriction (from Events)
-Area Name (Connect AreaID from Events -> AreaID from ParkAreas)
*/
    id: number;
    name: string;
    description: string;
    StartDateTime: Date;
    EndDateTime:Date;
    AgeRestriction:number;
  }
const tickets: Events[] = [
    {
      id: 1,
      name: 'FireWorks Showing',
      description: 'The amazing firework showing with Buggy the Clown!',
      StartDateTime: new Date('2024-04-27T00:00:00'),
      EndDateTime: new Date('2024-04-27T23:59:59'),
      AgeRestriction: 5,
    },
 
    // Add more tickets as needed
  ];

  const Events: React.FC = () => {
    return (
      <Grid container spacing={3}>
        {tickets.map((event) => (
          <Grid item key={event.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random"
                alt="Event Image"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start: {event.StartDateTime.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  End: {event.EndDateTime.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Age Restriction: {event.AgeRestriction}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };
  
 
export default Events;

/*
Columns needed:
-Name (from Events )
-Description (from Events)
-StartDateTime (from Events)
-EndDateTime (from Events)
-AgeRestriction (from Events)
-Area Name (Connect AreaID from Events -> AreaID from ParkAreas)
*/