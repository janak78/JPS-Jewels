import { Grid } from "@mui/material";
import React from "react";
import { SpinnerDotted } from "spinners-react";

const WhiteLoader = ({ loader, height, width, padding }) => {
    return (
        <Grid
          style={{  
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SpinnerDotted
            height={height}
            width={width}
            thickness={180}
            speed={130}
            color="#ffff"
            padding={padding}
            visible={loader}
          />
        </Grid>
      );
};

export default WhiteLoader;
