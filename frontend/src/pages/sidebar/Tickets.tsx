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
import db from "../../components/db";

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
    const fetchPurchaseHistory = async () => {
      try {
        const response = await db.get("/order/history");
        setPurchaseHistory(response.data);
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      }
    };

    fetchPurchaseHistory();
  }, []);

  const renderQRCodeOrDetails = (purchase: Purchase) => {
    //GiftShop Items don't have QR codes
    if (purchase.itemType === "GiftShop") {
      return (
        <>
          <ListItemText
          primary={`${purchase.name} - Quantity: ${purchase.quantity} - Price: $${(purchase.price*purchase.quantity).toFixed(2) }`}
          secondary={`Purchase Date: ${new Date(purchase.purchaseDate).toLocaleDateString()}`}
        />
        </>
      );
    } else {
      return (
        <>
          <ListItemText
          primary={`${purchase.name} - Quantity: ${purchase.quantity} - Price: $${(purchase.price*purchase.quantity).toFixed(2) }`}

          secondary={`Purchase Date: ${new Date(purchase.purchaseDate).toLocaleDateString()}`}
        />
          <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap" }}>
            {/* Generating QR Codes */}
            {Array.from({ length: purchase.quantity }).map((_, codeIndex) => (
              <div
                key={codeIndex}
                style={{ marginRight: "16px", marginBottom: "16px" }}
              >
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
      <h1 style={{ fontSize: "1.5rem" }}>Purchase History: </h1>
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
