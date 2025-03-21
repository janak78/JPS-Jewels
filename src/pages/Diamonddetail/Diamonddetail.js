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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchDiamondDetail } from "../../redux/diamondDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { addToCart } from "../../redux/cartSlice";
import { fetchCartCount } from "../../redux/cartSlice";
import showToast from "../../components/Toast/Toaster";
import { fetchSimilarDiamonds } from "../../redux/shopSlice";
import DiamondLoader from "../../components/Loader/loader";
import noitem from "../../assets/images/not found.png";

const Diamonddetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const diamond = location.state?.diamond;
  const { SKU } = useParams();

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
  const [isloading, setIsLoading] = useState(true);
  const [itsLoading, setItsLoading] = useState(true);

  const dispatch = useDispatch();
  const { diamondDetail, loading, error } = useSelector(
    (state) => state.diamondDetail
  );
  useEffect(() => {
    if (SKU) {
      setIsLoading(true); // Start loading
      dispatch(fetchDiamondDetail(SKU)).finally(() => setIsLoading(false));
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
  if (diamondData?.Carats && diamondData?.Color && diamondData?.Clarity && diamondData?.Shape) {
    setItsLoading(true);
    dispatch(
      fetchSimilarDiamonds(
        diamondData.Carats,
        diamondData.Color,
        diamondData.Clarity,
        diamondData.Shape
      )
    ).finally(() => setItsLoading(false));
  } else {
    console.warn("diamondData is missing required properties:", diamondData);
  }
}, [dispatch, diamondData]);


  // useEffect(() => {
  //   dispatch(fetchCaretData());
  // }, [dispatch]);

  const handleVideoClick = () => {
    setOpenVideoModal(true);
  };

  const handleCertificateClick = () => {
    setOpenCertificateModal(true);
    setIsLoading(true);
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
  const handleAddToCart = (diamondData, shouldShowToast) => {
    if (!userId) {
      showToast.warning("Please log in to add items to the cart.");
      return;
    }

    const cartItem = {
      SKU: diamondData.SKU,
      Quantity: 1,
    };

    dispatch(addToCart(cartItem, userId, shouldShowToast));
  };
  useEffect(() => {
    if (diamondData && diamondData.SKU && diamondData.Carats && diamondData.Amount) {
      let visitedDiamonds =
        JSON.parse(localStorage.getItem("visitedDiamonds")) || [];

      // Avoid duplicates
      if (!visitedDiamonds.find((d) => d.SKU === diamondData.SKU)) {
        visitedDiamonds.unshift(diamondData); // Add new diamondData to the beginning

        localStorage.setItem(
          "visitedDiamonds",
          JSON.stringify(visitedDiamonds)
        );

        setVisitedDiamonds([...visitedDiamonds]); // Update state immediately
      }
    }
  }, [diamondData]);

  useEffect(() => {
    const storedDiamonds =
      JSON.parse(localStorage.getItem("visitedDiamonds")) || [];
    setVisitedDiamonds(storedDiamonds);
  }, []);

  useEffect(() => {
    if (!loading && similarDiamonds && diamondData?.length > 0) {
      setItsLoading(false); // Stop loading when everything is ready
    }
  }, [loading, similarDiamonds, diamondDetail]);

  if (loading) return <DiamondLoader />;
  if (error)
    return (
      <div
        style={{
          height: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "600",
          color: "#444",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
          padding: "20px",
          // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <img
          src={noitem}
          alt="No Data"
          style={{
            width: "80px",
            marginBottom: "15px",
            opacity: "0.7",
          }}
        />
        <p>No diamond found. it has ben already ordered or deleted.</p>
      </div>
    );
  if (!diamondDetail)
    return (
      <div
        style={{
          height: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "600",
          color: "#444",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
          padding: "20px",
          // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <img
          src={noitem}
          alt="No Data"
          style={{
            width: "80px",
            marginBottom: "15px",
            opacity: "0.7",
          }}
        />
        <p>No diamond found.</p>
      </div>
    );

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
                {/* Loader - shown when loading */}
                {isloading && (
                  <div style={{ textAlign: "center", margin: "20px 0" }}>
                    <DiamondLoader />
                  </div>
                )}

                {/* Iframe - hidden while loading */}
                <iframe
                  width="100%"
                  height="600"
                  src={diamondData?.certificateUrl}
                  title="Diamond Certificate"
                  frameBorder="0"
                  onLoad={() => setIsLoading(false)} // Set loading to false when iframe loads
                  style={{ display: isloading ? "none" : "block" }} // Hide iframe while loading
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
                  handleAddToCart(diamondData, true);
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
                  handleAddToCart(diamondData, false);
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

        {/* <div className="similar-diamonds-section">
          <h3>Similar Diamonds</h3>
          {similarDiamonds.length === 0 ? (
            <p>No similar diamonds found.</p>
          ) : (
            <Grid container spacing={2} className="mt-3">
              {similarDiamonds.slice(0, visibleCount).map((diamond, index) => (
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
          )}
        </div> */}
        <div className="similar-diamonds-section">
          <h3 className="shop-by-brands-title">Similar Diamonds</h3>
          {similarDiamonds.length === 0 ? (
            <p>No similar diamonds found.</p>
          ) : (
            <div className="row">
              {similarDiamonds.slice(0, visibleCount).map((diamond, index) => (
                <div
                  key={index}
                  className="col-xl-3 col-lg-3 col-md-4 col-sm-6 mb-20"
                >
                  <div
                    className="diamond-card"
                    onClick={(e) => {
                      e.stopPropagation();
                      // navigate("/diamonddetail", { state: { diamond } });
                      navigate(`/diamonddetail/${diamond.SKU}`);
                    }}
                  >
                    <div className="shopimg">
                      <img
                        src={diamond.Image}
                        alt={diamond.Shape}
                        className="diamond-img"
                      />
                    </div>
                    <div class="dimond-content">
                      <h6 className="diamond-name">
                        {diamond.Carats} CARAT {diamond.Shape} - {diamond.Lab}
                      </h6>
                      <p className="price">
                        <span>Amount:</span> ${diamond.Amount.toFixed(2)}
                      </p>
                      <p className="price">
                        <span>Price per carat:</span> $
                        {diamond.Price.toFixed(2)}
                      </p>
                      <span
                        className="add-to-cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(diamond, true);
                        }}
                      >
                        Add to cart <i class="fa-solid fa-arrow-right"></i>
                        {/* <span className="">→</span> */}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <h3 className="mt-3 shop-by-brands-title">Recently Visited Diamonds</h3>
        {/* <Grid container spacing={2} className="mt-3">
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
        </Grid> */}

        <div className="row">
          {visitedDiamonds.slice(0, visibleCount).map((diamond, index) => (
            <div
              key={index}
              className="col-xl-3 col-lg-3 col-md-4 col-sm-6 mb-20"
            >
              <div
                className="diamond-card"
                onClick={(e) => {
                  e.stopPropagation();
                  // navigate("/diamonddetail", { state: { diamond } });
                  navigate(`/diamonddetail/${diamond.SKU}`);
                }}
              >
                <div className="shopimg">
                  <img
                    src={diamond.Image}
                    alt={diamond.Shape}
                    className="diamond-img"
                  />
                </div>
                <div class="dimond-content">
                  <h6 className="diamond-name">
                    {diamond.Carats} CARAT {diamond.Shape} - {diamond.Lab}
                  </h6>
                  <p className="price">
                    <span>Amount:</span> ${diamond.Amount}
                  </p>
                  <p className="price">
                    <span>Price per carat:</span> ${diamond.Price}
                  </p>
                  <span
                    className="add-to-cart"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(diamond, true);
                    }}
                  >
                    Add to cart <i class="fa-solid fa-arrow-right"></i>
                    {/* <span className="">→</span> */}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < visitedDiamonds.length && (
          <div className="view-btnalign mt-3">
            <button className="view-morebtn btn" onClick={handleViewMore}>
              View More <i class="fa-solid fa-arrow-right"></i>
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
