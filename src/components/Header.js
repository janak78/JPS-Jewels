import React, { useEffect, useState } from "react";
import "./Header.css";
import logo from "../assets/images/logo.svg";

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

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="JPS Jewels" className="logo-image" />
      </div>
      <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>
        <a href="/" className="nav-link active" onClick={() => setMenuOpen(false)}>
          HOME
        </a>
        <a href="#diamond" className="nav-link" onClick={() => setMenuOpen(false)}>
          DIAMOND
        </a>
        <a href="/aboutus" className="nav-link" onClick={() => setMenuOpen(false)}>
          ABOUT US
        </a>
        <a href="#contact" className="nav-link" onClick={() => setMenuOpen(false)}>
          CONTACT US
        </a>
      </nav>
      <div className="icons">
        {!isMobile && (
          <>
            <i className="fa-solid fa-magnifying-glass"></i>
            <i className="fa-solid fa-cart-shopping"></i>
            <i className="fa-regular fa-user"></i>
          </>
        )}
        {isMobile && (
          <div className="mobile-menu" onClick={toggleMenu}>
            <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`}></i>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
