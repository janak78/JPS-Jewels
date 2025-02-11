import React, { useEffect, useState } from "react";
import "./Header.css";
import logo from "../assets/images/logo.svg";
import { Link, useLocation  } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const location = useLocation();

  return (
    <header className="header">
      {/* Left Logo */}
      <div className="logo">
        <img src={logo} alt="JPS Jewels" className="logo-image" />
      </div>

      {/* Navigation Links (Hidden on Small Screens) */}
      <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          HOME
        </Link>
        <Link
          to="/diamond"
          className={`nav-link ${
            location.pathname === "/diamond" ? "active" : ""
          }`}
        >
          DIAMOND
        </Link>
        <Link
          to="/aboutus"
          className={`nav-link ${
            location.pathname === "/aboutus" ? "active" : ""
          }`}
        >
          ABOUT US
        </Link>
        <Link
          to="/contactus"
          className={`nav-link ${
            location.pathname === "/contactus" ? "active" : ""
          }`}
        >
          CONTACT US
        </Link>
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
