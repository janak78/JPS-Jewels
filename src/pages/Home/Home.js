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
import { fetchCaretData } from "../../redux/shopSlice";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const diamonds = useSelector((state) => state.shop.caretData);
  const userId = useSelector((state) => state.auth?.user?.UserId);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);   
  }, []);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(fetchCaretData());
      hasFetched.current = true;
    }
  }, [dispatch]);

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

  return (
    <>
      <div className="hero border-1 pb-3">
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
        <div className="caretdata row w-100">
          {diamonds.map((diamond, index) => (
            <div key={index} className="col-lg-2 col-md-4 col-sm-6">
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
                <p className="price">
                  <span>Amount:</span> ${diamond.Amount.toFixed(2)}
                </p>
                <p className="price">
                  <span>Price/ct:</span> ${diamond.Price.toFixed(2)}
                </p>
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
