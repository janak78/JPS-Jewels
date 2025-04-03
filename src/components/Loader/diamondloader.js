import React from "react";
import "./diamondloader.css"; 

const DiamondCardSkeleton = () => {
  return (
    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 mb-20">
      <div className="diamond-card skeleton">
        <div className="shopimg skeleton-box"></div>
        <div className="dimond-content">
          <h6 className="skeleton-box skeleton-text"></h6>
          <p className="skeleton-box skeleton-text"></p>
          <p className="skeleton-box skeleton-text"></p>
          <span className="skeleton-box skeleton-btn"></span>
        </div>
      </div>
    </div>
  );
};

export default DiamondCardSkeleton;
