import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import image1 from "../../assets/images/slide-1-asset-2-1.webp";
import image2 from "../../assets/images/slide-1-asset-3.webp";
import image3 from "../../assets/images/slide-1-asset-4.webp";
import rings from "../../assets/images/rings (1).svg";
import bracelete from "../../assets/images/bracelet.svg";
import chain from "../../assets/images/chain.svg";
import choker from "../../assets/images/choker (1).svg";
import cufflinks from "../../assets/images/cufflinks.svg";
import earrings from "../../assets/images/earrings.svg";
import gemstone from "../../assets/images/gemstone.svg";
import giftset from "../../assets/images/gift.svg";
import necklace from "../../assets/images/necklace.svg";
import watch from "../../assets/images/watch.svg";
import ster from "../../assets/images/diamond-pendant.svg";
import curtain1 from "../../assets/images/curtain-1.webp";
import curtain3 from "../../assets/images/curtain-3.webp";
import curtain5 from "../../assets/images/curtain-5.webp";
import curtain2 from "../../assets/images/curtain-2.webp";
import bannerback6 from "../../assets/images/banner-back-6.webp";
import bannernack7 from "../../assets/images/banner-back-7.webp";
import vintage from "../../assets/images/Vintage.svg";
import romance from "../../assets/images/Rommance.svg";
import celestial from "../../assets/images/Celestial.svg";
import goddess from "../../assets/images/Goddess.svg";
import opulence from "../../assets/images/Opulence.svg";
import charm from "../../assets/images/Charm.svg";
import forest from "../../assets/images/Forest.svg";
import luxer from "../../assets/images/Luxer.svg";
import retro from "../../assets/images/Retro-Revival.svg";
import eastern from "../../assets/images/Eastern.svg";
import shop1 from "../../assets/images/tripple-banner-img-2.webp";
import shop2 from "../../assets/images/tripple-banner-img-3.webp";
import shop3 from "../../assets/images/tripple-banner-img-1.webp";
import "./Home.css";
import showToast from "../../components/Toast/Toaster";
import { addToCart } from "../../redux/cartSlice";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
} from "@mui/material";
import { fetchShapeData, setShape } from "../../redux/shopSlice";

const images = [image1, image2, image3];

const categories = [
  { img: rings, name: "RINGS" },
  { img: bracelete, name: "BRACELET" },
  { img: chain, name: "CHAIN" },
  { img: choker, name: "CHOCKER" },
  { img: cufflinks, name: "CUFFLINKS" },
  { img: earrings, name: "EARRINGS" },
  { img: gemstone, name: "GEMSTONE" },
  { img: giftset, name: "GIFT SET" },
  { img: necklace, name: "NECKLACE" },
  { img: watch, name: "WATCH" },
  { img: ster, name: "STERLING" },
];

const Home = () => {
  const baseUrl = process.env.REACT_APP_BASE_API;

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  // const diamonds = useSelector((state) => state.shop.caretData);
  const userId = useSelector((state) => state.auth?.user?.UserId);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // const [shape, setShape] = useState([]);

  const icon = [
    { name: "All", value: "" },
    { icon: "", name: "Round", value: "RBC" },
    { icon: "", name: "Oval", value: "Oval" },
    { icon: "", name: "Pear", value: "Pear" },
    // { icon: "", name: "Cush Mod", value: "" },
    // { icon: "", name: "Cush Brill", value: "" },
    { icon: "", name: "Emerald", value: "Emerald" },
    { icon: "", name: "Radiant", value: "Radiant" },
    { icon: "", name: "Princess", value: "Princess" },
    // { icon: "", name: "Asscher", value: "" },
    // { icon: "", name: "Square", value: "" },
    { icon: "", name: "Marquise", value: "Marquise" },
    { icon: "", name: "Heart", value: "Heart" },
    // { icon: "", name: "Trilliant", value: "" },
    // { icon: "", name: "Euro Cut", value: "" },
    // { icon: "", name: "Old Miner", value: "" },
    // { icon: "", name: "Briolette", value: "" },
    // { icon: "", name: "Rose Cut", value: "" },
    // { icon: "", name: "Lozenge", value: "" },
    { icon: "", name: "Baguette", value: "BUG" },
    // { icon: "", name: "Tap Bag", value: "" },
    // { icon: "", name: "Half Moon", value: "" },
    // { icon: "", name: "Flanders", value: "" },
    // { icon: "", name: "Trapezoid", value: "" },
    // { icon: "", name: "Bullets", value: "" },
    { icon: "", name: "Kite", value: "KITE" },
    // { icon: "", name: "Shield", value: "" },
    // { icon: "", name: "Star", value: "" },
    // { icon: "", name: "Pentagonal", value: "" },
    // { icon: "", name: "Hexagonal", value: "" },
    // { icon: "", name: "Octagonal", value: "" },
  ];

  // const toggleShape = (name) => {
  //   setShape((prevShapes) =>
  //     prevShapes.includes(name)
  //       ? prevShapes.filter((s) => s !== name)
  //       : [...prevShapes, name]
  //   );
  // };

  // const toggleShape = async (shapeValue) => {
  //   setShape([shapeValue]); // ✅ Set only the selected shape

  //   try {
  //     const response = await AxiosInstance.get(
  //       `${baseUrl}/stock/shapedata?shape=${shapeValue}`
  //     );

  //     if (response.data.result.statusCode === 200) {
  //       dispatch(setCaretData(response.data.result.data)); // ✅ Store in caretData
  //     } else {
  //       dispatch(setCaretData([])); // ✅ Clear if no data
  //       showToast.error("No data found for selected shape.");
  //     }
  //   } catch (error) {
  //     showToast.error("Error fetching data. Try again.");
  //     console.error("API Error:", error);
  //   }
  // };

  // const hasFetched = useRef(false);

  // useEffect(() => {
  //   if (!hasFetched.current) {
  //     dispatch(fetchCaretData());
  //     hasFetched.current = true;
  //   }
  // }, [dispatch]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    if (!carouselRef.current) return;

    let scrollSpeed = 2; // Adjust for smoothness
    let scrollDirection = 1; // 1 for forward, -1 for reverse

    const scrollCarousel = () => {
      if (carouselRef.current) {
        const maxScroll =
          carouselRef.current.scrollWidth - carouselRef.current.clientWidth;

        // Move carousel
        carouselRef.current.scrollLeft += scrollSpeed * scrollDirection;

        // Reverse direction when reaching end/start
        if (carouselRef.current.scrollLeft >= maxScroll) {
          scrollDirection = -1;
        } else if (carouselRef.current.scrollLeft <= 0) {
          scrollDirection = 1;
        }
      }
    };

    const scrollInterval = setInterval(scrollCarousel, 20); // Smooth scrolling

    return () => clearInterval(scrollInterval);
  }, []);

  const handleAddToCart = (diamond, shouldShowToast) => {
    if (!userId) {
      showToast.warning("Please log in to add items to the cart.");
      return;
    }

    const cartItem = {
      SKU: diamond.SKU,
      Quantity: 1,
    };

    dispatch(addToCart(cartItem, userId, shouldShowToast, navigate));
  };

  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 10 }).map(() => ({
      id: Math.random(),
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 0.6 + 0.3}em`,
      animationDuration: `${Math.random() * 5 + 3}s`,
    }));

    setBubbles(newBubbles);
  }, []);

  const { shape, caretData, shapeError } = useSelector((state) => state.shop);

  useEffect(() => {
    dispatch(fetchShapeData());
  }, [dispatch]);

  useEffect(() => {
    if (shape.length > 0) {
      dispatch(fetchShapeData(shape[0]));
    }
  }, [shape, dispatch]);

  const handleShapeClick = (shapeValue) => {
    if (shape.length > 0 && shape[0] === shapeValue) {
      return;
    }
    dispatch(setShape(shapeValue));
    setCurrentPage(0);
  };
  const ITEMS_PER_PAGE = 5;

  const [currentPage, setCurrentPage] = useState(0);

  // Calculate start and end indexes for slicing caretData
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleDiamonds = caretData.slice(startIndex, endIndex);

  // Handle Next Page
  const handleNext = () => {
    if (endIndex < caretData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle Previous Page
  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="hero">
        <div className="wavy-lines">
          {/* First Wavy Line (Lowest) */}
          <svg
            className="wavy-line-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 10000 300"
          >
            <defs>
              <linearGradient id="strokeGradient1">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              d="M0,510 
          C2000,1450 3000,200 4000,100 
          C5000,10 6000,1250 7000,90 
          C8000,30 9000,170 10000,120"
              fill="transparent"
              stroke="url(#strokeGradient1)"
              strokeWidth="45"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="wave-path wave-1"
            />
          </svg>

          {/* Second Wavy Line (Middle) */}
          {/* <svg className="wavy-line-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10000 300">
        <defs>
          <linearGradient id="strokeGradient2">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
           d="M0,250 
           C2000,890 3000,250 4000,100 
           C5000,10 6000,850 7000,90 
           C8000,50 9000,250 10000,199"
    
          fill="transparent"
          stroke="url(#strokeGradient2)"
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="wave-path wave-2"
        />
      </svg> */}

          {/* Third Wavy Line (Highest) */}
          <svg
            className="wavy-line-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 10000 300"
          >
            <defs>
              <linearGradient id="strokeGradient3">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              d="M0,290 
           C2000,1270 3500,250 5000,100 
           C6500,20 8000,450 9500,40 
           C10000,60 10500,270 11000,70"
              fill="transparent"
              stroke="url(#strokeGradient3)"
              strokeWidth="25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="wave-path wave-3"
            />
          </svg>
        </div>

        <div className="card cardbackground text-white border-0">
          {/* Image Slider */}
          <img
            className="card-img img-fluid"
            src={images[currentIndex]}
            alt="Slider"
          />

          {/* Overlay Content */}
          <div className="card-img-overlay d-flex align-items-center">
            <div className="cardtext-style">
              <div className="slider-content">
                <h2 className="timeBeuty">Timeless Beauty</h2>

                <h3 className="timeBeuty">JEWELRY SETS</h3>
                <p className="timeBeuty">GET UP TO 10% OFF</p>

                <p className="brtag">
                  Sparkle and Save: Enjoy our stunning <br />
                  jewelry collection at discounted prices!
                </p>

                <div className="btn-container">
                  <button
                    className="cardshopnow"
                    onClick={() => navigate("/diamond?q=filter")}
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="category-carousel">
        <div className="category-container" ref={carouselRef}>
          {categories.map((category, index) => (
            <>
              <div className="hovername" key={index}>
                <div className="category-item">
                  <img
                    src={category.img}
                    alt={category.name}
                    className="category-icon"
                  />
                </div>
                <span className="category-name">{category.name}</span>
              </div>
            </>
          ))}
        </div>
      </div>

      <section className="collection-section">
        <div className="bubbles-container">
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="bubble"
              style={{
                left: bubble.left,
                top: bubble.top,
                width: bubble.size,
                height: bubble.size,
                animationDuration: bubble.animationDuration,
              }}
            />
          ))}
        </div>
        <div className="wavy-lines-2">
          <svg
            className="wavy-line-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 10000 300"
          >
            <defs>
              <linearGradient id="strokeGradient2">
                <stop
                  offset="0%"
                  stopColor="#D4AF37"
                  stopOpacity="0.2"
                  strokeWidth="65"
                />
                <stop
                  offset="50%"
                  stopColor="#D4AF37"
                  stopOpacity="0.8"
                  strokeWidth="20"
                />
                <stop
                  offset="100%"
                  stopColor="#D4AF37"
                  stopOpacity="1"
                  strokeWidth="45"
                />
              </linearGradient>
            </defs>
            <path
              d="M0,550 C2000,890 3000,250 4000,100 C5000,10 6000,450 7000,190 C8000,250 9000,1550 10000,219"
              fill="transparent"
              stroke="url(#strokeGradient2)"
              strokeWidth="45"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="wave-path wave-2"
            />
          </svg>
        </div>
        <h2 className="shop-by-brands-title">New Collection</h2>
        <div className="collection-grid">
          <div className="collection-item large">
            <div data-aos="fade-right">
              <img src={curtain1} alt="Jewelry Model" />
            </div>
          </div>

          <div className="collection-item small">
            <div data-aos="fade-left">
              <div>
                <img src={curtain3} alt="Hand with Rings" />
              </div>
              <div className="collection-text">
                <h3>Discover New Arrivals</h3>
                <button
                  className="discover-button"
                  onClick={() => navigate("/diamond?q=filter")}
                >
                  Discover more
                </button>
              </div>
            </div>
          </div>

          <div className="collection-item small">
            <div data-aos="fade-right">
              <div className="curtain3">
                <img src={curtain5} alt="Necklace Close-up" />
              </div>
              <div className="collection-text">
                <h3>Jewelry Tells a Great Story</h3>
                <button
                  className="discover-button"
                  onClick={() => navigate("/diamond?q=filter")}
                >
                  Discover more
                </button>
              </div>
            </div>
          </div>

          <div className="collection-item large">
            <div className="curtain5">
              <div data-aos="fade-left">
                <img src={curtain2} alt="Woman with Necklace" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div>
        <h2 className="shop-by-brands-title">TOP PRODUCTS</h2>
        <div className="bg-box mb-3 pb-0">
          <div className="jps-measurements row">
            <div className="col-md-12 col-12 mb-3 ">
              <div item>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ textAlign: "center" }}
                >
                  Select Shape
                </Typography>
              </div>

              <div className="top-product-diamonds">
                <div className="icon-grid">
                  <Grid
                    container
                    spacing={1}
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(80px, auto))",
                      gap: "8px",
                      justifyContent: "center",
                      alignItems: "center",
                      mt: 1,
                    }}
                  >
                    {icon.map((value) => (
                      <Grid
                        key={value.name}
                        item
                        onClick={() => handleShapeClick(value.value)}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          border: shape.includes(value.value)
                            ? "1px solid #1976D2"
                            : "1px solid #ccc",
                          borderRadius: "5px",
                          height: "115px",
                          fontSize: "12px",
                          fontWeight: "500",
                          padding: "8px",
                          cursor: "pointer",
                          backgroundColor: shape.includes(value.value)
                            ? "#1976D250"
                            : "#fff",
                          color: "#000",
                          transition: "background-color 0.3s",
                        }}
                      >
                        <div className="jps-icon">{value.icon}</div>
                        {value.name}
                      </Grid>
                    ))}
                  </Grid>
                  {shapeError && <p style={{ color: "red" }}>{shapeError}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="diamond-container">
          {/* Diamond Display */}
          <div className="caretdata row w-100 p-0 m-0">
            <div className="prev-buttons">
              {shape.includes("") && (
                <button
                  className="pagination-button prev-button"
                  onClick={handlePrevious}
                  disabled={currentPage === 0}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
              )}
            </div>
            {visibleDiamonds.length > 0 ? (
              visibleDiamonds.map((diamond, index) => (
                <div
                  key={index}
                  className="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-20"
                >
                  <div
                    className="diamond-card1"
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
                    <div className="dimond-content">
                      <h6 className="diamond-name">
                        {diamond.Carats} CARAT {diamond.Shape} - {diamond.Lab}
                      </h6>
                      <p className="price">
                        <span>Amount:</span> $
                        {diamond?.Amount ? diamond.Amount.toFixed(2) : "N/A"}
                      </p>
                      <p className="price">
                        <span>Price per carat:</span> $
                        {diamond?.Price ? diamond.Price.toFixed(2) : "N/A"}
                      </p>
                      <span
                        className="add-to-cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(diamond, true);
                        }}
                      >
                        Add to cart <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No diamonds available.</p>
            )}
            <div className="next-buttons">
              {shape.includes("") && (
                <button
                  className="pagination-button next-button"
                  onClick={handleNext}
                  disabled={endIndex >= caretData.length}
                >
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="collection-container">
        <div className="collection-box left-box">
          <img
            src={bannerback6}
            alt="Wedding Ring"
            className="collection-image"
          />
          <div className="collection-content">
            <p className="collection-title">NEW COLLECTION</p>
            <h2 className="collection-heading">WEDDING RINGS</h2>
            <p className="collection-description">
              Celebrate your love with our exquisite collection of wedding
              rings.
            </p>
            <button
              className="collection-button"
              onClick={() => navigate("/diamond?q=filter")}
            >
              Discover more
            </button>
          </div>
        </div>

        <div className="collection-box right-box">
          <div className="collection-content">
            <p className="collection-title">TIMELESS BEAUTY</p>
            <h2 className="collection-heading">LUXURY WATCHES</h2>
            <p className="collection-description">
              Discover the perfect accessory that defines your unique sense of
              luxury.
            </p>
            <button
              className="collection-button"
              onClick={() => navigate("/diamond?q=filter")}
            >
              Discover more
            </button>
          </div>
          <img
            src={bannernack7}
            alt="Luxury Watch"
            className="collection-image"
          />
        </div>
      </section>
      <div id="swiper-custom" className="custom-swiper">
        {/* {/ Shop by Brands Heading /} */}
        <h2 className="shop-by-brands-title">Shop by Brands</h2>

        {/* {/ Upper 5 Images /} */}
        <ul className="swiper-wrapper custom-carousel upper-carousel">
          <li className="row-item swiper-slide">
            <ul className="image-list">
              <li className="clients-item custom-item">
                <p title="Celestial">
                  <img
                    decoding="async"
                    src={celestial}
                    alt="Celestial"
                    className="large-img"
                  />
                </p>
              </li>
              <li className="clients-item custom-item">
                <p title="Charm">
                  <img
                    decoding="async"
                    src={charm}
                    alt="Charm"
                    className="large-img"
                  />
                </p>
              </li>
              <li className="clients-item custom-item">
                <p title="Eastern">
                  <img
                    decoding="async"
                    src={eastern}
                    alt="Eastern"
                    className="large-img"
                  />
                </p>
              </li>
              <li className="clients-item custom-item">
                <p title="Forest">
                  <img
                    decoding="async"
                    src={forest}
                    alt="Forest"
                    className="large-img"
                  />
                </p>
              </li>
              <li className="clients-item custom-item">
                <p title="Goddess">
                  <img
                    decoding="async"
                    src={goddess}
                    alt="Goddess"
                    className="large-img"
                  />
                </p>
              </li>
            </ul>
          </li>
        </ul>

        {/* {/ Lower 5 Images /} */}
        <ul className="swiper-wrapper custom-carousel lower-carousel">
          <li className="row-item swiper-slide">
            <ul className="image-list">
              <li className="clients-item custom-item">
                <p title="Luxer">
                  <img
                    decoding="async"
                    src={luxer}
                    alt="Luxer"
                    className="large-img"
                  />
                </p>
              </li>
              <li className="clients-item custom-item">
                <p title="Opulence">
                  <img
                    decoding="async"
                    src={opulence}
                    alt="Opulence"
                    className="large-img"
                  />
                </p>
              </li>
              <li className="clients-item custom-item">
                <p title="Revival">
                  <img
                    decoding="async"
                    src={retro}
                    alt="Revival"
                    className="large-img"
                  />
                </p>
              </li>
              <li className="clients-item custom-item">
                <p title="Romance">
                  <img
                    decoding="async"
                    src={romance}
                    alt="Romance"
                    className="large-img"
                  />
                </p>
              </li>
              <li className="clients-item custom-item">
                <p title="Vintage">
                  <img
                    decoding="async"
                    src={vintage}
                    alt="Vintage"
                    className="large-img"
                  />
                </p>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="shop-container">
        {/* {/ Jewelry Collection Grid /} */}
        <div className="shop-grid">
          {/* {/ First Row /} */}
          <div className="shop-card">
            <img src={shop1} alt="Wedding Ring" className="shop-image" />
          </div>
          <div className="shop-card shop-text">
            <p className="shop-title">TIMELESS BEAUTY</p>
            <h2 className="shop-heading">ELEGANT EARRINGS</h2>
            <p className="shop-description">
              Discover our exquisite collection of elegant earrings.
            </p>
            <p
              className="shop-link"
              onClick={() => navigate("/diamond?q=filter")}
            >
              Discover more
            </p>
          </div>
          <div className="shop-card">
            <img src={shop2} alt="Luxury Necklace" className="shop-image" />
          </div>

          {/* {/ Second Row /} */}
          <div className="shop-card shop-text">
            <p className="shop-title">NEW COLLECTION</p>
            <h2 className="shop-heading">WEDDING RINGS</h2>
            <p className="shop-description">
              Celebrate your love with our stunning collection.
            </p>
            <p
              className="shop-link"
              onClick={() => navigate("/diamond?q=filter")}
            >
              Discover more
            </p>
          </div>
          <div className="shop-card">
            <img src={shop3} alt="Stud Earrings" className="shop-image" />
          </div>
          <div className="shop-card shop-text">
            <p className="shop-title">MODERN CHARM</p>
            <h2 className="shop-heading">LUXURY NECKLACE</h2>
            <p className="shop-description">
              Elevate your elegance with our luxurious necklaces.
            </p>
            <p
              className="shop-link"
              onClick={() => navigate("/diamond?q=filter")}
            >
              Discover more
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
