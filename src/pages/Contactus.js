import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import pin from "../assets/images/pin (1).svg";
import telephonecall from "../assets/images/telephone-call (1).svg";
import email from "../assets/images/email.svg";
import { FaStar } from "react-icons/fa";
import showToast from "../components/Toast/Toaster";
import "./Contactus.css";
import TextInput from "../components/inputs/TextInput";
import { Grid } from "@mui/material";

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
      Email: Yup.string()
        .email("Invalid email")
        .required("Email is required")
        .matches(/^[^@]+@[^@]+\.[^@]+$/, "Email must contain '@' and '.'"),
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
        if (response.data.statusCode === 200) {
          //   alert("Message sent successfully!");
          showToast.success("Message sent successfully!");
          resetForm();
        } else {
          //   alert("Failed to send message.");
          showToast.error("Failed to sent message!");
        }
      } catch (error) {
        console.error("API Error:", error);
        // alert("Something went wrong. Please try again later.");
        showToast.warning("something went wrong. Please try again later!");
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
              <span className="contactext">
                <img src={pin} alt="pin" width="27px" />{" "}
                <strong>Address:</strong>
              </span>
              <a
                href="https://www.google.com/maps/search/?q=315+Shashvat+Apartment,+Pipla+Sheri,+Mahidharpura,+Surat+-+395003"
                target="_blank"
                rel="noopener noreferrer"
                className="note"
              >
                315, Shashvat Apartment, <br />
                Pipla Sheri, Mahidharpura, <br />
                Surat - 395003
              </a>
            </div>

            <div className="contact-item">
              <span className="contactext">
                <img src={telephonecall} alt="pin" width="27px" />{" "}
                <strong>Phone:</strong>
              </span>
              <a href="tel:+919825971176" className="note">
                +91 9825971176
              </a>
              <p className="note">
                Calls from mobile and landlines within USA are free
              </p>
            </div>

            <div className="contact-item">
              <span className="contactext">
                <img src={email} alt="pin" width="27px" />{" "}
                <strong>Email:</strong>
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
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextInput
                    label="Your Name *"
                    {...formik.getFieldProps("Name")}
                    error={formik.touched.Name && Boolean(formik.errors.Name)}
                    helperText={formik.touched.Name && formik.errors.Name}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextInput
                    label="Your Email *"
                    type="email"
                    {...formik.getFieldProps("Email")}
                    error={formik.touched.Email && Boolean(formik.errors.Email)}
                    helperText={formik.touched.Email && formik.errors.Email}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextInput
                    label="Subject *"
                    {...formik.getFieldProps("Subject")}
                    error={
                      formik.touched.Subject && Boolean(formik.errors.Subject)
                    }
                    helperText={formik.touched.Subject && formik.errors.Subject}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextInput
                    label="Your Message (optional)"
                    multiline // ✅ Enables textarea mode
                    rows={4}
                    {...formik.getFieldProps("Message")}
                    error={
                      formik.touched.Message && Boolean(formik.errors.Message)
                    }
                    helperText={formik.touched.Message && formik.errors.Message}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <button type="submit" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </Grid>
              </Grid>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contactus;
