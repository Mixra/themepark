import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Card,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QRCode from "qrcode.react";

interface Purchase {
  id: number;
  name: string;
  price: number;
  itemType: string;
  quantity: number;
  purchaseDate: string;
}

const Tickets: React.FC = () => {
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);

  useEffect(() => {
    const loadedDataString = localStorage.getItem("orderData") || "{}";
    const loadedData = JSON.parse(loadedDataString);
  
    // Check if cartItems exist before extracting purchase history
    if (loadedData.cartItems) {
      const purchaseHistory: Purchase[] = loadedData.cartItems.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          itemType: item.itemType,
          quantity: item.quantity,
          purchaseDate: loadedData.currDatetime // Using the currDatetime from the outer object
        };
      });
  
      setPurchaseHistory(purchaseHistory);
    }
  }, []);

  const renderQRCodeOrDetails = (purchase: Purchase) => {
    if (purchase.itemType === "GiftShop") {
      return (
        <>
          <ListItemText
            primary={`${purchase.name} - Quantity: ${purchase.quantity}`}
            secondary={`Purchase Date: ${new Date(purchase.purchaseDate).toLocaleDateString()}`}
          />
        </>
      );
    } else {
      return (
        <>
          <ListItemText
            primary={`${purchase.name} - Quantity: ${purchase.quantity}`}
            secondary={`Purchase Date: ${new Date(purchase.purchaseDate).toLocaleDateString()}`}
          />
          <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap' }}>
            {/* Generating QR Codes */}
            {Array.from({ length: purchase.quantity }).map((_, codeIndex) => (
              <div key={codeIndex} style={{ marginRight: '16px', marginBottom: '16px' }}>
                <QRCode
                  value={`${purchase.name} - ${purchase.itemType} - ${purchase.purchaseDate}`}
                  size={96}
                />
              </div>
            ))}
          </div>
        </>
      );
    }
  };
  
  
  return (
    <div>
      <h1 style={{ fontSize: "1.5rem" }}>Purchase History:  </h1>
      <Card>
      {purchaseHistory.length > 0 ? (
        <List>
          {purchaseHistory.map((purchase, index) => (
            <ListItem
              key={index}
              sx={{ flexDirection: "column", alignItems: "start" }}
            >
              {renderQRCodeOrDetails(purchase)}
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography textAlign="center">
          You have not yet purchased any tickets.
        </Typography>
      )}
      </Card>
    </div>
  );
};

export default Tickets;
