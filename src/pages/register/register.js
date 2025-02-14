import React from "react";
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

const RegistrationForm = () => {
  const navigate = useNavigate();

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
    onSubmit: (values) => {
      console.log("Submitting form with values:", values); // Debugging log
      handleSubmit(values);
    },
  });
  console.log(formik.errors);

  const handleSubmit = async (values) => {
    try {
      //   setLoader(true);
      const res = await axios.post(
        `http://localhost:5000/api/user/signup`,
        values
      );

      console.log(res, "resss");
      if (res.data.statusCode === 200) {
        console.log(
          res.data.statusCode,
          "res.data.statusCoderes.data.statusCode"
        );
        showToast.success(res.data.message, {
          autoClose: 3000,
        });
        navigate("/");
      } else if (res.data.statusCode === 400) {
        showToast.error(res.data.message);
      } else if (res.data.statusCode === 202) {
        showToast(res.data.message);
      } else if (res.data.statusCode === 204) {
        showToast(res.data.message);
      }
    } catch (error) {
      if (error.response) {
        showToast.error(error.response?.data.message || "An error occurred");
      } else {
        showToast.error("Something went wrong. Please try again later.");
      }
    } finally {
      //   setLoader(false);
    }
  };

  return (
    <Container maxWidth="md" className="form-container">
      <Typography variant="h4" className="form-title">
        Register Your Self
      </Typography>
      <form
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          formik.handleSubmit();
        }}
      >
        <Grid container spacing={2}>
          {/* Row 1 */}
          <SelectInput
            label="Salutation *"
            options={["Mr.", "Mrs.", "Ms."]}
            value={formik.values.Salutation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.Salutation && Boolean(formik.errors.Salutation)
            }
            helperText={formik.touched.Salutation && formik.errors.Salutation}
            name="Salutation"
            type="select"
            className="text-blue-color w-100"
            fullWidth
          />
          <TextInput
            label="First Name *"
            value={formik.values.FirstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.FirstName && Boolean(formik.errors.FirstName)}
            helperText={formik.touched.FirstName && formik.errors.FirstName}
            name="FirstName"
            type="text"
            className="text-blue-color w-100"
            fullWidth
          />
          <TextInput
            label="Last Name *"
            value={formik.values.LastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.LastName && Boolean(formik.errors.LastName)}
            helperText={formik.touched.LastName && formik.errors.LastName}
            name="LastName"
            type="text"
            className="text-blue-color w-100"
            fullWidth
          />
          {/* Row 2 */}
          <TextInput
            label="Company Name *"
            value={formik.values.CompanyName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.CompanyName && Boolean(formik.errors.CompanyName)
            }
            helperText={formik.touched.CompanyName && formik.errors.CompanyName}
            name="CompanyName"
            type="text"
            className="text-blue-color w-100"
            fullWidth
          />
          <TextInput
            label="Designation *"
            value={formik.values.Designation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.Designation && Boolean(formik.errors.Designation)
            }
            helperText={formik.touched.Designation && formik.errors.Designation}
            name="Designation"
            type="text"
            className="text-blue-color w-100"
            fullWidth
          />
          <SelectInput
            label="Register Type *"
            options={["Website Visit", "Referral", "Advertisement"]}
            value={formik.values.RegisterType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.RegisterType && Boolean(formik.errors.RegisterType)
            }
            helperText={
              formik.touched.RegisterType && formik.errors.RegisterType
            }
            name="RegisterType"
            type="text"
            className="text-blue-color w-100"
            fullWidth
          />
          {/* Row 3 */}
          <TextInput
            label="City *"
            value={formik.values.City}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.City && Boolean(formik.errors.City)}
            helperText={formik.touched.City && formik.errors.City}
            name="City"
            type="text"
            className="text-blue-color w-100"
            fullWidth
          />
          <TextInput
            label="State *"
            value={formik.values.State}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.State && Boolean(formik.errors.State)}
            helperText={formik.touched.State && formik.errors.State}
            name="State"
            type="text"
            className="text-blue-color w-100"
            fullWidth
          />
          <SelectInput
            label="Country *"
            options={["Select a country", "USA", "Canada", "UK"]}
            value={formik.values.Country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.Country && Boolean(formik.errors.Country)}
            helperText={formik.touched.Country && formik.errors.Country}
            name="Country"
            type="select"
            className="text-blue-color w-100"
            fullWidth
          />
          {/* Row 4 */}
          <TextInput
            label="Pincode *"
            value={formik.values.Pincode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.Pincode && Boolean(formik.errors.Pincode)}
            helperText={formik.touched.Pincode && formik.errors.Pincode}
            name="Pincode"
            type="text"
            className="text-blue-color w-100"
            fullWidth
          />
          <TextInput
            label="City Phone Code *"
            value={formik.values.CityPhoneCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.CityPhoneCode &&
              Boolean(formik.errors.CityPhoneCode)
            }
            helperText={
              formik.touched.CityPhoneCode && formik.errors.CityPhoneCode
            }
            name="CityPhoneCode"
            type="text"
            className="text-blue-color w-100"
            fullWidth
          />
          <TextInput
            label="Phone No *"
            value={formik.values.PhoneNo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.PhoneNo && Boolean(formik.errors.PhoneNo)}
            helperText={formik.touched.PhoneNo && formik.errors.PhoneNo}
            name="PhoneNo"
            type="text"
            className="text-blue-color w-100"
            fullWidth
          />
          {/* Row 5 */}
          <TextInput
            label="Primary Email *"
            value={formik.values.PrimaryEmail}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.PrimaryEmail && Boolean(formik.errors.PrimaryEmail)
            }
            helperText={
              formik.touched.PrimaryEmail && formik.errors.PrimaryEmail
            }
            name="PrimaryEmail"
            type="text"
            className="text-blue-color w-100"
            fullWidth
          />
          <TextInput
            label="Secondary Email"
            value={formik.values.SecondaryEmail}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.SecondaryEmail &&
              Boolean(formik.errors.SecondaryEmail)
            }
            helperText={
              formik.touched.SecondaryEmail && formik.errors.SecondaryEmail
            }
            name="SecondaryEmail"
            type="text"
            className="text-blue-color w-100"
            fullWidth
          />
          <TextInput
            label="Website"
            value={formik.values.Website}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.Website && Boolean(formik.errors.Website)}
            helperText={formik.touched.Website && formik.errors.Website}
            name="Website"
            type="text"
            className="text-blue-color w-100"
            fullWidth
          />
          {/* Row 6 */}
          <TextInput
            label="Username *"
            value={formik.values.Username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.Username && Boolean(formik.errors.Username)}
            helperText={formik.touched.Username && formik.errors.Username}
            name="Username"
            type="text"
            className="text-blue-color w-100"
            fullWidth
          />
          <PasswordInput
            label="User Password *"
            value={formik.values.UserPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.UserPassword && Boolean(formik.errors.UserPassword)
            }
            helperText={
              formik.touched.UserPassword && formik.errors.UserPassword
            }
            name="UserPassword"
            type="text"
            className="text-blue-color w-100"
            fullWidth
          />
          <PasswordInput
            label="Confirm Password *"
            value={formik.values.ConfirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.ConfirmPassword &&
              Boolean(formik.errors.ConfirmPassword)
            }
            helperText={
              formik.touched.ConfirmPassword && formik.errors.ConfirmPassword
            }
            name="ConfirmPassword"
            type="text"
            className="text-blue-color w-100"
            fullWidth
          />
          {/* Row 7 */}
          <SelectInput
            label="Line of Business"
            options={["Jewellery Manufacturer", "Retailer", "Wholesaler"]}
            value={formik.values.LineofBusiness}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.LineofBusiness &&
              Boolean(formik.errors.LineofBusiness)
            }
            helperText={
              formik.touched.LineofBusiness && formik.errors.LineofBusiness
            }
            name="LineofBusiness"
            type="select"
            className="text-blue-color w-100"
            fullWidth
          />
          <TextInput
            label="Preferred Contact Details"
            value={formik.values.PreferredContactDetails}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.PreferredContactDetails &&
              Boolean(formik.errors.PreferredContactDetails)
            }
            helperText={
              formik.touched.PreferredContactDetails &&
              formik.errors.PreferredContactDetails
            }
            name="PreferredContactDetails"
            type="text"
            className="text-blue-color w-100"
            fullWidth
          />
          {/* Register Button */}
          <Grid item xs={12} className="btn-containermain">
            <Button
              className="btn-container"
              type="submit"
              variant="contained"
              style={{ backgroundColor: "orangered" }}
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default RegistrationForm;
