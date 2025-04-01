import { Grid } from "@mui/material";
import React from "react";
import { RotatingLines } from "react-loader-spinner";

const WhiteLoader = ({ loader, height, width, padding }) => {
  return (
    loader && (
      <Grid
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RotatingLines
          height={height}
          width={width}
          thickness={100} 
          speed={50}      
          strokeColor="#fff"
          style={{ padding }}
        />
      </Grid>
    )
  );
};

export default WhiteLoader;
