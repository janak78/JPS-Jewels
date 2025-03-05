import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../redux/authSlice";
import { fetchCartCount, removeCart } from "../../redux/cartSlice";
import {
  TextField,
  Button,
  Checkbox,
  IconButton,
  FormGroup,
  InputAdornment,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
// import InputText from "../InputFields/InputText";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import showToast from "../../components/Toast/Toaster";
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
import { sendResetPasswordEmail, resetState } from "../../redux/forgotPasswordSlice";


const Forgotpassword = () => {
  const baseUrl = process.env.REACT_APP_BASE_API;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { loading, success, error } = useSelector((state) => state.forgotPasswordSlice);

  const formik = useFormik({
    initialValues: {
      PrimaryEmail: "",
    },
    validationSchema: Yup.object({
      PrimaryEmail: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: (values) => {
      dispatch(sendResetPasswordEmail(values.PrimaryEmail));
    },
  });

  useEffect(() => {
    document.body.classList.add("login--page");

    return () => {
      document.body.classList.remove("login--page");
    };
  }, []);
//   //   const baseurl =

//   const handleLogout = () => {
//     dispatch(logout());
//     dispatch(removeCart());
//     navigate("/login");
//   };

//   const handleSubmit = async (values) => {
//     try {
//       //   setLoader(true);
//       const res = await AxiosInstance.post(`${baseUrl}/user/login`, {
//         ...values,
//       });

//       if (res.data.statusCode === 200) {
//         const { token, user } = res.data;

//         if (token) {
//           // Set timeout to log out when the token expires
//           const decodedToken = JSON.parse(atob(token.split(".")[1]));
//           const expiryTime = decodedToken.exp * 1000 - Date.now();
//           const { UserId, exp } = decodedToken;

//           setTimeout(() => {
//             handleLogout();
//           }, expiryTime);
//         }

//         dispatch(login({ user, token })); // Store user and token in Redux
//         dispatch(fetchCartCount(user.UserId)); // Fetch cart count after login
//         // localStorage.removeItem("visitedDiamonds");

//         showToast.success(res.data.message, { autoClose: 3000 });

//         formik.resetForm();
//         navigate("/");
//       } else if (res.data.statusCode === 201) {
//         showToast(res.data.message);
//       } else if (res.data.statusCode === 202) {
//         showToast(res.data.message);
//       } else if (res.data.statusCode === 204) {
//         showToast(res.data.message);
//       }
//     } catch (error) {
//       if (error.response) {
//         showToast.error(error.response?.data.message || "An error occurred");
//       } else {
//         showToast.error("Something went wrong. Please try again later.");
//       }
//     } finally {
//       //   setLoader(false);
//     }
//   };

  return (
    <>
      <Grid container className="signup-container" spacing={2}>
        {/* Left Image Section */}
        <Grid
          item
          xs={12}
          md={7}
          className="signup-image-container login-image-gallery"
        >
          <div className="image-overlay">
            {/* <Typography variant="h4" className="signup-heading">
            To keep connected with the largest shop in the world.
          </Typography> */}
            <article className="gallery_wrapper gallery-login">
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
            <img src={allimage} alt="all image" className="allimage-login" />
          </div>
        </Grid>
        <Grid item xs={12} sm={8} md={5}>
          <div className="logo-page-container">
            <img src={logo} alt="logo" className="logo-image-login" />
            <span className="mr-2 backto-home" onClick={() => navigate("/")}>
              <i className="fa-solid fa-arrow-left" /> Back to home
            </span>
          </div>

          <div className="logininput-place">
            {/* Sign Up Title - Aligned to Left */}
            <Typography
              variant="h4"
              className="form-title align-left"
              gutterBottom
              sx={{ fontFamily: "Poppins" }}
            >
              Forgot Password
            </Typography>
            {/* <div className="auth-container"> */}
            {/* Login Section */}
            {/* <div className="auth-box"> */}
            {/* <h2 className="auth-title">LOGIN</h2> */}
            {/* <div className="loginpage-inputs"> */}
            <p className="forgot-password">
              Don't worry, happens to all of us. Enter your email below to
              recover your password.
            </p>
            <form onSubmit={formik.handleSubmit}>
              <FormGroup
                className="text-boxes"
                style={{ width: "100%", marginTop: "24px" }}
              >
                <TextField
                  value={formik.values.PrimaryEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.PrimaryEmail && Boolean(formik.errors.PrimaryEmail)}
                  helperText={formik.touched.PrimaryEmail && formik.errors.PrimaryEmail}
                  name="PrimaryEmail"
                  type="text"
                  className="text-blue-color w-100"
                  fullWidth
                  label="Email"
                />
              </FormGroup>
              <p className="forgot-password mt-2">
                <span className="sign-ups" onClick={() => navigate("/login")}>
                  Back to login
                </span>
              </p>
              {/* <div className="password-container">
                <TextField
                  value={formik.values.UserPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="UserPassword"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
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
                    formik.touched.UserPassword &&
                    Boolean(formik.errors.UserPassword)
                  }
                  helperText={
                    formik.touched.UserPassword && formik.errors.UserPassword
                  }
                />
              </div> */}
              {/* <p className="forgot-password">
                Don't worry, happens to all of us. Enter your email below to
                recover your password.
              </p> */}
              <Button
                type="submit"
                variant="contained"
                className="login-btn mt-3"
              >
                Submit
              </Button>
            </form>
            {/* </div> */}

            {/* </div>
            </div> */}
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Forgotpassword;
