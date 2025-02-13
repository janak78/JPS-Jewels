import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Pagenotfound.css";

const Pagenotfound = () => {
  const navigate = useNavigate();
  return (
    <div className="not-found-container w-100">
      <Typography variant="h1">404</Typography>
      <Typography variant="h5">Oops! Page Not Found</Typography>
      <Typography variant="body1">
        The page you are looking for might have been removed or is temporarily
        unavailable.
      </Typography>
      <Button
        variant="contained"
        className="back-home-button"
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>
    </div>
  );
};

export default Pagenotfound;
