import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import "./Diamonddetail.css";
import { useLocation } from "react-router-dom";
import { fetchDiamondDetail } from "../../redux/diamondDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { addToCart } from "../../redux/cartSlice";
import { fetchCartCount } from "../../redux/cartSlice";

const Diamonddetail = () => {
  const location = useLocation();
  const diamond = location.state?.diamond;
  const { SKU } = diamond || {};

  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [openCertificateModal, setOpenCertificateModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const userId = useSelector((state) => state.auth?.user?.UserId);

  const dispatch = useDispatch();
  const { diamondDetail, loading, error } = useSelector(
    (state) => state.diamondDetail
  );
  useEffect(() => {
    if (SKU) {
      dispatch(fetchDiamondDetail(SKU));
    }
  }, [dispatch, SKU]);

  console.log(diamondDetail, "daimond");
  console.log(SKU, "daimond");

  const diamondData = diamondDetail?.[0] || {};

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartCount(userId));
    }
  }, [userId]);

  // Functions to handle modal opening
  const handleVideoClick = () => {
    setOpenVideoModal(true); // Open video modal
  };

  const handleCertificateClick = () => {
    setOpenCertificateModal(true); // Open certificate modal
  };

  // Functions to handle modal closing
  const handleCloseVideoModal = () => {
    setOpenVideoModal(false); // Close video modal
  };

  const handleCloseCertificateModal = () => {
    setOpenCertificateModal(false); // Close certificate modal
  };

  const handleImageClick = () => {
    setOpenImageModal(true); // Open the image modal
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false); // Close the image modal
  };

  const getRowClass = (key, value) => {
    if (key === "Color" && value === "D") return "highlight-color";
    if (key === "Clarity" && value === "VS1") return "highlight-clarity";
    if (key === "Fluorescence" && value === "NON") return "highlight-fluo";
    return "";
  };

  // add cart
  const handleAddToCart = (diamond) => {
    if (!userId) {
      alert("Please log in to add items to the cart.");
      return;
    }

    const cartItem = {
      SKU: diamond.SKU,
      Quantity: 1,
    };

    dispatch(addToCart(cartItem, userId));
  };

  if (loading) return <p>Loading diamond details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!diamondDetail) return <p>No diamond data found.</p>;

  return (
    <div className="diamond-product-container">
      <div className="diamond-product-wrapper">
        <Grid container spacing={3} className="maingrid">
          {/* Left Side - Diamond Image */}
          <Grid item xs={12} md={4} className="diamond-product-image-container">
            <img
              src={diamondData?.Image}
              alt="Diamond"
              className="diamond-product-image"
              style={{ cursor: "pointer" }}
              onClick={handleImageClick}
            />
          </Grid>
          <Dialog
            open={openImageModal}
            onClose={handleCloseImageModal}
            maxWidth="sm"
            fullWidth
          >
            <DialogContent>
              <img
                src={diamondData?.Image}
                alt="Diamond"
                style={{ width: "100%", height: "auto" }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseImageModal}
                variant="contained"
                className="imagemodalbtn"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <Grid
            item
            xs={12}
            md={4}
            className="diamond-product-details-container"
          >
            <h2 className="diamond-product-title">
              {diamondData?.Carats} CARAT {diamondData?.Shape}{" "}
              {diamondData?.Color}/{diamondData?.Clarity} DIAMOND –{" "}
              {diamondData?.Lab} {diamondData?.Cut}
            </h2>
            <p className="diamond-product-sku">
              SKU: {diamondData?.SKU} &nbsp; | &nbsp; Category:{" "}
              <span className="categorytext"> Diamond</span>
            </p>
            <hr className="diamond-description-divider" />

            {/* Buttons */}
            <div className="diamond-product-buttons-container">
              <Button
                variant="contained"
                className="diamond-product-video-btn"
                startIcon={<PlayCircleOutlineIcon />}
                onClick={handleVideoClick}
                fullWidth
              >
                Video
              </Button>
              <Button
                variant="contained"
                className="diamond-product-certificate-btn"
                startIcon={<DescriptionIcon />}
                onClick={handleCertificateClick}
                fullWidth
              >
                Certificate
              </Button>
            </div>

            {/* Video dialog */}
            <Dialog
              open={openVideoModal}
              onClose={handleCloseVideoModal}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>Diamond Video</DialogTitle>
              <DialogContent>
                <iframe
                  width="100%"
                  height="400"
                  src={diamondData?.Video}
                  title="Diamond Video"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseVideoModal}
                  className="imagemodalbtn"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            {/* Diamond Dialog */}
            <Dialog
              open={openCertificateModal}
              onClose={handleCloseCertificateModal}
              maxWidth="xl"
              fullWidth
            >
              <DialogTitle>Diamond Certificate</DialogTitle>
              <DialogContent>
                <iframe
                  width="100%"
                  height="600"
                  src={diamondData?.certificateUrl}
                  title="Diamond Certificate"
                  frameBorder="0"
                ></iframe>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseCertificateModal}
                  className="imagemodalbtn"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            {/* Price */}
            <p className="diamond-product-price">
              ${diamondData?.Amount?.toFixed(2)}
            </p>

            {/* Quantity Input */}
            <TextField
              type="number"
              variant="outlined"
              size="small"
              value={1}
              inputProps={{ min: 1, max: 1, readOnly: true }}
              className="diamond-product-quantity-input no-outline"
              fullWidth
            />

            {/* Cart and Buy Buttons */}
            <div className="diamond-product-cart-buttons">
              <Button
                variant="outlined"
                className="diamond-product-cart-btn"
                startIcon={<ShoppingCartIcon />}
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(diamond);
                }}
              >
                Add to cart
              </Button>
            </div>
            <div className="diamond-product-cart-buttons">
              <Button
                variant="contained"
                className="diamond-product-buy-btn"
                fullWidth
              >
                Buy now
              </Button>
            </div>
          </Grid>
          {/* <Grid item xs={12} md={4}>
            <Card className="diamond-product-info-card">
              <h3 className="diamond-product-info-title">
                Product Information
              </h3>
              <Table className="diamond-product-info-table">
                <TableBody>
                  {[
                    ["Lab", `${diamondData?.Lab}`],
                    ["Certificate No", `${diamondData?.CertificateNo}`],
                    ["Diamond Type", "N/A"],
                    ["Shape", `${diamondData?.Shape}`],
                    ["Carat", `${diamondData?.Carats}`],
                    ["Color", `${diamondData?.Color}`],
                    ["Clarity", `${diamondData?.Clarity}`],
                    ["Cut", `${diamondData?.Cut}`],
                    ["Polish", `${diamondData?.Polish}`],
                    ["Symmetry", `${diamondData?.Symm}`],
                    ["Fluorescence", `${diamondData?.FluoInt}`],
                    ["Rap $", `${diamondData?.Rap}`],
                    ["Disc %", `${diamondData?.Disc}`],
                    ["Price $/ct", `${diamondData?.Price}`],
                    ["Amount $", `${diamondData?.Amount}`],
                    ["Depth", `${diamondData?.Depth}`],
                    ["Table", `${diamondData?.Table}`],
                    ["EyeClean", `${diamondData?.EyeC}`],
                    ["Milky", `${diamondData?.Milky}`],
                    ["Tinge", `${diamondData?.Tinge}`],
                  ].map(([key, value], index) => (
                    <TableRow key={index}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </Grid> */}
          <Grid item xs={12} md={4}>
            <Card className="diamond-product-info-card">
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    outline: "none",
                    border: "none",
                    "&:focus": { outline: "none" }, // Removes outline on focus
                    "&:active": { outline: "none" }, // Removes outline on click
                    "&:hover": { outline: "none" }, // Removes outline on hover
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ borderBottom: "1px solid #000" }}
                  >
                    Product Information
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Table className="diamond-product-info-table">
                    <TableBody>
                      {[
                        ["Lab", diamondData?.Lab],
                        ["Certificate No", diamondData?.CertificateNo],
                        ["Diamond Type", "N/A"],
                        ["Shape", diamondData?.Shape],
                        ["Carat", diamondData?.Carats],
                        ["Color", diamondData?.Color],
                        ["Clarity", diamondData?.Clarity],
                        ["Cut", diamondData?.Cut],
                        ["Polish", diamondData?.Polish],
                        ["Symmetry", diamondData?.Symm],
                        ["Fluorescence", diamondData?.FluoInt],
                        ["Rap $", diamondData?.Rap],
                        ["Disc %", diamondData?.Disc],
                        ["Price $/ct", diamondData?.Price],
                        ["Amount $", diamondData?.Amount],
                        ["Depth", diamondData?.Depth],
                        ["Table", diamondData?.Table],
                        ["EyeClean", diamondData?.EyeC],
                        ["Milky", diamondData?.Milky],
                        ["Tinge", diamondData?.Tinge],
                      ].map(([key, value], index) => (
                        <TableRow
                          key={index}
                          className={getRowClass(key, value)}
                        >
                          <TableCell>{key}</TableCell>
                          <TableCell>{value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionDetails>
              </Accordion>
            </Card>
          </Grid>
        </Grid>

        <hr className="diamond-description-divider" />

        {/* Description Title */}
        <h3 className="diamond-description-title">DESCRIPTION</h3>

        {/* Description Text */}
        <p className="diamond-description-text">
          Discover the brilliance of this exquisite diamond, showcasing a{" "}
          {diamondData?.Shape} cut that exudes timeless elegance. With a weight
          of {diamondData?.Carats} carats, this diamond boasts a{" "}
          {diamondData?.Color} color grade and an exceptional{" "}
          {diamondData?.Clarity} clarity rating, ensuring unparalleled visual
          perfection. Crafted to perfection, the diamond features an{" "}
          {diamondData?.Cut} cut, {diamondData?.Polish} polish, and{" "}
          {diamondData?.Symm} symmetry, resulting in maximum brilliance and
          fire.
        </p>

        <p className="diamond-description-text">
          It is certified by the prestigious {diamondData?.Lab} under
          certificate number {diamondData?.CertificateNo}, guaranteeing
          authenticity and quality. The diamond measures {diamondData?.Depth}{" "}
          depth and {diamondData?.Table} table, optimized for stunning light
          performance. With no fluorescence and a commitment to being{" "}
          {diamondData?.EyeC}, this gem is a flawless addition to your
          collection. Whether for an engagement, anniversary, or any special
          occasion, this diamond is the epitome of beauty and luxury.
        </p>
      </div>
    </div>
  );
};

export default Diamonddetail;
