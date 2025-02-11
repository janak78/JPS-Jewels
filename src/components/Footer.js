import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../assets/images/logo.svg";
import "./Footer.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate(); 

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo & Description  */}
        <div className="footer-logo">
          <div>
            <img src={logo} alt="JPS Jewels" />
          </div>
          <div className="footer-description">
            Unleash the radiance of your inner beauty with our premium jewelry
            brand - a perfect blend of sophistication and style.
          </div>
        </div>

        {/* {/ Account Section /} */}
        <div className="footer-section">
          <h3>ACCOUNT</h3>
          <a href="#">Dashboard</a>
          <a href="#">Orders</a>
          <a href="#">Wishlist</a>
          <a href="#">Addresses</a>
        </div>

        {/* {/ Diamonds Section /} */}
        <div className="footer-section">
          <h3>DIAMONDS</h3>
          <a href="#">Shop by category</a>
          <a href="#">Shop by brand</a>
          <a href="#">Promotions</a>
        </div>

        {/* {/ Help Section /} */}
        <div className="footer-section">
          <h3>HELP</h3>
          <a href="#">FAQ</a>
          <a href="#">About us</a>
          <a href="#">Contact us</a>
        </div>

        {/* {/ Contact Section /} */}
        <div className="footer-contact">
          <h3>CONTACT US</h3>
          <div>
            <FaPhoneAlt />
            <span>Call us 8 AM - 11 PM</span>
          </div>
          <div>
            <span>+91 9825971176</span>
          </div>
          <div>
            <FaMapMarkerAlt />
            <span>
              315, Shashvat Apartment, <br></br>Pipla Sheri, Mahidharpura,
              <br></br> Surat - 395003
            </span>
          </div>
        </div>
      </div>

      {/* {/ Footer Bottom /} */}
      <div className="fm">
      <div class="footermain">
        <div className="footer-bottom">
          Copyright © 2025 JPS Jewels. All Rights Reserved
        </div>
        <div className="social-icons">
          <a href="#">
            <FaFacebookF />
          </a>
          <a href="#">
            <FaInstagram />
          </a>
          <a href="#">
            <FaTelegram />
          </a>
          <a href="#">
            <FaTwitter />
          </a>
          <a href="#">
            <FaYoutube />
          </a>
        </div>
        <div class="pri-pol">
          <div className="footer-bottom" style={{cursor:"pointer"}} onClick={() => navigate("/termsofuse")}>Terms of use</div>
          <div className="footer-bottom">Privacy Policy</div>
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
