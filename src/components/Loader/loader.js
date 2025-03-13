import React from "react";
import "./loader.css"; // External CSS
import { RotatingLines } from "react-loader-spinner";

const DiamondLoader = () => {
  return (
    <div className="loader-container">
      {/* <div className="diamond">
        <div className="top"></div>
        <div className="bottom"></div>
      </div> */}

      <RotatingLines
        visible={true}
        height="96"
        width="96"
        strokeColor="#c9a236"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        wrapperStyle={{ marginTop: "20px", color: "#c9a236" }}
        wrapperClass="rotating-lines-loader"
      />
    </div>
  );
};

export default DiamondLoader;
