import React, { useState } from "react";
import thumbnailImage from "../assets/images/video.webp";
import videoFile from "../assets/videos/video.mp4";
import craftsmanshipImg from "./../assets/images/about-us-banner-1.webp";
import whyChooseUsImg from "./../assets/images/about-us-banner-2.webp";
import { FaStar } from "react-icons/fa";
import "./Contactus.css";

const Contactus = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="maindiv">
        <div className="map-div">
          <iframe className="contact-form"
             src="https://maps.google.com/maps?q=Shashvat%20Apartment%2C%20Pipla%20Sheri%2C%20Mahidharpura%2C%20Surat%2C%20Gujarat%2C%20India%2C&amp;t=m&amp;z=16&amp;output=embed&amp;iwloc=near"
            width="370"
            height="95%"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="contactuscon">
          {/* Contact Details */}
          <div className="contact-container">
            <h2>CONTACTS</h2>
            <p className="description">
              Our one-to-one support is a big part of JPS Jewels company.
              Contact us by phone or email to get help from our qualified team.
            </p>

            <div className="contact-item">
              <span className="icon">
                📍 <strong>Address:</strong>
              </span>
              <a href="#" className="note">
                315, Shashvat Apartment, PiplaSheri, Mahidharpura, Surat -
                395003
              </a>
            </div>

            <div className="contact-item">
              <span className="icon">
                📞 <strong>Phone:</strong>
              </span>
              <a href="tel:+919825971176" className="note">
                +91 9825971176
              </a>
              <p className="note">
                Calls from mobile and landlines within USA are free
              </p>
            </div>

            <div className="contact-item">
              <span className="icon">
                📧 <strong>Email:</strong>
              </span>
              <a href="mailto:info@uat.jpsjewels.com" className="note">
                info@uat.jpsjewels.com
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="form-container">
            <h2>WRITE TO US</h2>
            <form id="contactForm">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                required
              />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your email"
                required
              />
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Subject"
                required
              />
              <textarea
                id="message"
                name="message"
                placeholder="Your message (optional)"
              ></textarea>
              <button type="submit">Send message</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contactus;
