import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { fetchCartCount } from "../../redux/cartSlice";
import { useFetchDiamondsQuery } from "../../redux/shopSlice";
import DiamondLoader from "../../components/Loader/loader"; // Import Loader
import "./shop.css"; // External CSS
import { Button, Menu, MenuItem, IconButton, Typography } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  setCurrentPage,
  setItemsPerPage,
  setTotalPages,
} from "../../redux/shopSlice";
import { useNavigate } from "react-router-dom";
import showToast from "../../components/Toast/Toaster";

const DiamondsGrid = ({ diamond }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.user?.UserId);
  const { totalPages, currentPage, itemsPerPage } = useSelector(
    (state) => state.shop
  );

  const { data, error, isLoading } = useFetchDiamondsQuery({
    pageNumber: currentPage,
    pageSize: itemsPerPage,
  });
  const diamonds = data?.result?.data || [];

  useEffect(() => {
    if (data?.result?.totalPages) {
      dispatch(setTotalPages(data.result.totalPages));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartCount(userId));
    }
  }, [userId]);

  const handleAddToCart = (diamond) => {
    if (!userId) {
      showToast.warning("Please log in to add items to the cart.");
      return;
    }

    const cartItem = {
      SKU: diamond.SKU,
      Quantity: 1,
    };

    dispatch(addToCart(cartItem, userId));
  };

  const [anchorEl, setAnchorEl] = useState(null);

  if (isLoading) return <DiamondLoader />;
  if (error) return <p className="error">{error.message}</p>;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (perPage) => {
    if (typeof perPage === "number") {
      dispatch(setItemsPerPage(perPage));
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
            <div
              className="diamond-card"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/diamonddetail", { state: { diamond } });
              }}
            >
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
              <p className="price">${diamond.Amount.toFixed(2)}</p>
              <span
                className="add-to-cart"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(diamond);
                }}
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
