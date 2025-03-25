import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, updateUserProfile } from "../../redux/userSlice";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "./Userprofile.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import showToast from "../../components/Toast/Toaster";
import { useNavigate } from "react-router-dom";
import DiamondLoader from "../../components/Loader/loader";

const UserProfile = () => {
  const baseUrl = process.env.REACT_APP_BASE_API;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth?.user?.UserId);
  const { userData, loading, error } = useSelector(
    (state) => state.userSlice || {}
  );

  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserData(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (userData) {
      setFormValues({
        FirstName: userData?.FirstName || "",
        LastName: userData?.LastName || "",
        City: userData?.City || "",
        State: userData?.State || "",
        Country: userData?.Country || "",
        Pincode: userData?.Pincode || "",
        PhoneNo: userData?.PhoneNo || "",
        PrimaryEmail: userData?.PrimaryEmail || "",
        Username: userData?.Username || "",
        UserPassword: userData?.UserPassword || "",
      });
    }
  }, [userData]);

  const validationSchema = Yup.object({
    PrimaryEmail: Yup.string().email("Invalid email").required("Required"),
    FirstName: Yup.string().required("Required"),
    LastName: Yup.string().required("Required"),
    Country: Yup.string().required("Required"),
    City: Yup.string().required("Required"),
    State: Yup.string().required("Required"),
    Pincode: Yup.string().required("Required"),
    PhoneNo: Yup.string()
      .matches(/^[0-9]{10}$/, "Invalid phone number")
      .notRequired(),
    Username: Yup.string().required("Required"),
    UserPassword: Yup.string().required("Required"),
  });

  const existingUserData = useSelector((state) => state.userSlice.userData);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Check if values are the same as existing data
      const isDataSame = Object.keys(values).every(
        (key) => values[key] === existingUserData[key]
      );

      if (isDataSame) {
        showToast.info("No changes detected!");
        setSubmitting(false);
        return; // Stop execution, no API call
      }

      // Proceed with API call only if data is changed
      await dispatch(
        updateUserProfile({ UserId: userId, userData: values })
      ).unwrap();
      showToast.success("Profile updated successfully!");
      dispatch(fetchUserData(userId));
      // navigate(-1);
    } catch (err) {
      showToast.error(err || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DiamondLoader />;
  // if (error) return <p>{error}</p>;
  return (
    // <Container maxWidth="xl" className="mt-3 mb-3">
    <div className="container-fluid" style={{ padding: "50px" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box
            className="checkout-box-u"
            style={{
              boxShadow: "0px 4px 4px 0px #00000040",
              border: "1px solid #324567",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Profile
            </Typography>
            {/* <Typography variant="body2">
              We'll use this email to send you details and updates about your
              order.
            </Typography> */}

            <Formik
              enableReinitialize
              initialValues={formValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, setFieldValue }) => (
                <Form>
                  {/* <Typography variant="h6" gutterBottom>
                    Billing Address
                  </Typography> */}

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        // value={values.FirstName}
                        label="First Name *"
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
                        // value={values.LastName}
                        label="Last Name *"
                        name="LastName"
                        variant="outlined"
                        error={touched.LastName && Boolean(errors.LastName)}
                        helperText={touched.LastName && errors.LastName}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} style={{ marginTop: "0px" }}>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        value={values.PrimaryEmail}
                        label="Email *"
                        name="PrimaryEmail"
                        variant="outlined"
                        // margin="normal"
                        error={
                          touched.PrimaryEmail && Boolean(errors.PrimaryEmail)
                        }
                        helperText={touched.PrimaryEmail && errors.PrimaryEmail}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        value={values.PhoneNo}
                        label="Phone (Optional)"
                        name="PhoneNo"
                        variant="outlined"
                        error={touched.PhoneNo && Boolean(errors.PhoneNo)}
                        helperText={touched.PhoneNo && errors.PhoneNo}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>

                  {/* <Field
                    className="address-profile"
                    as={TextField}
                    fullWidth
                    value={values.Appartment}
                    label="Address *"
                    name="Appartment"
                    variant="outlined"
                    margin="normal"
                    error={touched.Appartment && Boolean(errors.Appartment)}
                    helperText={touched.Appartment && errors.Appartment}
                    onChange={handleChange}
                  /> */}

                  <Grid container spacing={2} sx={{ mb: 2, marginTop: "0px" }}>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="City *"
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
                        label="State *"
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
                        label="Country *"
                        name="Country"
                        variant="outlined"
                        error={touched.Country && Boolean(errors.Country)}
                        helperText={touched.Country && errors.Country}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        value={values.Pincode}
                        label="Pin Code *"
                        name="Pincode"
                        variant="outlined"
                        error={touched.Pincode && Boolean(errors.Pincode)}
                        helperText={touched.Pincode && errors.Pincode}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        value={values.Username}
                        label="Username"
                        name="Username"
                        variant="outlined"
                        error={touched.Username && Boolean(errors.Username)}
                        helperText={touched.Username && errors.Username}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        value={values.UserPassword}
                        onChange={handleChange}
                        name="UserPassword"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                className="password-field"
                              >
                                {showPassword ? (
                                  <VisibilityOffIcon />
                                ) : (
                                  <VisibilityIcon />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={
                          touched.UserPassword && Boolean(errors.UserPassword)
                        }
                        helperText={touched.UserPassword && errors.UserPassword}
                      />
                    </Grid>
                  </Grid>

                  {/* <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Payment Options
                  </Typography>
                  <Typography variant="body2">
                    Confirm Payment via Consultation <br />
                    Thank you for your order! Our team will reach out to arrange
                    the payment process through your preferred communication
                    method, such as email, direct call, WhatsApp, chat, or
                    Skype. Once payment is confirmed, we’ll proceed with
                    dispatching your diamond product promptly.
                  </Typography> */}

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    className="submit-button-u mt-3"
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    className="submit-button-u mt-3 ml-2"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          {/* <Box className="cart-boxs">
             
          </Box> */}
          <div
            className="card"
            style={{
              boxShadow: "0px 4px 4px 0px #00000040",
              border: "1px solid #324567",
            }}
          >
            <div className="card-body">
              <div className="d-flex flex-column align-items-center text-center">
                <div
                  style={{
                    borderRadius: "50%",
                    padding: "20px",
                    width: "90px",
                    fontSize: "25px",
                    fontWeight: "600",
                    backgroundColor: "#c9a236",
                    color: "white",
                  }}
                >
                  {`${userData?.FirstName?.slice(
                    0,
                    1
                  ).toUpperCase()}${userData?.LastName?.slice(
                    0,
                    1
                  ).toUpperCase()}`}
                </div>

                <div className="mt-3">
                  <h4
                    style={{
                      fontWeight: "600",
                      fontSize: "18px",
                    }}
                  >
                    {userData?.FirstName}&nbsp;{userData?.LastName}
                  </h4>
                  <p
                    style={{
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    {`${userData?.PrimaryEmail}`}
                  </p>
                  <p
                    style={{
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    {`${userData?.PhoneNo}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
      {/* </Container> */}
    </div>
  );
};

export default UserProfile;
