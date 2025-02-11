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
      <div className="logo">
        <img src={logo} alt="JPS Jewels" className="logo-image" />
      </div>
      <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>
        <a href="/" className="nav-link active">
          HOME
        </a>
        <a href="#diamond" className="nav-link">
          DIAMOND
        </a>
        <a href="#about" className="nav-link">
          ABOUT US
        </a>
        <a href="#contact" className="nav-link">
          CONTACT US
        </a>
      </nav>
      <div className="icons">
        <i className="fa-solid fa-magnifying-glass"></i>
        <i className="fa-solid fa-cart-shopping"></i>
        <i className="fa-regular fa-user"></i>
        {/* <div className="mobile-menu" onClick={toggleMenu}>
          <i className="fa-solid fa-bars"></i>
        </div> */}
      </div>
    </header>
  );
};

export default Header;
