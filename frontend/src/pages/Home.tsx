import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="Main" style={{ textAlign: "center", padding: "40px" }}>
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          color: "#FFFFFF", // Keeping the text color white for contrast
          letterSpacing: "0.1em", // Adding more space between letters
          transform: "scaleX(1.1)", // Stretching the text wider; adjust as needed
          display: "inline-block", // Required for transform to affect inline elements like text
          whiteSpace: "nowrap", // Ensures text stays on one line
          margin: "0 auto", // Centers the text if there's a specific width
        }}
      >
        Theme Park Management
      </h1>
      <Button
        fullWidth
        variant="contained"
        sx={{
          mt: 3,
          mb: 2,
          padding: "15px 0",
          fontSize: "1.1rem",
          fontWeight: "bold",
          letterSpacing: "0.05em",
          background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
          border: 0,
          borderRadius: "25px",
          boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
          color: "white",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            background: "linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)",
            boxShadow: "0 5px 8px 2px rgba(255, 105, 135, .5)",
            transform: "scale(1.05)",
          },
        }}
        onClick={() => navigate("/login")}
      >
        Login
      </Button>

      <Button
        fullWidth
        variant="contained"
        sx={{
          mt: 3,
          mb: 2,
          padding: "15px 0",
          fontSize: "1.1rem",
          fontWeight: "bold",
          letterSpacing: "0.05em",
          background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
          border: 0,
          borderRadius: "25px",
          boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
          color: "white",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            background: "linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)",
            boxShadow: "0 5px 8px 2px rgba(33, 203, 243, .5)",
            transform: "scale(1.05)",
          },
        }}
        onClick={() => navigate("/register")}
      >
        Register
      </Button>
    </div>
  );
};

export default MainPage;
