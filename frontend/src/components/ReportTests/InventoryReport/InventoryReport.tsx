import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Button,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Card,
  CardActions,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react';

export interface InventoryItem {
  shopId: number;
  itemID: number;
  itemName: string;
  quantity: number;
  soldQuantity:number;
  soldSales:number;
  unitPrice: number;
}

export interface InventoryReportProps {
  items?: InventoryItem[];
  shopId?: string;
  bestItemsByGiftShop?: { [key: string]: InventoryItem };
  worstItemsByGiftShop?: { [key: string]: InventoryItem };
  bestOverallItem?: InventoryItem | null;
  worstOverallItem?: InventoryItem | null;
  // Additional sections
  additionalSections?: React.ReactNode[];
}

export function InventoryReport({
  items = [],
  bestItemsByGiftShop = {},
  worstItemsByGiftShop = {},
  bestOverallItem = null,
  worstOverallItem = null,
  additionalSections = [],
}: InventoryReportProps): JSX.Element {
  const [selectedShopId, setSelectedShopId] = useState('');
  const [showAllBestItems, setShowAllBestItems] = useState(false);
  const [showAllWorstItems, setShowAllWorstItems] = useState(false);

  // Function to handle shop ID change
  const handleShopIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedShopId(event.target.value);
  };

  // Get unique shop IDs from items
  const shopIds = [...new Set(items.map((item) => item.shopId))];

  // Filter items based on selected shop ID
  const filteredItems = selectedShopId
  ? items.filter((item) => item.shopId === parseInt(selectedShopId))
  : items;

  // Function to toggle showing all best items
  const toggleShowAllBestItems = () => {
    setShowAllBestItems(!showAllBestItems);
  };

  // Function to toggle showing all worst items
  const toggleShowAllWorstItems = () => {
    setShowAllWorstItems(!showAllWorstItems);
  };

  return (
    <Card>
      <CardHeader title="Inventory Report" />
      <Divider />
      {/* Dropdown for selecting shop name */}
      <Box sx={{ p: 2 }}>
        <TextField
          select
          label="Select Shop ID"
          value={selectedShopId}
          onChange={handleShopIdChange}
          variant="outlined"
          fullWidth
        >
          {shopIds.map((shopId) => (
            <MenuItem key={shopId} value={shopId}>
              {shopId}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      {/* Conditionally render inventory table and best/worst items */}
      {selectedShopId && (  // Only render if a shopId is selected
        <>
          {/* Inventory Table */}
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Item ID</TableCell>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>SoldQuantity</TableCell>
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Sold Sales</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item) => (
                    <TableRow hover key={item.itemID}>
                    <TableCell>{item.itemID}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.soldQuantity != null ? item.soldQuantity : 'N/A'}</TableCell>
                    <TableCell>{item.unitPrice}</TableCell>
                    <TableCell>{item.soldQuantity != null ? item.soldQuantity * item.unitPrice : 'N/A'}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          </Box>
          {/* Best and Worst Items by Gift Shop */}
          <Box sx={{ flexDirection: 'column', alignItems: 'center', mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Best and Worst Items by Gift Shop
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* Best Items */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Best Items
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {(showAllBestItems ? Object.entries(bestItemsByGiftShop) : Object.entries(bestItemsByGiftShop).slice(0, 3)).map(([giftShop, item]) => (
                    <Chip key={item.itemID} label={`${item.itemName} - ${giftShop}`} color="primary" sx={{ marginBottom: 1 }} />
                  ))}
                  {Object.keys(bestItemsByGiftShop).length > 3 && (
                    <Button color="primary" onClick={toggleShowAllBestItems}>
                      {showAllBestItems ? 'Show less' : 'Show all'}
                    </Button>
                  )}
                </Box>
              </Box>
              {/* Worst Items */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Worst Items
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {(showAllWorstItems ? Object.entries(worstItemsByGiftShop) : Object.entries(worstItemsByGiftShop).slice(0, 3)).map(([giftShop, item]) => (
                    <Chip key={item.itemID} label={`${item.itemName} - ${giftShop}`} color="primary" sx={{ marginBottom: 1 }} />
                  ))}
                  {Object.keys(worstItemsByGiftShop).length > 3 && (
                    <Button color="primary" onClick={toggleShowAllWorstItems}>
                      {showAllWorstItems ? 'Show less' : 'Show all'}
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}
      <Divider />
      {/* Overall Best and Worst Items */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Overall Best and Worst Items
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          {/* Overall Best Item */}
          <Chip
            label={`Best Item: ${bestOverallItem ? bestOverallItem.itemName : 'N/A'}`}
            color="primary"
          />
          {/* Overall Worst Item */}
          <Chip
            label={`Worst Item: ${worstOverallItem ? worstOverallItem.itemName : 'N/A'}`}
            color="secondary"
          />
        </Box>
      </Box>
      <Divider />
      {/* Additional Sections */}
      {additionalSections.map((section, index) => (
        <Box key={index} sx={{ mt: 2 }}>
          {section}
        </Box>
      ))}
      <Divider />
    </Card>
  );
}  