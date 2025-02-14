import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, StarBorder } from "@mui/icons-material";
import DiamondLoader from "../../components/Loader/loader"; // Import Loader
import "./shop.css"; // External CSS
import { Button, Menu, MenuItem, IconButton, Typography } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const DiamondsGrid = () => {
  const [diamonds, setDiamonds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDiamonds = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/stock/data/page",
        { params: { pageSize: itemsPerPage, pageNumber: currentPage } }
      );

      if (response.data.result.statusCode === 200) {
        setDiamonds(response.data.result.data);
        setTotalPages(response.data?.result?.totalPages);
      } else {
        setError("No diamonds found.");
      }
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiamonds();
  }, [currentPage, itemsPerPage, totalPages]);

  if (loading) return <DiamondLoader />; // Show loader while fetching data
  if (error) return <p className="error">{error}</p>;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (perPage) => {
    if (typeof perPage === "number") {
      setItemsPerPage(perPage);
    }
    setAnchorEl(null);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="container">
      <div className="row">
        {diamonds.map((diamond, index) => (
          <div key={index} className="col-md-3 col-sm-6">
            <div className="diamond-card">
              <div className="shopimg">
                <img
                  src={diamond.Image}
                  alt={diamond.Shape}
                  className="diamond-img"
                />
              </div>
              <h6>
                {diamond.Carats} CARAT {diamond.Shape} - {diamond.Lab}
              </h6>
              <div className="star-rating">
                {[...Array(5)].map((_, i) =>
                  i < diamond.Rating ? (
                    <Star key={i} className="filled-star" />
                  ) : (
                    <StarBorder key={i} className="empty-star" />
                  )
                )}
              </div>
              <p className="price">${diamond.Price.toFixed(2)}</p>
              <span className="add-to-cart">
                Add to cart <span className="arrowbtn">→</span>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-3" style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent:"end" }}>
        {/* Items per page dropdown */}
        <Button
          variant="contained"
          onClick={handleClick}
          style={{
            textTransform: "none",
            backgroundColor: "#C9A236",
            color: "#fff",
          }}
        >
          {itemsPerPage}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {[12, 28, 52, 100].map((perPage) => (
            <MenuItem key={perPage} onClick={() => handleClose(perPage)}>
              {perPage}
            </MenuItem>
          ))}
        </Menu>

        {/* Previous Page Button */}
        <IconButton
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          style={{ backgroundColor: "#C9A236", color: "#fff" }}
        >
          <ArrowLeftIcon />
        </IconButton>

        {/* Page Indicator */}
        <Typography variant="body1">
          Page {currentPage} of {totalPages}
        </Typography>

        {/* Next Page Button */}
        <IconButton
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{ backgroundColor: "#C9A236", color: "#fff" }}
        >
          <ArrowRightIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default DiamondsGrid;
