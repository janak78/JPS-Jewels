import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import thumbnailImage from "../assets/images/video.webp";
import videoFile from "../assets/videos/video.mp4";
import craftsmanshipImg from "./../assets/images/about-us-banner-1.webp";
import whyChooseUsImg from "./../assets/images/about-us-banner-2.webp";
import { FaStar } from "react-icons/fa";
import showToast from "../components/Toast/Toaster";
import "./Contactus.css";

const Contactus = () => {
  const [isOpen, setIsOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      Name: "",
      Email: "",
      Subject: "",
      Message: "",
    },
    validationSchema: Yup.object({
      Name: Yup.string().required("Name is required"),
      Email: Yup.string().email("Invalid email").required("Email is required"),
      Subject: Yup.string().required("Subject is required"),
      Message: Yup.string(),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/contact/addcontact",
          values,
          { headers: { "Content-Type": "application/json" } }
        );
        console.log(response.data.statusCode,"response.data.statusCode")
        if (response.data.statusCode === 200) {
        //   alert("Message sent successfully!");
          showToast.success("Message sent successfully!");
          console.log(showToast,"111")
          resetForm();
        } else {
          alert("Failed to send message.");
        }
      } catch (error) {
        console.error("API Error:", error);
        alert("Something went wrong. Please try again later.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <div className="maindiv">
        <div className="map-div">
          <iframe
            className="contact-form"
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
            <h2 className="headtext">CONTACTS</h2>
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
            <h2 className="headtext">WRITE TO US</h2>
            <form onSubmit={formik.handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                {...formik.getFieldProps("Name")}
              />
              {formik.touched.Name && formik.errors.Name && (
                <div className="error">{formik.errors.Name}</div>
              )}

              <input
                type="email"
                name="Email"
                placeholder="Your Email"
                {...formik.getFieldProps("Email")}
              />
              {formik.touched.Email && formik.errors.Email && (
                <div className="error">{formik.errors.Email}</div>
              )}

              <input
                type="text"
                name="Subject"
                placeholder="Subject"
                {...formik.getFieldProps("Subject")}
              />
              {formik.touched.Subject && formik.errors.Subject && (
                <div className="error">{formik.errors.Subject}</div>
              )}

              <textarea
                name="Message"
                placeholder="Your Message (optional)"
                {...formik.getFieldProps("Message")}
              ></textarea>

              <button type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contactus;
