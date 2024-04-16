import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import db from "./db";

interface InventoryItem {
  itemID: number;
  shopID: number;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InventoryPopupProps {
  open: boolean;
  onClose: () => void;
  shopID: number;
  onInventoryUpdate: (updatedInventory: InventoryItem[]) => void;
}

const InventoryPopup: React.FC<InventoryPopupProps> = ({
  open,
  onClose,
  shopID,
  onInventoryUpdate,
}) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({});

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await db.get(`/Shop/${shopID}/inventory`);
        setInventory(response.data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    if (open) {
      fetchInventory();
    }
  }, [open, shopID]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    itemID?: number
  ) => {
    const { name, value } = event.target;
    if (itemID) {
      setInventory((prevInventory) =>
        prevInventory.map((item) =>
          item.itemID === itemID ? { ...item, [name]: value } : item
        )
      );
    } else {
      setNewItem((prevItem) => ({ ...prevItem, [name]: value }));
    }
  };

  const handleAddItem = async () => {
    try {
      const response = await db.post(`/Shop/${shopID}/inventory`, newItem);
      const newInventoryItem: InventoryItem = {
        itemID: response.data.itemID,
        shopID: shopID,
        itemName: newItem.itemName || "",
        description: newItem.description || "",
        quantity: newItem.quantity || 0,
        unitPrice: newItem.unitPrice || 0,
      };
      setInventory((prevInventory) => [...prevInventory, newInventoryItem]);
      setNewItem({});
      onInventoryUpdate([...inventory, newInventoryItem]);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleUpdateItem = async (item: InventoryItem) => {
    try {
      await db.put(`/Shop/${shopID}/inventory/${item.itemID}`, item);
      onInventoryUpdate(inventory);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteItem = async (itemID: number) => {
    try {
      await db.delete(`/Shop/${shopID}/inventory/${itemID}`);
      const updatedInventory = inventory.filter(
        (item) => item.itemID !== itemID
      );
      setInventory(updatedInventory);
      onInventoryUpdate(updatedInventory);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Inventory</DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.itemID}>
                  <TableCell>
                    <TextField
                      name="itemName"
                      value={item.itemName}
                      onChange={(event) =>
                        handleInputChange(event, item.itemID)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="description"
                      value={item.description}
                      onChange={(event) =>
                        handleInputChange(event, item.itemID)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="quantity"
                      type="number"
                      value={item.quantity}
                      onChange={(event) =>
                        handleInputChange(event, item.itemID)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="unitPrice"
                      type="number"
                      value={item.unitPrice}
                      onChange={(event) =>
                        handleInputChange(event, item.itemID)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateItem(item)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteItem(item.itemID)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <TextField
                    name="itemName"
                    value={newItem.itemName || ""}
                    onChange={handleInputChange}
                    placeholder="New Item Name"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name="description"
                    value={newItem.description || ""}
                    onChange={handleInputChange}
                    placeholder="New Item Description"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name="quantity"
                    type="number"
                    value={newItem.quantity || ""}
                    onChange={handleInputChange}
                    placeholder="New Item Quantity"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name="unitPrice"
                    type="number"
                    value={newItem.unitPrice || ""}
                    onChange={handleInputChange}
                    placeholder="New Item Price"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddItem}
                  >
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryPopup;
