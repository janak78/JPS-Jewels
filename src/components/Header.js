  import React, { useEffect, useState } from "react";
import "./Header.css";
import logo from "../assets/images/logo.svg";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      {/* Left Logo */}
      <div className="logo">
        <img src={logo} alt="JPS Jewels" className="logo-image" />
      </div>

      {/* Navigation Links (Hidden on Small Screens) */}
      <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>
        <a href="/" className="nav-link active">HOME</a>
        <a href="#diamond" className="nav-link">DIAMOND</a>
        <a href="#about" className="nav-link">ABOUT US</a>
        <a href="#contact" className="nav-link">CONTACT US</a>
      </nav>

      {/* Right Section: Icons + Mobile Menu */}
      <div className="right-section">
        {/* Icons */}
        <div className="icons">
          <i className="fa-solid fa-magnifying-glass icon"></i>

          {/* Cart Icon with Badge */}
          <div className="cart-icon-container">
            <i className="fa-solid fa-cart-shopping icon"></i>
            <span className="cart-badge">3</span> {/* Dynamic cart count */}
          </div>

          <i className="fa-regular fa-user icon"></i>
        </div>

        {/* Mobile Menu Toggle (Only Visible Below 768px) */}
        <div className="mobile-menu" onClick={toggleMenu}>
          <i className={`fa-solid ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
