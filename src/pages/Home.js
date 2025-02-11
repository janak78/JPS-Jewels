import React, { useEffect, useState } from "react";
import image1 from "../assets/images/slide-1-asset-2-1.webp";
import image2 from "../assets/images/slide-1-asset-3.webp";
import image3 from "../assets/images/slide-1-asset-4.webp";
import rings from "../assets/images/rings (1).svg";
import bracelete from "../assets/images/bracelet.svg";
import chain from "../assets/images/chain.svg";
import choker from "../assets/images/choker (1).svg";
import cufflinks from "../assets/images/cufflinks.svg";
// import earrings from "../assets/images/earrings.svg";
import gemstone from "../assets/images/gemstone.svg";
import giftset from "../assets/images/gift.svg";
import curtain1 from "../assets/images/curtain-1.webp";
import curtain3 from "../assets/images/curtain-3.webp";
import curtain5 from "../assets/images/curtain-5.webp";
import curtain2 from "../assets/images/curtain-2.webp";
import bannerback6 from "../assets/images/banner-back-6.webp";
import bannernack7 from "../assets/images/banner-back-7.webp";
import vintage from "../assets/images/Vintage.svg";
import romance from "../assets/images/Rommance.svg";
import celestial from "../assets/images/Celestial.svg";
import goddess from "../assets/images/Goddess.svg";
import opulence from "../assets/images/Opulence.svg";
import charm from "../assets/images/Charm.svg";
import forest from "../assets/images/Forest.svg";
import luxer from "../assets/images/Luxer.svg";
import retro from "../assets/images/Retro-Revival.svg";
import eastern from "../assets/images/Eastern.svg";
import shop1 from "../assets/images/tripple-banner-img-2.webp";
import shop2 from "../assets/images/tripple-banner-img-3.webp";
import shop3 from "../assets/images/tripple-banner-img-1.webp";
import "./Home.css";

const images = [image1, image2, image3];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
                <button className="cardshopnow">Shop Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      <div className="category-carousel">
        <div className="category-container">
          <div className="category-item">
            <img src={rings} alt="Rings" />
            <span>RINGS</span>
          </div>
          <div className="category-item">
            <img src={bracelete} alt="Bracelet" />
            <span>BRACELET</span>
          </div>
          <div className="category-item">
            <img src={chain} alt="Chain" />
            <span>CHAIN</span>
          </div>
          <div className="category-item">
            <img src={choker} alt="Chocker" />
            <span>CHOCKER</span>
          </div>
          <div className="category-item">
            <img src={cufflinks} alt="Cufflinks" />
            <span>CUFFLINKS</span>
          </div>
          <div className="category-item">
            <img src={cufflinks} alt="Earrings" />
            <span>EARRINGS</span>
          </div>
          <div className="category-item">
            <img src={gemstone} alt="Gemstone" />
            <span>GEMSTONE</span>
          </div>
          <div className="category-item">
            <img src={giftset} alt="Gift Set" />
            <span>GIFT SET</span>
          </div>
        </div>
      </div>
      <section class="collection-section">
        <h2 class="shop-by-brands-title">New Collection</h2>

        <div class="collection-grid">
          <div class="collection-item large">
            <div class="curtain1">
              <img src={curtain1} alt="Jewelry Model" />
            </div>
          </div>

          <div class="collection-item small">
            <div>
              <img src={curtain3} alt="Hand with Rings" />
            </div>
            <div class="collection-text">
              <h3>Discover New Arrivals</h3>
              <a href="#" class="discover-button">
                Discover more
              </a>
            </div>
          </div>

          <div class="collection-item small">
            <div class="curtain3">
              <img src={curtain5} alt="Necklace Close-up" />
            </div>
            <div class="collection-text">
              <h3>Jewelry Tells a Great Story</h3>
              <a href="#" class="discover-button">
                Discover more
              </a>
            </div>
          </div>

          <div class="collection-item large">
            <div class="curtain5">
              <img src={curtain2} alt="Woman with Necklace" />
            </div>
          </div>
        </div>
      </section>

      <section class="collection-container">
        <div class="collection-box left-box">
          <img src={bannerback6} alt="Wedding Ring" class="collection-image" />
          <div class="collection-content">
            <p class="collection-title">NEW COLLECTION</p>
            <h2 class="collection-heading">WEDDING RINGS</h2>
            <p class="collection-description">
              Celebrate your love with our exquisite collection of wedding
              rings.
            </p>
            <a href="#" class="collection-button">
              Discover more
            </a>
          </div>
        </div>

        <div class="collection-box right-box">
          <div class="collection-content">
            <p class="collection-title">TIMELESS BEAUTY</p>
            <h2 class="collection-heading">LUXURY WATCHES</h2>
            <p class="collection-description">
              Discover the perfect accessory that defines your unique sense of
              luxury.
            </p>
            <a href="#" class="collection-button">
              Discover more
            </a>
          </div>
          <img src={bannernack7} alt="Luxury Watch" class="collection-image" />
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
                <a href="#" title="Celestial">
                  <img
                    decoding="async"
                    src={celestial}
                    alt="Celestial"
                    className="large-img"
                  />
                </a>
              </li>
              <li className="clients-item custom-item">
                <a href="#" title="Charm">
                  <img
                    decoding="async"
                    src={charm}
                    alt="Charm"
                    className="large-img"
                  />
                </a>
              </li>
              <li className="clients-item custom-item">
                <a href="#" title="Eastern">
                  <img
                    decoding="async"
                    src={eastern}
                    alt="Eastern"
                    className="large-img"
                  />
                </a>
              </li>
              <li className="clients-item custom-item">
                <a href="#" title="Forest">
                  <img
                    decoding="async"
                    src={forest}
                    alt="Forest"
                    className="large-img"
                  />
                </a>
              </li>
              <li className="clients-item custom-item">
                <a href="#" title="Goddess">
                  <img
                    decoding="async"
                    src={goddess}
                    alt="Goddess"
                    className="large-img"
                  />
                </a>
              </li>
            </ul>
          </li>
        </ul>

        {/* {/ Lower 5 Images /} */}
        <ul className="swiper-wrapper custom-carousel lower-carousel">
          <li className="row-item swiper-slide">
            <ul className="image-list">
              <li className="clients-item custom-item">
                <a href="#" title="Luxer">
                  <img
                    decoding="async"
                    src={luxer}
                    alt="Luxer"
                    className="large-img"
                  />
                </a>
              </li>
              <li className="clients-item custom-item">
                <a href="#" title="Opulence">
                  <img
                    decoding="async"
                    src={opulence}
                    alt="Opulence"
                    className="large-img"
                  />
                </a>
              </li>
              <li className="clients-item custom-item">
                <a href="#" title="Revival">
                  <img
                    decoding="async"
                    src={retro}
                    alt="Revival"
                    className="large-img"
                  />
                </a>
              </li>
              <li className="clients-item custom-item">
                <a href="#" title="Romance">
                  <img
                    decoding="async"
                    src={romance}
                    alt="Romance"
                    className="large-img"
                  />
                </a>
              </li>
              <li className="clients-item custom-item">
                <a href="#" title="Vintage">
                  <img
                    decoding="async"
                    src={vintage}
                    alt="Vintage"
                    className="large-img"
                  />
                </a>
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
            <a href="#" className="shop-link">
              Discover more
            </a>
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
            <a href="#" className="shop-link">
              Discover more
            </a>
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
            <a href="#" className="shop-link">
              Discover more
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
