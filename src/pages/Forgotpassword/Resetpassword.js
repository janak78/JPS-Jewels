import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Grid,
  Typography,
} from "@mui/material";
// import InputText from "../InputFields/InputText";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams , useLocation} from "react-router-dom";
import "../login/login.css";
import "./Resetpassword.css";
import logo from "../../assets/images/logo.svg";
import {
  checkTokenStatus,
  resetPassword,
  resetState,
} from "../../redux/resetPasswordSlice";
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

const Resetpassword = () => {
  const baseUrl = process.env.REACT_APP_BASE_API;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
   // Extract token from the URL query parameters
   const searchParams = new URLSearchParams(location.search);
   const token = searchParams.get("token");
 
  const {  success, error } = useSelector(
    (state) => state.resetPasswordSlice
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    dispatch(checkTokenStatus(token)); // Check if token is valid
  }, [dispatch, token]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate("/login"); // Redirect to login after success
        dispatch(resetState());
      }, 3000);
    }
  }, [success, navigate, dispatch]);

  const formik = useFormik({
    initialValues: {
      UserPassword: "",
      UserConfirmPassword: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object().shape({
      UserPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      UserConfirmPassword: Yup.string()
        .oneOf([Yup.ref("UserPassword"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: (values) => {
      dispatch(resetPassword({ token, password: values.UserPassword }));
    },
  });

  useEffect(() => {
    document.body.classList.add("login--page");

    return () => {
      document.body.classList.remove("login--page");
    };
  }, []);
  //   const baseurl =

//   if (tokenExpired) {
//     return <h2>Token expired. Please request a new password reset email.</h2>;
//   }

  return (
    <>
      <Grid container className="signup-container" spacing={2}>
        <Grid
          item
          xs={12}
          md={7}
          className="signup-image-container login-image-gallery"
        >
          <div className="image-overlay">
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
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Reset Password
            </Typography>

            <form onSubmit={formik.handleSubmit}>
              <div className="password-container">
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
                    formik.touched.UserPassword &&
                    Boolean(formik.errors.UserPassword)
                  }
                  helperText={
                    formik.touched.UserPassword && formik.errors.UserPassword
                  }
                />
                <TextField
                  value={formik.values.UserConfirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="UserConfirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                          className="password-field"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={
                    formik.touched.UserConfirmPassword &&
                    Boolean(formik.errors.UserConfirmPassword)
                  }
                  helperText={
                    formik.touched.UserConfirmPassword &&
                    formik.errors.UserConfirmPassword
                  }
                />
              </div>
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

export default Resetpassword;
