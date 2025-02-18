import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchCartCount } from "../../redux/cartSlice";
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
import AxiosInstance from "../../Axiosinstance";
import * as Yup from "yup";
import "./Checkout.css";
import showToast from "../../components/Toast/Toaster";

const Checkout = () => {
    const dispatch = useDispatch();
  
  const userName = useSelector((state) => state.auth.Username);
  const cartData = useSelector((state) => state.cart.cartData);

  const initialValues = {
    ContactEmail: "",
    Country: "Bahamas",
    FirstName: "",
    LastName: "",
    Appartment: "",
    City: "",
    State: "",
    PinCode: "",
    Phone: "",
  };

  const validationSchema = Yup.object({
    ContactEmail: Yup.string().email("Invalid email").required("Required"),
    FirstName: Yup.string().required("Required"),
    LastName: Yup.string().required("Required"),
    Appartment: Yup.string().required("Required"),
    City: Yup.string().required("Required"),
    State: Yup.string().required("Required"),
    PinCode: Yup.string().required("Required"),
    Phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Invalid phone number")
      .notRequired(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const UserId = "your_user_id"; // Replace with the actual user ID
      const response = await AxiosInstance.post(
        `http://localhost:5000/api/billing/addbilling?UserId=${localStorage.getItem(
          "UserId"
        )}`, // Replace with your actual API URL
        values
      );

      if (response.data.statusCode === 200) {
        showToast.success("Order placed successfully!"); // Redirect to confirmation page
        // window.location.reload(); // Refresh the page
        dispatch(fetchCartCount(localStorage.getItem("UserId"))); 
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
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
                    value={values.ContactEmail}
                    label="Email"
                    name="ContactEmail"
                    variant="outlined"
                    margin="normal"
                    error={touched.ContactEmail && Boolean(errors.ContactEmail)}
                    helperText={touched.ContactEmail && errors.ContactEmail}
                    onChange={handleChange}
                  />

                  <Typography variant="h6" gutterBottom>
                    Billing Address
                  </Typography>

                  <Field
                    as={TextField}
                    select
                    value={values.Country}
                    fullWidth
                    label="Country"
                    name="Country"
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
                        value={values.FirstName}
                        label="First Name"
                        name="FirstName"
                        variant="outlined"
                        error={touched.FirstName && Boolean(errors.FirstName)}
                        helperText={touched.FirstName && errors.FirstName}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        value={values.LastName}
                        label="Last Name"
                        name="LastName"
                        variant="outlined"
                        error={touched.LastName && Boolean(errors.LastName)}
                        helperText={touched.LastName && errors.LastName}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>

                  <Field
                    as={TextField}
                    fullWidth
                    value={values.Appartment}
                    label="Address"
                    name="Appartment"
                    variant="outlined"
                    margin="normal"
                    error={touched.Appartment && Boolean(errors.Appartment)}
                    helperText={touched.Appartment && errors.Appartment}
                    onChange={handleChange}
                  />

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        value={values.City}
                        label="City"
                        name="City"
                        variant="outlined"
                        error={touched.City && Boolean(errors.City)}
                        helperText={touched.City && errors.City}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        value={values.State}
                        label="State"
                        name="State"
                        variant="outlined"
                        error={touched.State && Boolean(errors.State)}
                        helperText={touched.State && errors.State}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        value={values.PinCode}
                        label="Pin Code"
                        name="PinCode"
                        variant="outlined"
                        error={touched.PinCode && Boolean(errors.PinCode)}
                        helperText={touched.PinCode && errors.PinCode}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        value={values.Phone}
                        label="Phone (Optional)"
                        name="Phone"
                        variant="outlined"
                        error={touched.Phone && Boolean(errors.Phone)}
                        helperText={touched.Phone && errors.Phone}
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
        <Grid item xs={12} md={3} sx={{ mx: 3 }}>
          <Box className="cart-boxs">
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
            {userName ? (
              cartData && cartData.length > 0 ? (
                cartData.map((item, index) => (
                  <div
                    style={{
                      marginBottom: "20px",
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      padding: "10px",
                    }}
                  >
                    <div
                      className="widget_shopping_cart_content"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        height: "70px",
                      }}
                    >
                      <div>
                        <img
                          className="ImagessElement"
                          src={item?.diamondDetails?.Image}
                          // alt={diamondType}
                          style={{
                            width: "70px",
                            height: "auto",
                            borderRadius: "10px",
                          }}
                        />
                      </div>
                      <div style={{ marginLeft: "15px" }}>
                        <span style={{ marginBottom: "0" }}>
                          <span>{item?.diamondDetails?.Carats}</span> Carat{" "}
                          <span>{item?.diamondDetails?.Shape}</span>
                          <span>{item?.diamondDetails?.Colo}</span> /
                          <span>{item?.diamondDetails?.Clarity}</span> -{" "}
                          <span>{item?.diamondDetails?.Lab}</span>{" "}
                          <span>{item?.diamondDetails?.Cut}</span>
                        </span>
                        <div style={{ display: "flex", marginTop: "0" }}>
                          <span>
                            Quantity: <span>{item?.Quantity}</span> x{" "}
                          </span>
                          &nbsp; {item?.diamondDetails?.Price}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No items in the cart</p>
              )
            ) : (
              <p>Please Log In To See Cart Details</p>
            )}
          </Box>
        </Grid>
      </Grid>
      {/* </Container> */}
    </div>
  );
};

export default Checkout;
