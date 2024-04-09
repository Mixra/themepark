import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface JokerProps {
  open: boolean;
  onClose: () => void;
}

const Joker: React.FC<JokerProps> = ({ open, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = async () => {
    if (inputText.trim() !== "") {
      const userMessage: Message = {
        id: messages.length + 1,
        text: inputText,
        sender: "user",
      };
      setMessages([...messages, userMessage]);
      setInputText("");

      try {
        const response = await fetch("/api/chatbot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: inputText }),
        });

        if (response.ok) {
          const data = await response.json();
          const botMessage: Message = {
            id: messages.length + 2,
            text: data.message,
            sender: "bot",
          };
          setMessages([...messages, userMessage, botMessage]);
        } else {
          console.error("Error fetching bot response");
        }
      } catch (error) {
        console.error("Error fetching bot response:", error);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#383838",
          width: "50%",
          height: "80%",
          margin: "auto",
        },
      }}
    >
      <DialogTitle>Chat with Joker</DialogTitle>
      <DialogContent>
        <List>
          {messages.map((message) => (
            <ListItem key={message.id}>
              <ListItemAvatar>
                <Avatar
                  alt={message.sender}
                  src={
                    message.sender === "user"
                      ? "https://img.icons8.com/?size=256&id=13042&format=png"
                      : "https://img.icons8.com/?size=256&id=9PnU8B0OJt0N&format=png"
                  }
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    color={message.sender === "user" ? "primary" : "secondary"}
                  >
                    {message.text}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <TextField
          autoFocus
          margin="dense"
          label="Type your message..."
          fullWidth
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          sx={{
            "& .MuiInputBase-root": {
              color: "white",
              "& fieldset": {
                borderColor: "white",
              },
            },
          }}
        />
        <Button onClick={handleSendMessage} color="primary">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Joker;
