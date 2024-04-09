import React from "react";
import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Joker from "../../components/Joker";

const ReportingAnalytics: React.FC = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  const handleOpenChatbot = () => {
    setShowChatbot(true);
  };

  const handleCloseChatbot = () => {
    setShowChatbot(false);
  };

  return (
    <div>
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <Typography variant="body1">
          Can't find what you're looking for?{" "}
          <Button onClick={handleOpenChatbot}>Try asking Joker</Button>
        </Typography>
      </Box>
      <Joker open={showChatbot} onClose={handleCloseChatbot} />
    </div>
  );
};

export default ReportingAnalytics;
