import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface Merchandise {
  [item: string]: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  initialMerchandise: Merchandise | null;
  onSave: (updatedMerchandise: Merchandise) => void;
}

const MerchandiseEditor: React.FC<Props> = ({
  open,
  onClose,
  initialMerchandise,
  onSave,
}) => {
  const [editedMerchandise, setEditedMerchandise] = useState<Merchandise>({});

  useEffect(() => {
    if (initialMerchandise) {
      setEditedMerchandise({ ...initialMerchandise });
    }
  }, [initialMerchandise]);

  const handleChange = (
    itemName: string,
    value: string,
    originalItemName?: string
  ) => {
    if (originalItemName && originalItemName !== itemName) {
      // Rename the item if the name is changed
      const updatedMerchandise = { ...editedMerchandise };
      updatedMerchandise[itemName] = updatedMerchandise[originalItemName];
      delete updatedMerchandise[originalItemName];
      setEditedMerchandise(updatedMerchandise);
    } else {
      setEditedMerchandise((prevMerchandise) => ({
        ...prevMerchandise,
        [itemName]: parseFloat(value) || 0,
      }));
    }
  };

  const handleSave = () => {
    onSave(editedMerchandise);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleDelete = (itemName: string) => {
    const updatedMerchandise = { ...editedMerchandise };
    delete updatedMerchandise[itemName];
    setEditedMerchandise(updatedMerchandise);
  };

  const handleAddNewItem = () => {
    setEditedMerchandise((prevMerchandise) => ({
      ...prevMerchandise,
      "New Item": 0,
    }));
  };

  const handleNameBlur = (itemName: string, newName: string) => {
    if (itemName !== newName) {
      const updatedMerchandise = { ...editedMerchandise };
      updatedMerchandise[newName] = updatedMerchandise[itemName];
      delete updatedMerchandise[itemName];
      setEditedMerchandise(updatedMerchandise);
    }
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Edit Merchandise</DialogTitle>
      <DialogContent>
        {Object.entries(editedMerchandise).map(([item, price]) => (
          <div key={item}>
            <TextField
              label="Name"
              defaultValue={item}
              onBlur={(e) => handleNameBlur(item, e.target.value)}
            />
            <TextField
              label="Price"
              type="number"
              value={price}
              onChange={(e) => handleChange(item, e.target.value)}
              inputProps={{ inputMode: "numeric" }}
            />
            <Button onClick={() => handleDelete(item)}>Delete</Button>
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddNewItem}>Add New Item</Button>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MerchandiseEditor;
