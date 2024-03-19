import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { BaseItem } from '../../interface';

type Props = {
  item: BaseItem;
  children?: React.ReactNode;
  onDelete: () => void; // Add a prop for handling delete
};

export const GenericCard: React.FC<Props> = ({ item, children, onDelete }) => {
  const { Name, Description, ClosingTime, OpeningTime } = item;

  return (
    <Card sx={{ minWidth: 275, margin: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {Name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {Description}
        </Typography>
        <Typography variant="body2" color="text.primary" sx={{ marginTop: 1 }}>
          Opens at: {OpeningTime} - Closes at: {ClosingTime}
        </Typography>
        {children && <div style={{ marginTop: 12 }}>{children}</div>}
      </CardContent>
      
      <CardActions disableSpacing>
        <IconButton aria-label="delete" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
