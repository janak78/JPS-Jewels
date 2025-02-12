import React, { useEffect, useState } from "react";
import "./Aboutus.css";
import about1 from "../assets/images/about-1.webp";
import about2 from "../assets/images/about-2.webp";
import about3 from "../assets/images/about-3.webp";
import about4 from "../assets/images/about-4.webp";
import about5 from "../assets/images/about-5.webp";
import rings from "../assets/images/rings (1).svg";
import bracelete from "../assets/images/bracelet.svg";
import chain from "../assets/images/chain.svg";
import choker from "../assets/images/choker (1).svg";
import cufflinks from "../assets/images/cufflinks.svg";
import gemstone from "../assets/images/gemstone.svg";
import giftset from "../assets/images/gift.svg";
import { FaStar } from "react-icons/fa";
import craftsmanshipImg from "./../assets/images/about-us-banner-1.webp";
import whyChooseUsImg from "./../assets/images/about-us-banner-2.webp";
import thumbnailImage from "../assets/images/video.webp";
import videoFile from "../assets/videos/video.mp4";
import image1 from "../assets/images/slide-1-asset-2-1.webp";
import image2 from "../assets/images/slide-1-asset-3.webp";
import image3 from "../assets/images/slide-1-asset-4.webp";
import AOS from "aos";
import "aos/dist/aos.css";

const Aboutus = () => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
      <section className="about-us">
        <h2>ABOUT US</h2>
        <p>
          Welcome to our online jewelry store! We are a team of passionate
          jewelers who strive to bring the best and most exquisite pieces to our
          customers. Our journey began with a simple idea: to create a space
          where everyone can find something special to cherish and wear every
          day. We believe that jewelry is not just an accessory, but an
          extension of one's personality and individuality. Our collection is
          carefully curated to reflect this belief, with each piece being
          handpicked for its timeless elegance and unparalleled quality.
        </p>
        <div className="image-gallery">
          <div className="about1-img" data-aos="fade-right"> 
            <img src={about1} alt="Jewelry 1" />
          </div>
          <div className="about2-img" data-aos="fade-left">
            <img src={about2} alt="Jewelry 2" />
            <img src={about4} alt="Jewelry 3" />
            <img src={about5} alt="Jewelry 4" />
            <img src={about3} alt="Jewelry 5" />
          </div>
        </div>
      </section>
      <section className="our-story">
        <h2>OUR STORY</h2>
        <p>
          At JPS Jewels, our journey began with a simple yet profound passion
          for creating timeless beauty through exquisite jewelry. Founded in the
          heart of a vibrant artisan community, our brand was born from a love
          for intricate craftsmanship and the desire to bring unique,
          high-quality pieces to discerning customers around the world. Each
          piece in our collection is meticulously designed and handcrafted,
          reflecting our commitment to excellence and our deep appreciation for
          the art of jewelry making.
        </p>
        <p>
          Our founder, Joice, has always been inspired by the elegance and
          allure of fine jewelry. With a background in design and a keen eye for
          detail, Joice set out to create a brand that would stand apart in an
          industry filled with mass-produced pieces. By collaborating with
          skilled artisans and sourcing the finest materials, we ensure that
          every item in our collection tells a story of dedication, artistry,
          and love. From classic styles to contemporary designs, JPS Jewels
          offers something special for every occasion, making each moment
          memorable and extraordinary.
        </p>
        <p>
          At JPS Jewels, we believe that jewelry is more than just an accessory;
          it's a form of self-expression and a way to celebrate life's precious
          moments. Our mission is to provide our customers with beautiful,
          high-quality pieces that they can cherish for a lifetime. We are proud
          to be a part of your journey, offering not only stunning jewelry but
          also exceptional service and a personalized shopping experience. Join
          us in celebrating the art of fine jewelry and discover the perfect
          piece that resonates with your unique style and story.
        </p>
        <div className="video-container">
          {/* {/ Thumbnail /} */}
          <div className="thumbnail" onClick={() => setIsOpen(true)}>
            <img
              src={thumbnailImage}
              alt="Thumbnail"
              className="thumbnail-img"
            />
            <div className="play-button">▶</div>
          </div>

          {/* {/ Video Modal /} */}
          {isOpen && (
            <div className="modal-overlay" onClick={() => setIsOpen(false)}>
              <div className="modal-content">
                <video controls autoPlay className="video-player">
                  <source src={videoFile} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="jewelry-container">
        <div className="jewelry-grid">
          {/* {/ First Image /} */}
          <div className="jewelry-item image image1">
            <div data-aos="fade-right">
              <img
                src={craftsmanshipImg}
                alt="Jewelry 1"
                className="jewelry-img"
              />
            </div>
          </div>
          {/* {/ First Text - Appears on the Right /} */}
          <div className="jewelry-item text text1">
            <p className="tagline">ELEGANCE</p>
            <h2 className="title">CRAFTSMANSHIP</h2>
            <p className="aboutdescription">
              We hand-craft our high-end silver and gold jewelry in our own
              production sites and our teams oversee each stage of the process.
              We create jewels every day. We ensure a quick turnaround time,
              international shipping, best prices, and extremely well-finished
              jewelry pieces.
            </p>
          </div>

          {/* {/ Second Text - Appears on the Left /} */}
          <div className="jewelry-item text text2">
            <p className="tagline">EXCELLENCE</p>
            <h2 className="title">WHY CHOOSE US?</h2>
            <p className="aboutdescription">
              Choose our jewelry store for exceptional quality and customer
              service. With a stunning collection of fine jewelry, fast and free
              shipping, and expert customer support, you can shop with
              confidence. Experience the beauty and elegance of fine jewelry
              with unmatched quality and service.
            </p>
          </div>
          {/* {/ Second Image /} */}
          <div className="jewelry-item image image2">
            <div data-aos="fade-left">
              <img
                src={whyChooseUsImg}
                alt="Jewelry 2"
                className="jewelry-img"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="category-section">
        <h2 className="category-title">
          SHOP OUR EXQUISITE JEWELRY COLLECTION TODAY!
        </h2>
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
      </div>

      {/* testinomial */}
      <div className="testimonial-container">
        <h2 className="testimonial-heading">CLIENTS TESTIMONIALS</h2>

        <div className="testimonial-grid">
          {/* {/ First Testimonial /} */}
          <div className="testimonial-card">
            <p className="testimonial-text">
              "The necklace I purchased is absolutely stunning! The
              craftsmanship is impeccable, and it adds a touch of elegance!"
            </p>
            <div className="testimonial-profile">
              <img src={image1} alt="Emily R." />
              <div className="profile-info">
                <h4>Emily R.</h4>
                <div className="stars">
                  <FaStar className="star" />
                  <FaStar className="star" />
                  <FaStar className="star" />
                  <FaStar className="star" />
                  <FaStar className="star" />
                </div>
              </div>
            </div>
          </div>

          {/* {/ Second Testimonial /} */}
          <div className="testimonial-card">
            <p className="testimonial-text">
              "My custom engagement ring exceeded all my expectations. The
              detail and quality are phenomenal, my fiancée couldn't be
              happier."
            </p>
            <div className="testimonial-profile">
              <img src={image2} alt="=Jessey D." />
              <div className="profile-info">
                <h4>Jessey D.</h4>
                <div className="stars">
                  <FaStar className="star" />
                  <FaStar className="star" />
                  <FaStar className="star" />
                  <FaStar className="star" />
                  <FaStar className="star" />
                </div>
              </div>
            </div>
          </div>

          {/* {/ Third Testimonial /} */}
          <div className="testimonial-card">
            <p className="testimonial-text">
              "I adore the vintage bracelet I got from this shop. It’s
              beautifully designed and feels like a unique piece of history."
            </p>
            <div className="testimonial-profile">
              <img src={image3} alt="Sarah M." />
              <div className="profile-info">
                <h4>Sarah M.</h4>
                <div className="stars">
                  <FaStar className="star" />
                  <FaStar className="star" />
                  <FaStar className="star" />
                  <FaStar className="star" />
                  <FaStar className="star" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Aboutus;
