import React from 'react';
import { BaseItem } from '../../interface'; // Adjust the import path as necessary
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';

type Props = {
  item: BaseItem;
  children?: React.ReactNode; // Allows for inserting additional details or actions specific to the item type
};

export const GenericCard: React.FC<Props> = ({ item, children }) => {
  // Destructure the item for easier access to its properties
  const { Name, Description, ClosingTime, OpeningTime } = item;

  return (
    <Card sx={{ minWidth: 275, margin: 2, boxShadow: 3 }}>
      <CardContent>
        {/* Item Name */}
        <Typography gutterBottom variant="h5" component="div">
          {Name}
        </Typography>

        {/* Item Description */}
        <Typography variant="body2" color="text.secondary">
          {Description}
        </Typography>

        {/* Opening and Closing Times */}
        <Typography variant="body2" color="text.primary" sx={{ marginTop: 1 }}>
          Opens at: {OpeningTime} - Closes at: {ClosingTime}
        </Typography>

        {/* Children components passed, could be actions or additional details */}
        {children && <div style={{ marginTop: 12 }}>{children}</div>}
      </CardContent>
      
      <CardActions>
        {/* Placeholder for actions like edit/delete, could also be passed as children */}
      </CardActions>
    </Card>
  );
};
