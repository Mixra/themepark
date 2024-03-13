// TicketsPage.tsx
import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
interface Ticket {
    id: number;
    type: string;
    price: number;
    quantity: number;
    description: string;
    benefits: string[];
  }
const tickets: Ticket[] = [
    {
      id: 1,
      type: 'Fast Pass',
      price: 120,
      quantity: 100, // Example quantity
      description: 'Skip the lines and enjoy more rides with the Fast Pass!',
      benefits: ['Less waiting time', 'Exclusive access to select rides'],
    },
    {
      id: 2,
      type: 'Normal',
      price: 60,
      quantity: 200, // Example quantity
      description: 'Enjoy a day full of adventure and fun with our standard entry ticket.',
      benefits: ['Full day access', 'Over 50 rides and attractions'],
    },
    // Add more tickets as needed
  ];

const Tickets: React.FC = () => {
  return (
<Grid container spacing={4} sx={{ padding: '10px', justifyContent: 'center' }}>
  {tickets.map((ticket) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={ticket.id} sx={{ display: 'flex', flexDirection: 'column' }}>
      <Card sx={{ width: '100%',maxWidth: '2000px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="140"
              image="/static/images/cards/contemplative-reptile.jpg" // Placeholder image path
              alt={ticket.type}
            />
            <CardContent sx={{ flex: 1 }}>
              <Typography gutterBottom variant="h5" component="div">
                {ticket.type}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Price: ${ticket.price} - Quantity: {ticket.quantity}
              </Typography>
              <Typography variant="body1" marginTop={2}>
                {ticket.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Benefits: {ticket.benefits.join(', ')}
              </Typography>
            </CardContent>
            <CardActions>
  <Button size="small" sx={{ width: '100%' }}>Purchase</Button>
</CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
export default Tickets;