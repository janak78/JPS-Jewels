import React from "react";
import "./loader.css"; // External CSS

const DiamondLoader = () => {
  return (
    <div className="loader-container">
      <div className="diamond">
        <div className="top"></div>
        <div className="bottom"></div>
      </div>
    </div>
  );
};

export default DiamondLoader;
