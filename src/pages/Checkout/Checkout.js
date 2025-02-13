import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "./Checkout.css";

const Checkout = () => {
  const initialValues = {
    email: "",
    country: "Bahamas",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    phone: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    pinCode: Yup.string().required("Required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Invalid phone number")
      .notRequired(),
  });

  const handleSubmit = (values) => {
    console.log("Form Submitted:", values);
  };

  return (
    <div className="unique-checkout-container w-100">
      {/* <Container maxWidth="sm" > */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box className="checkout-box">
            <Typography variant="h5" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="body2">
              We'll use this email to send you details and updates about your
              order.
            </Typography>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange }) => (
                <Form>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Email"
                    name="email"
                    variant="outlined"
                    margin="normal"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    onChange={handleChange}
                  />

                  <Typography variant="h6" gutterBottom>
                    Billing Address
                  </Typography>

                  <Field
                    as={TextField}
                    select
                    fullWidth
                    label="Country"
                    name="country"
                    variant="outlined"
                    margin="normal"
                    onChange={handleChange}
                  >
                    <MenuItem value="Bahamas">Bahamas</MenuItem>
                    <MenuItem value="USA">USA</MenuItem>
                    <MenuItem value="Canada">Canada</MenuItem>
                  </Field>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="First Name"
                        name="firstName"
                        variant="outlined"
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        variant="outlined"
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>

                  <Field
                    as={TextField}
                    fullWidth
                    label="Address"
                    name="address"
                    variant="outlined"
                    margin="normal"
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                    onChange={handleChange}
                  />

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="City"
                        name="city"
                        variant="outlined"
                        error={touched.city && Boolean(errors.city)}
                        helperText={touched.city && errors.city}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="State"
                        name="state"
                        variant="outlined"
                        error={touched.state && Boolean(errors.state)}
                        helperText={touched.state && errors.state}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Pin Code"
                        name="pinCode"
                        variant="outlined"
                        error={touched.pinCode && Boolean(errors.pinCode)}
                        helperText={touched.pinCode && errors.pinCode}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Phone (Optional)"
                        name="phone"
                        variant="outlined"
                        error={touched.phone && Boolean(errors.phone)}
                        helperText={touched.phone && errors.phone}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>

                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Payment Options
                  </Typography>
                  <Typography variant="body2">
                    Confirm Payment via Consultation <br />
                    Thank you for your order! Our team will reach out to arrange
                    the payment process through your preferred communication
                    method, such as email, direct call, WhatsApp, chat, or
                    Skype. Once payment is confirmed, we’ll proceed with
                    dispatching your diamond product promptly.
                  </Typography>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    className="submit-button"
                  >
                    Place Your Order
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} sx={{mx: 3}}>
          {/* <Paper className="order-summary" elevation={3}>
            <Typography variant="h6" gutterBottom>
              Your Order
            </Typography>
            {[4512.36, 5568.0, 3440.0, 4848.24].map((price, index) => (
              <Box key={index} className="order-item">
                <img src="/images/diamond.png" alt="Diamond" className="order-image" />
                <Box>
                  <Typography variant="body1">1 Carat RBC D / VS1 Diamond - GIA EX</Typography>
                  <Typography variant="body2">Quantity: 1 x ${price.toFixed(2)}</Typography>
                  <Typography variant="body2" fontWeight="bold">Item Total: ${price.toFixed(2)}</Typography>
                </Box>
              </Box>
            ))}
            
          </Paper> */}
          <div className="diamond-carddisplay">
            <div className="diamond-item">
              <div className="diamond-image">
                <img alt="Diamond" />
              </div>
              <div className="diamond-details">
                <p>
                  <span>1</span> Carat
                  <span> rbc</span>
                  <span> d</span> /<span>vs1</span> Diamond -<span> g1a</span>
                  <span>ex</span>
                </p>
                <div className="diamond-quantity">
                  Quantity: <span>1</span>
                  &nbsp;x&nbsp;
                  <span>1223</span>
                </div>
                <p className="diamond-total">Item Total: 637378</p>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
      {/* </Container> */}
    </div>
  );
};

export default Checkout;
