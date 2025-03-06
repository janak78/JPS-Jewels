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
import { useLocation, useNavigate } from "react-router-dom";
import { fetchDiamondDetail } from "../../redux/diamondDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { addToCart } from "../../redux/cartSlice";
import { fetchCartCount } from "../../redux/cartSlice";
import showToast from "../../components/Toast/Toaster";
import { fetchCaretData, fetchSimilarDiamonds } from "../../redux/shopSlice";

const Diamonddetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const diamond = location.state?.diamond;
  const { SKU } = diamond || {};

  const diamonds = useSelector((state) => state.shop.caretData);
  const [visitedDiamonds, setVisitedDiamonds] = useState([]);

  const [visibleCount, setVisibleCount] = useState(8);

  const handleViewMore = () => {
    setVisibleCount(visitedDiamonds.length);
  };

  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [isAddToCart, setIsAddToCart] = useState(false);
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

  const diamondData = diamondDetail?.[0] || {};

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartCount(userId));
    }
  }, [userId]);

  const similarDiamonds = useSelector((state) => state.shop.similarDiamonds);

  useEffect(() => {
    if (diamond) {
      dispatch(
        fetchSimilarDiamonds(
          diamond.Carats,
          diamond.Color,
          diamond.Clarity,
          diamond.Shape
        )
      );
    }
  }, [dispatch, diamond]);

  // useEffect(() => {
  //   dispatch(fetchCaretData());
  // }, [dispatch]);

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
  const handleAddToCart = (diamond, shouldShowToast) => {
    if (!userId) {
      showToast.warning("Please log in to add items to the cart.");
      return;
    }

    const cartItem = {
      SKU: diamond.SKU,
      Quantity: 1,
    };

    dispatch(addToCart(cartItem, userId, shouldShowToast));
  };
  useEffect(() => {
    if (diamond) {
      let visitedDiamonds =
        JSON.parse(localStorage.getItem("visitedDiamonds")) || [];
  
      // Avoid duplicates
      if (!visitedDiamonds.find((d) => d.SKU === diamond.SKU)) {
        visitedDiamonds.unshift(diamond); // Add new diamond to the beginning
  
        localStorage.setItem(
          "visitedDiamonds",
          JSON.stringify(visitedDiamonds)
        );
  
        setVisitedDiamonds([...visitedDiamonds]); // Update state immediately
      }
    }
  }, [diamond]);
  

  useEffect(() => {
    const storedDiamonds =
      JSON.parse(localStorage.getItem("visitedDiamonds")) || [];
    setVisitedDiamonds(storedDiamonds);
  }, []);

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
                  handleAddToCart(diamond, true);
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(diamond, false);
                  navigate("/checkout");
                }}
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
                    "&:focus": { outline: "none" },
                    "&:active": { outline: "none" },
                    "&:hover": { outline: "none" },
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
                  <div
                    style={{
                      overflowX: "auto",
                      scrollbarWidth: "thin",
                      width: "100%",
                    }}
                  >
                    <Table
                      className="diamond-product-info-table"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    >
                      <TableBody>
                        {[
                          [
                            "Lab",
                            diamondData?.Lab ? diamondData?.Lab : "N/A",
                            "Fluorescence",
                            diamondData?.FluoInt ? diamondData?.FluoInt : "N/A",
                          ],
                          [
                            "Certificate No",
                            diamondData?.CertificateNo
                              ? diamondData?.CertificateNo
                              : " N/A",
                            "Rap $",
                            diamondData?.Rap ? diamondData?.Rap : "N/A",
                          ],
                          [
                            "Diamond Type",
                            diamondData?.DiamondType
                              ? diamondData?.DiamondType
                              : "N/A",
                            "Disc %",
                            diamondData?.Disc ? diamondData?.Disc : "N/A",
                          ],
                          [
                            "Shape",
                            diamondData?.Shape ? diamondData?.Shape : "N/A",
                            "Price $/ct",
                            diamondData?.Price ? diamondData?.Price : "N/A",
                          ],
                          [
                            "Carat",
                            diamondData?.Carats ? diamondData?.Carats : "N/A",
                            "Amount $",
                            diamondData?.Amount ? diamondData?.Amount : "N/A",
                          ],
                          [
                            "Color",
                            diamondData?.Color ? diamondData?.Color : "N/A",
                            "Depth",
                            diamondData?.Depth ? diamondData?.Depth : "N/A",
                          ],
                          [
                            "Clarity",
                            diamondData?.Clarity ? diamondData?.Clarity : "N/A",
                            "Table",
                            diamondData?.Table ? diamondData?.Table : "N/A",
                          ],
                          [
                            "Cut",
                            diamondData?.Cut ? diamondData?.Cut : "N/A",
                            "EyeClean",
                            diamondData?.EyeC ? diamondData?.EyeC : "N/A",
                          ],
                          [
                            "Polish",
                            diamondData?.Polish ? diamondData?.Polish : "N/A",
                            "Milky",
                            diamondData?.Milky ? diamondData?.Milky : "N/A",
                          ],
                          [
                            "Symmetry",
                            diamondData?.Symm ? diamondData?.Symm : "N/A",
                            "Tinge",
                            diamondData?.Tinge ? diamondData?.Tinge : "N/A",
                          ],
                        ].map(([key1, value1, key2, value2], index) => (
                          <TableRow
                            key={index}
                            className={getRowClass(key1, value1)}
                          >
                            <TableCell>
                              <strong>{key1}</strong>
                            </TableCell>
                            <TableCell
                              style={{ borderRight: "1px solid #ccc" }}
                            >
                              {value1}
                            </TableCell>
                            <TableCell>
                              <strong>{key2}</strong>
                            </TableCell>
                            <TableCell>{value2}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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

        <div className="similar-diamonds-section">
          <h3>Similar Diamonds</h3>
          {similarDiamonds.length === 0 ? (
            <p>No similar diamonds found.</p>
          ) : (
            <Grid container spacing={2} className="mt-3">
              {similarDiamonds.slice(0, visibleCount).map((diamond, index) => (
                <div className="col-md-3 col-sm-6" key={index}>
                  {console.log(similarDiamonds, "smlrdiamnds")}
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
                    <p className="price">{diamond.Shape}</p>
                    <span
                      className="add-to-cart"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(diamond, true);
                      }}
                    >
                      Add to cart <span className="arrowbtn">→</span>
                    </span>
                  </div>
                </div>
              ))}
            </Grid>
          )}
        </div>

        <h3 className="mt-3">Recently Visited Diamonds</h3>
        <Grid container spacing={2} className="mt-3">
  {visitedDiamonds.slice(0, visibleCount).map((diamond, index) => (
    <div className="col-md-3 col-sm-6" key={index}>
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
        <p className="price">{diamond.Shape}</p>
        <span
          className="add-to-cart"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(diamond, true);
          }}
        >
          Add to cart <span className="arrowbtn">→</span>
        </span>
      </div>
    </div>
  ))}
</Grid>


        {visibleCount < visitedDiamonds.length && (
          <div className="text-center mt-3">
            <button
              className="btn"
              style={{ backgroundColor: "#c9a236" }}
              onClick={handleViewMore}
            >
              View More {">"}
            </button>
          </div>
        )}

        {/* <div>
          <h2 className="shop-by-brands-title">Top Products</h2>
          <div className="caretdata  row w-100">
            {diamonds.map((diamond, index) => (
              <div key={index} className="col-lg-3 col-md-4 col-sm-6">
                <div
                  className="diamond-card1"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/diamonddetail", { state: { diamond } });
                  }}
                >
                  <div className="shopimg1">
                    <img
                      src={diamond.Image}
                      alt={diamond.Shape}
                      className="diamond-img1"
                    />
                  </div>
                  <h6 className="mt-3 diamond-name1">
                    {diamond.Carats} CARAT {diamond.Shape} - {diamond.Lab}
                  </h6>
                  <p className="price1">${diamond.Amount.toFixed(2)}</p>
                  <span
                    className="add-to-cart1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(diamond);
                    }}
                  >
                    Add to cart <span className="arrowbtn1">→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Diamonddetail;
