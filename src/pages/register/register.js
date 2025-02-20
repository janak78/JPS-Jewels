import React, { useState } from "react";
import { Grid, Button, Container, Typography } from "@mui/material";
import TextInput from "../../components/inputs/TextInput";
import SelectInput from "../../components/inputs/SelectInput";
import PasswordInput from "../../components/inputs/PasswordInput";
import showToast from "../../components/Toast/Toaster";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./register.css";
import shop2 from "../../assets/images/searching-rare-gem-valuable-diamond-business_1134986-17589.jpg";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
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
        const res = await axios.post(
          "http://localhost:5000/api/user/signup",
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
    <Container maxWidth="md" className="register-container">
      <Typography variant="h4" className="form-title">
        Sign Up & Start Shopping
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
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
                <Grid item>
                  <Button onClick={() => setStep(0)} className="button-colors">
                    Previous
                  </Button>
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
                  >
                    Register
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <img
            src={shop2}
            alt="Luxury Necklace"
            style={{ width: "100%", maxWidth: "400px" }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegistrationForm;
