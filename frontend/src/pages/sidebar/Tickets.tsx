import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Card,
  Grid,
  Chip,
  Box,
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
  ticketExpiryDate: string | null;
  refundStatus: boolean;
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
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <ListItemText
            primary={`${purchase.name} - Quantity: ${purchase.quantity}`}
            secondary={
              <>
                <Box>
                  <span style={{ fontWeight: "bold" }}>Item Type:</span>{" "}
                  {purchase.itemType}
                </Box>
                <Box>
                  <span style={{ fontWeight: "bold" }}>Purchase Date:</span>{" "}
                  {new Date(purchase.purchaseDate).toLocaleDateString()}
                </Box>
                <Box>
                  <span style={{ fontWeight: "bold" }}>Expiry Date:</span>{" "}
                  {purchase.itemType === "Ride"
                    ? purchase.ticketExpiryDate
                      ? new Date(purchase.ticketExpiryDate).toLocaleDateString()
                      : "N/A"
                    : "N/A"}
                </Box>
                {purchase.refundStatus && (
                  <Box>
                    <Chip label="Refunded" color="error" size="small" />
                  </Box>
                )}
              </>
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total: ${(purchase.price * purchase.quantity).toFixed(2)}
            </Typography>
            <div
              style={{ marginTop: "16px", display: "flex", flexWrap: "wrap" }}
            >
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
          </Box>
        </Grid>
      </Grid>
    );
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
                sx={{
                  padding: 3,
                  borderBottom: "1px solid #e0e0e0",
                  "&:last-child": {
                    borderBottom: "none",
                  },
                }}
              >
                {renderQRCodeOrDetails(purchase)}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography textAlign="center" padding={3}>
            You have not yet purchased any items.
          </Typography>
        )}
      </Card>
    </div>
  );
};

export default Tickets;
