import React, { useEffect, useState } from "react";
import { Grid, Button, Typography } from "@mui/material";
import TextInput from "../../components/inputs/TextInput";
import showToast from "../../components/Toast/Toaster";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./register.css";
import "../login/login.css";
import logo from "../../assets/images/logo.svg";
import gallery13 from "../../assets/gallery images/luxury-shine-diamonds-digital-art_23-2151695052.avif";
import gallery12 from "../../assets/gallery images/female-jewelry_772702-3140.avif";
import gallery11 from "../../assets/gallery images/diamond-antique-vintage-earrings_43379-1011.avif";
import gallery10 from "../../assets/gallery images/necklace-with-green-stones-gold-necklace_907454-6.avif";
import gallery9 from "../../assets/gallery images/queen-crown-still-life_23-2150409265.avif";
import gallery8 from "../../assets/gallery images/women-s-jewelry_144962-4209.avif";
import gallery7 from "../../assets/gallery images/luxury-jewelry-black-friday-advertisement-commercial-photography_950002-325682.avif";
import gallery6 from "../../assets/gallery images/earring-ribbon_14972-12.avif";
import gallery5 from "../../assets/gallery images/bangles.jpg";
import gallery4 from "../../assets/gallery images/240_F_61207817_eVLm60K8BAHEkIpL9odBurd3Kp7CeLx8.jpg";
import gallery3 from "../../assets/gallery images/still-life-object_1122-1942.avif";
import gallery2 from "../../assets/gallery images/pexels-the-glorious-studio-3584518-10475789.jpg";
import gallery1 from "../../assets/gallery images/pexels-the-glorious-studio-3584518-10983783.jpg";
import allimage from "../../assets/gallery images/allimage.png";
import AxiosInstance from "../../Axiosinstance";

const RegistrationForm = () => {
  const baseUrl = process.env.REACT_APP_BASE_API;
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    document.body.classList.add("register-page");

    return () => {
      document.body.classList.remove("register-page");
    };
  }, []);

  const [formData, setFormData] = useState({
    Salutation: "",
    FirstName: "",
    LastName: "",
    CompanyName: "",
    City: "",
    State: "",
    Country: "",
    Pincode: "",
    CityPhoneCode: "",
    PhoneNo: "",
    PrimaryEmail: "",
    SecondaryEmail: "",
    Website: "",
    Designation: "",
    RegisterType: "",
    Username: "",
    UserPassword: "",
    ConfirmPassword: "",
    LineofBusiness: "",
    PreferredContactDetails: "",
  });

  // Step 1 Formik
  const formikStep1 = useFormik({
    initialValues: {
      Salutation: formData.Salutation,
      FirstName: formData.FirstName,
      LastName: formData.LastName,
      CompanyName: formData.CompanyName,
      City: formData.City,
      State: formData.State,
      Country: formData.Country,
      Pincode: formData.Pincode,
    },
    validationSchema: Yup.object({
      Salutation: Yup.string().required("Salutation is required"),
      FirstName: Yup.string()
        .matches(/^[A-Za-z]+$/, "Only letters allowed")
        .required("First name is required"),
      LastName: Yup.string()
        .matches(/^[A-Za-z]+$/, "Only letters allowed")
        .required("Last name is required"),
      CompanyName: Yup.string().required("Company name is required"),
      City: Yup.string().required("City is required"),
      State: Yup.string().required("State is required"),
      Country: Yup.string()
        .notOneOf(["Select a country"], "Select a valid country")
        .required("Country is required"),
      Pincode: Yup.string()
        .matches(/^\d{5,6}$/, "Must be 5-6 digits")
        .required("Pincode is required"),
    }),
    onSubmit: (values) => {
      setFormData((prev) => ({ ...prev, ...values }));
      setStep(1);
    },
  });

  // Step 2 Formik
  const formikStep2 = useFormik({
    initialValues: {
      CityPhoneCode: formData.CityPhoneCode,
      PhoneNo: formData.PhoneNo,
      PrimaryEmail: formData.PrimaryEmail,
      SecondaryEmail: formData.SecondaryEmail,
      Website: formData.Website,
      Designation: formData.Designation,
      RegisterType: formData.RegisterType,
    },
    validationSchema: Yup.object({
      CityPhoneCode: Yup.string()
        .matches(/^\d{1,5}$/, "Must be 1-5 digits")
        .required("Required"),
      PhoneNo: Yup.string()
        .matches(/^\d{7,15}$/, "Must be 7-15 digits")
        .required("Required"),
      PrimaryEmail: Yup.string().email("Invalid email").required("Required"),
      SecondaryEmail: Yup.string().email("Invalid email").nullable(),
      Website: Yup.string().url("Invalid URL").nullable(),
      Designation: Yup.string().required("Required"),
      RegisterType: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      setFormData((prev) => ({ ...prev, ...values }));
      setStep(2);
    },
  });

  // Step 3 Formik (Final Step)
  const formikStep3 = useFormik({
    initialValues: {
      Username: formData.Username,
      UserPassword: formData.UserPassword,
      ConfirmPassword: formData.ConfirmPassword,
      LineofBusiness: formData.LineofBusiness,
      PreferredContactDetails: formData.PreferredContactDetails,
    },
    validationSchema: Yup.object({
      Username: Yup.string()
        .min(3, "At least 3 characters")
        .required("Required"),
      UserPassword: Yup.string()
        .min(6, "At least 6 characters")
        .matches(
          /^(?=.*[A-Z])(?=.*\d)/,
          "Must include an uppercase and a number"
        )
        .required("Required"),
      ConfirmPassword: Yup.string()
        .oneOf([Yup.ref("UserPassword")], "Passwords must match")
        .required("Required"),
      LineofBusiness: Yup.string().required("Required"),
      PreferredContactDetails: Yup.string()
        .nullable()
        .test(
          "isValidContact",
          "Provide valid contact details",
          (value) => !value || /^\d{7,15}$/.test(value)
        ),
    }),
    onSubmit: async (values) => {
      const finalData = { ...formData, ...values };
      try {
        const res = await AxiosInstance.post(
          `${baseUrl}/user/signup`,
          finalData
        );
        if (res.data.statusCode === 200) {
          showToast.success(res.data.message, { autoClose: 3000 });
          navigate("/");
        } else {
          showToast.error(res.data.message);
        }
      } catch (error) {
        showToast.error(error.response?.data.message || "Something went wrong");
      }
    },
  });

  return (
    <Grid container className="signup-container" spacing={2}>
      {/* Left Image Section */}
      <Grid
        item
        xs={12}
        md={7}
        className="signup-image-container register-image-gallery "
      >
        <div className="image-overlay">
          {/* <Typography variant="h4" className="signup-heading">
            To keep connected with the largest shop in the world.
          </Typography> */}
          <article className="gallery_wrapper gallery-register">
            <img src={gallery1} alt="Balloon with controled fire" />
            <img src={gallery2} alt="Minimalists catchphrase" />
            <img src={gallery3} alt="Hiking Directional Signs" />

            <img src={gallery4} alt="drinks" />
            <img src={gallery5} alt="breakfast" />

            <img src={gallery6} alt="Alpine mountains under a clear sky" />
            <img src={gallery7} alt="Gradient Glowing Laptop" />
            <img src={gallery8} alt="Staples container" />

            <img src={gallery9} alt="the island" />
            <img src={gallery10} alt="Crystal Tower" />

            <img src={gallery11} alt="Car with man on death valley" />
            <img src={gallery12} alt="christmas elf looking dog" />
            <img src={gallery13} alt="interior design" />
          </article>
          <img src={allimage} alt="all image" className="allimage-register" />
        </div>
      </Grid>
      <Grid item xs={12} sm={12} md={5}>
        <div className="logo-container">
          <img src={logo} alt="logo" className="logo-image-register" />
          <span className="mr-2 back-to-home" onClick={() => navigate("/")}>
            <i className="fa-solid fa-arrow-left" /> Back to home
          </span>
        </div>

        <div className="input-place">
          {/* Sign Up Title - Aligned to Left */}
          <Typography
            variant="h4"
            className="form-title align-left"
            gutterBottom
            sx={{ fontFamily: "Poppins , sans-serif" }}
          >
            Sign Up
          </Typography>
          {step === 0 && (
            <form onSubmit={formikStep1.handleSubmit}>
              <Grid container spacing={2}>
                {/* Step 1 Fields */}
                {Object.keys(formikStep1.initialValues).map((field) => (
                  <Grid item xs={6} key={field}>
                    <TextInput
                      label={field.replace(/([A-Z])/g, " $1").trim() + " *"}
                      {...formikStep1.getFieldProps(field)}
                      error={
                        formikStep1.touched[field] &&
                        Boolean(formikStep1.errors[field])
                      }
                      helperText={
                        formikStep1.touched[field] && formikStep1.errors[field]
                      }
                      fullWidth
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid
                container
                spacing={2}
                display="flex"
                justifyContent="flex-start"
                // className="btn-containerregister"
              >
                <Grid item sx={{ mt: 2 }}>
                  <div className="back-to-login-container">
                    <Typography className="back-to-login" gutterBottom>
                      Already have an account?{" "}
                      <span
                        className="have-an-account-login"
                        onClick={() => navigate("/login")}
                      >
                        {" "}
                        login
                      </span>
                    </Typography>
                  </div>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                display="flex"
                justifyContent="flex-start"
                className="btn-containerregister"
              >
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    className="button-colors"
                  >
                    Next
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={formikStep2.handleSubmit}>
              <Grid container spacing={2}>
                {/* Step 2 Fields */}
                {Object.keys(formikStep2.initialValues).map((field) => (
                  <Grid item xs={6} key={field}>
                    <TextInput
                      label={field.replace(/([A-Z])/g, " $1").trim() + " *"}
                      {...formikStep2.getFieldProps(field)}
                      error={
                        formikStep2.touched[field] &&
                        Boolean(formikStep2.errors[field])
                      }
                      helperText={
                        formikStep2.touched[field] && formikStep2.errors[field]
                      }
                      fullWidth
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid
                container
                spacing={2}
                display="flex"
                justifyContent="flex-start"
                className="btn-containerregister"
              >
                <Grid item className="button-display">
                  <Button onClick={() => setStep(0)} className="button-colors">
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    className="button-colors"
                    sx={{ ml: 2 }}
                  >
                    Next
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={formikStep3.handleSubmit}>
              <Grid container spacing={2}>
                {/* Step 3 Fields */}
                {Object.keys(formikStep3.initialValues).map((field) => (
                  <Grid item xs={6} key={field}>
                    <TextInput
                      label={field.replace(/([A-Z])/g, " $1").trim() + " *"}
                      {...formikStep3.getFieldProps(field)}
                      error={
                        formikStep3.touched[field] &&
                        Boolean(formikStep3.errors[field])
                      }
                      helperText={
                        formikStep3.touched[field] && formikStep3.errors[field]
                      }
                      fullWidth
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid
                container
                spacing={2}
                display="flex"
                justifyContent="flex-start"
                className="btn-containerregister"
              >
                <Grid item>
                  <Button onClick={() => setStep(1)} className="button-colors">
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    className="button-colors"
                    sx={{ ml: 2 }}
                  >
                    Register
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </div>
      </Grid>
    </Grid>
  );
};

export default RegistrationForm;
