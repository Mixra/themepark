import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save'; // Import SaveIcon
import TextField from '@mui/material/TextField';
import { BaseItem } from '../../interface';

type Props = {
  item: BaseItem;
  children?: React.ReactNode;
  onDelete: () => void;
  onEdit: (item: BaseItem) => void;
};

export const GenericCard: React.FC<Props> = ({ item, children, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(item.Name);
  const [description, setDescription] = useState(item.Description);
  const [openingTime, setOpeningTime] = useState(item.OpeningTime);
  const [closingTime, setClosingTime] = useState(item.ClosingTime);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onEdit({ ...item, Name: name, Description: description, OpeningTime: openingTime, ClosingTime: closingTime });
  };

  return (
    <Card sx={{ minWidth: 275, margin: 2, boxShadow: 3 }}>
      <CardContent>
        {isEditing ? (
          <>
            <TextField value={name} onChange={(e) => setName(e.target.value)} label="Name" />
            <TextField value={description} onChange={(e) => setDescription(e.target.value)} label="Description" />
            <TextField value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} label="Opening Time" />
            <TextField value={closingTime} onChange={(e) => setClosingTime(e.target.value)} label="Closing Time" />
          </>
        ) : (
          <>
            <Typography gutterBottom variant="h5" component="div">
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ marginTop: 1 }}>
              Opens at: {openingTime} - Closes at: {closingTime}
            </Typography>
            {children && <div style={{ marginTop: 12 }}>{children}</div>}
          </>
        )}
      </CardContent>
      
      <CardActions disableSpacing>
        <IconButton aria-label="delete" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
        {isEditing ? (
          <IconButton aria-label="save" onClick={handleSave}>
            <SaveIcon />
          </IconButton>
        ) : (
          <IconButton aria-label="edit" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};