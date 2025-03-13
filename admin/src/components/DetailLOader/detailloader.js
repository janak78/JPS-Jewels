import React from "react";
import { SpinnerDotted } from "spinners-react";

const search = (loading, setLoading) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginTop: "50px",
        }}
      >
        <SpinnerDotted
          size={50}
          thickness={180}
          speed={130}
          color="rgb(201, 162, 52)"
        />
      </div>
    </div>
  );
};

export default search;
