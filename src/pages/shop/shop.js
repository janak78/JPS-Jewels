import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { fetchCartCount } from "../../redux/cartSlice";
import { useFetchDiamondsQuery } from "../../redux/shopSlice";
import { Star, StarBorder } from "@mui/icons-material";
import DiamondLoader from "../../components/Loader/loader"; // Import Loader
import "./shop.css"; // External CSS
import { Button, Menu, MenuItem, IconButton, Typography } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { setCurrentPage, setItemsPerPage, setTotalPages } from "../../redux/shopSlice";

const DiamondsGrid = ({ diamond }) => {
  console.log(diamond, "diamond");
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.user?.UserId);
  const { totalPages, currentPage, itemsPerPage } = useSelector((state) => state.shop);
  
  const { data, error, isLoading } = useFetchDiamondsQuery({ pageNumber: currentPage, pageSize: itemsPerPage });
  const diamonds = data?.result?.data || [];

  useEffect(() => {
    if (data?.result?.totalPages) {
      dispatch(setTotalPages(data.result.totalPages));
    }
  }, [data, dispatch]);
  
  useEffect(() => {
    if (userId) {
      dispatch(fetchCartCount(userId)); // Fetch cart count when page loads
    }
  }, [userId]); // Run when userId is available

  const handleAddToCart = (diamond) => {
    if (!userId) {
      alert("Please log in to add items to the cart.");
      return;
    }

    const cartItem = {
      SKU: diamond.SKU,
      Quantity: 1, // You can change this to allow quantity selection
    };

    dispatch(addToCart(cartItem, userId)); // Dispatch action
  };

  const [anchorEl, setAnchorEl] = useState(null);

  if (isLoading) return <DiamondLoader />; // Show loader while fetching data
  if (error) return <p className="error">{error.message}</p>;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (perPage) => {
    if (typeof perPage === "number") {
      dispatch(setItemsPerPage(perPage)); // Update itemsPerPage in the store
    }
    setAnchorEl(null);
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
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
              <h6 className="mt-3 diamond-name">
                {diamond.Carats} CARAT {diamond.Shape} - {diamond.Lab}
              </h6>
              <p className="price">${diamond.Price.toFixed(2)}</p>
              <span
                className="add-to-cart"
                onClick={() => handleAddToCart(diamond)}
              >
                Add to cart <span className="arrowbtn">→</span>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div
        className="mb-3"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: "end",
        }}
      >
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
          style={{ outline: "none", border: "none" }}
        >
          {[12, 28, 52, 100].map((perPage) => (
            <MenuItem
              key={perPage}
              onClick={() => handleClose(perPage)}
              style={{ outline: "none", border: "none" }}
            >
              {perPage}
            </MenuItem>
          ))}
        </Menu>

        <IconButton
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          style={{ backgroundColor: "#C9A236", color: "#fff", outline: "none" }}
        >
          <ArrowLeftIcon />
        </IconButton>

        <Typography variant="body1">
          Page {currentPage} of {totalPages}
        </Typography>

        <IconButton
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{ backgroundColor: "#C9A236", color: "#fff", outline: "none" }}
        >
          <ArrowRightIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default DiamondsGrid;