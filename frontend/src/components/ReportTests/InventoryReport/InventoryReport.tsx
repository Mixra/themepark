import React, { useState } from "react";
import {
  Typography,
  TextField,
  MenuItem,
  Box,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export interface InventoryItem {
  itemID: number;
  itemName: string;
  quantityInStock: number;
  quantitySold: number;
  unitPrice: number;
  soldSales: number;
}

export interface InventoryReportProps {
  stores: {
    shopID: number;
    shopName: string;
    items: InventoryItem[];
    bestItemName: string;
    worstItemName: string;
  }[];
  overallBestItem: InventoryItem[];
  overallWorstItem: InventoryItem[];
}

export function InventoryReport({
  stores = [],
  overallBestItem = [],
  overallWorstItem = [],
}: InventoryReportProps): JSX.Element {
  const [selectedShopId, setSelectedShopId] = useState("");

  const handleShopIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedShopId(event.target.value);
  };

  const filteredStores = selectedShopId
    ? stores.filter((store) => store.shopID === parseInt(selectedShopId))
    : stores;

  return (
    <Card>
      <CardHeader title="Inventory Report" />
      <Divider />
      <Box sx={{ p: 2 }}>
        <TextField
          select
          label="Select Shop ID"
          value={selectedShopId}
          onChange={handleShopIdChange}
          variant="outlined"
          fullWidth
        >
          <MenuItem value="">All Stores</MenuItem>
          {stores.map((store) => (
            <MenuItem key={store.shopID} value={store.shopID}>
              {store.shopName}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      {filteredStores.map((store) => (
        <Box key={store.shopID} sx={{ overflowX: "auto", p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {store.shopName}
          </Typography>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Item ID</TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell>Quantity In Stock</TableCell>
                <TableCell>Quantity Sold</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Sold Sales</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {store.items.map((item) => (
                <TableRow hover key={item.itemID}>
                  <TableCell>{item.itemID}</TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.quantityInStock}</TableCell>
                  <TableCell>{item.quantitySold}</TableCell>
                  <TableCell>{item.unitPrice}</TableCell>
                  <TableCell>{item.soldSales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Chip label={`Best Item: ${store.bestItemName}`} color="primary" />
            <Chip
              label={`Worst Item: ${store.worstItemName}`}
              color="secondary"
            />
          </Box>
        </Box>
      ))}
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Overall Best and Worst Items
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Chip
            label={`Best Item: ${
              overallBestItem.length > 0 ? overallBestItem[0].itemName : "N/A"
            }`}
            color="primary"
          />
          <Chip
            label={`Worst Item: ${
              overallWorstItem.length > 0 ? overallWorstItem[0].itemName : "N/A"
            }`}
            color="secondary"
          />
        </Box>
      </Box>
      <Divider />
    </Card>
  );
}
