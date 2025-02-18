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

const steps = [
  [
    "Salutation",
    "FirstName",
    "LastName",
    "CompanyName",
    "City",
    "State",
    "Country",
    "Pincode",
  ],
  [
    "CityPhoneCode",
    "PhoneNo",
    "PrimaryEmail",
    "SecondaryEmail",
    "Website",
    "Designation",
    "RegisterType",
  ],
  [
    "Username",
    "UserPassword",
    "ConfirmPassword",
    "LineofBusiness",
    "PreferredContactDetails",
  ],
];

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const formik = useFormik({
    initialValues: {
      Salutation: "",
      FirstName: "",
      LastName: "",
      CompanyName: "",
      Designation: "",
      RegisterType: "",
      City: "",
      State: "",
      Country: "",
      Pincode: "",
      CityPhoneCode: "",
      PhoneNo: "",
      PrimaryEmail: "",
      SecondaryEmail: "",
      Website: "",
      Username: "",
      UserPassword: "",
      ConfirmPassword: "",
      LineofBusiness: "",
      PreferredContactDetails: "",
    },
    validationSchema: Yup.object().shape({
      Salutation: Yup.string().required("Salutation is required"),
      FirstName: Yup.string()
        .matches(/^[A-Za-z]+$/, "First name can only contain letters")
        .required("First name is required"),
      LastName: Yup.string()
        .matches(/^[A-Za-z]+$/, "Last name can only contain letters")
        .required("Last name is required"),
      CompanyName: Yup.string().required("Company name is required"),
      Designation: Yup.string().required("Designation is required"),
      RegisterType: Yup.string().required("Register type is required"),
      City: Yup.string().required("City is required"),
      State: Yup.string().required("State is required"),
      Country: Yup.string()
        .notOneOf(["Select a country"], "Please select a valid country")
        .required("Country is required"),
      Pincode: Yup.string()
        .matches(/^\d{5,6}$/, "Pincode must be 5-6 digits")
        .required("Pincode is required"),
      CityPhoneCode: Yup.string()
        .matches(/^\d{1,5}$/, "City phone code must be 1-5 digits")
        .required("City phone code is required"),
      PhoneNo: Yup.string()
        .matches(/^\d{7,15}$/, "Phone number must be 7-15 digits")
        .required("Phone number is required"),
      PrimaryEmail: Yup.string()
        .email("Invalid email format")
        .required("Primary email is required"),
      SecondaryEmail: Yup.string().email("Invalid email format").nullable(), // Optional field, so it can be null or empty
      Website: Yup.string()
        .matches(
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
          "Enter a valid website URL"
        )
        .nullable(), // Optional
      Username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must not exceed 20 characters")
        .required("Username is required"),
      UserPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must not exceed 20 characters")
        .matches(
          /^(?=.*[A-Z])(?=.*[0-9])/,
          "Password must contain at least one uppercase letter and one number"
        )
        .required("Password is required"),
      ConfirmPassword: Yup.string()
        .oneOf([Yup.ref("UserPassword")], "Passwords must match")
        .required("Confirm Password is required"),
      LineofBusiness: Yup.string().required("Line of business is required"),
      PreferredContactDetails: Yup.string()
        .matches(
          /^([\w\-.]+@([\w-]+\.)+[\w-]{2,4},?\s*)*([\d\s\-\(\)]{7,15},?\s*)*$/,
          "Provide valid contact details (email or phone)"
        )
        .nullable(),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/user/signup`,
          values
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

  const handleNext = () =>
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <Container maxWidth="md" className="form-container">
      <Typography variant="h4" className="form-title">
        Sign Up & Start Shopping
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={2}>
              {steps[step].map((field) => (
                <Grid item xs={6} key={field}>
                  {field === "Salutation" ||
                  field === "RegisterType" ||
                  field === "Country" ||
                  field === "LineofBusiness" ? ( // SelectInput fields (dropdowns)
                    <SelectInput
                      label={
                        field.replace(/([A-Z])/g, " $1").trim() + " *"
                        // (formik.getFieldProps(field).required ? " *" : "")
                      } // Only add * if required
                      options={
                        field === "Salutation"
                          ? ["Mr.", "Mrs.", "Ms."]
                          : field === "RegisterType"
                          ? ["Website Visit", "Referral", "Advertisement"]
                          : field === "Country"
                          ? ["Select a country", "USA", "Canada", "UK"]
                          : ["Jewellery Manufacturer", "Retailer", "Wholesaler"]
                      }
                      {...formik.getFieldProps(field)}
                      error={
                        formik.touched[field] && Boolean(formik.errors[field])
                      }
                      helperText={formik.touched[field] && formik.errors[field]}
                      fullWidth
                    />
                  ) : field.includes("Password") ? ( // Password fields
                    <PasswordInput
                      label={
                        field.replace(/([A-Z])/g, " $1").trim() + " *"
                        // (formik.getFieldProps(field).required ? " *" : "")
                      } // Only add * if required
                      {...formik.getFieldProps(field)}
                      error={
                        formik.touched[field] && Boolean(formik.errors[field])
                      }
                      helperText={formik.touched[field] && formik.errors[field]}
                      fullWidth
                    />
                  ) : (
                    // TextInput fields (text)
                    <TextInput
                      label={
                        field.replace(/([A-Z])/g, " $1").trim() + " *"
                        // (formik.getFieldProps(field).required ? " *" : "")
                        // label={field.replace(/([A-Z])/g, " $1").trim() + " *"}
                      } 
                      {...formik.getFieldProps(field)}
                      error={
                        formik.touched[field] && Boolean(formik.errors[field])
                      }
                      helperText={formik.touched[field] && formik.errors[field]}
                      fullWidth
                    />
                  )}
                </Grid>
              ))}
            </Grid>
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

        <Grid
          container
          spacing={2}
          display="flex"
          justifyContent="flex-start"
          className="btn-container"
        >
          <Grid item>
            {step > 0 && (
              <Button
                variant="contained"
                onClick={handlePrev}
                style={{ marginRight: "10px" }} // Add margin to separate buttons
                size="small"
                className="button-colors"
              >
                Previous
              </Button>
            )}
          </Grid>
          <Grid item className="next-buttons">
            {step < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                size="small"
                className="button-colors"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                size="small"
                className="button-colors"
              >
                Register
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default RegistrationForm;
