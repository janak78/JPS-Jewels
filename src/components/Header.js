import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartCount } from "../redux/cartSlice";
import { removeCart } from "../redux/cartSlice";
import { logout, login } from "../redux/authSlice";
import {
  Drawer,
  TextField,
  Typography,
  Button,
  Badge,
  Box,
  ClickAwayListener,
  Checkbox,
  IconButton,
  FormGroup,
  InputAdornment,
  FormControlLabel,
} from "@mui/material";
import logo from "../assets/images/logo.svg";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { jwtDecode } from "jwt-decode";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import showToast from "../components/Toast/Toaster";
import AxiosInstance from "../Axiosinstance";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [countData, setCountData] = useState(null);
  // const [cartData, setCartData] = useState(null);

  const [cartopen, setCartOpen] = useState(false);
  // const cartCount = 3;

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userName = useSelector((state) => state.auth.Username);
  const cartCount = useSelector((state) => state.cart.cartCount);
  const cartData = useSelector((state) => state.cart.cartData);
  console.log(cartCount, "cc");
  console.log(cartData, "cd");
  console.log(userName, "un");

  const handleLogout = () => {
    dispatch(logout());
    dispatch(removeCart());
  };

  const checkUserToken = () => {
    const token = localStorage.getItem("Token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log(decoded, "decodedddddddddd"); // Decode JWT Token
        // setUserName(decoded.Username); // Store User Name
        setUserId(decoded.UserId); // Store User Name
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };
  // Run cartcount() only after userId is set
  useEffect(() => {
    const userId = localStorage.getItem("UserId");
    if (userId) {
      dispatch(fetchCartCount(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    checkUserToken();
  }, []);

  // const cartcount = async (userId) => {
  //   try {
  //     //   setLoader(true);
  //     const res = await AxiosInstance.get(
  //       `http://localhost:5000/api/cart/cart?userId=${userId}`
  //     );
  //     console.log(res, "resres");

  //     console.log(res, "resss");
  //     if (res.data.statusCode === 200) {
  //       setCountData(res.data.TotalCount);
  //       setCartData(res.data.data);
  //       formik.resetForm();
  //       navigate("/");
  //       setOpen(false);
  //     } else if (res.data.statusCode === 201) {
  //       showToast.error(res.data.message);
  //     } else if (res.data.statusCode === 202) {
  //       showToast.error(res.data.message);
  //     } else if (res.data.statusCode === 204) {
  //       showToast.error(res.data.message);
  //     }
  //   } catch (error) {
  //     if (error.response) {
  //       showToast.error(error.response?.data.message || "An error occurred");
  //     } else {
  //       showToast.error("Something went wrong. Please try again later.");
  //     }
  //   } finally {
  //     //   setLoader(false);
  //   }
  // };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const formik = useFormik({
    initialValues: {
      Username: "",
      UserPassword: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object().shape({
      Username: Yup.string().required("Email is required"),
      UserPassword: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    try {
      //   setLoader(true);
      const res = await axios.post(`http://localhost:5000/api/user/login`, {
        ...values,
      });

      console.log(res, "resss");
      if (res.data.statusCode === 200) {
        // localStorage.setItem("Token", res.data.token);
        // localStorage.setItem("UserId", res.data.user.UserId);
        // // setUserName(res.data.user.Username);
        // showToast.success(res.data.message, {
        //   autoClose: 3000,
        // });
        // formik.resetForm();
        // navigate("/");
        // setOpen(false);

        const { token, user } = res.data;

        dispatch(login({ user, token })); // Store user and token in Redux
        dispatch(fetchCartCount(user.UserId)); // Fetch cart count after login

        showToast.success(res.data.message, { autoClose: 3000 });

        formik.resetForm();
        navigate("/");
      } else if (res.data.statusCode === 201) {
        showToast(res.data.message);
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

  const location = useLocation();

  return (
    <header className="header">
      {/* Left Logo */}
      <div className="logo">
        <img src={logo} alt="JPS Jewels" className="logo-image" />
      </div>

      {/* Navigation Links (Hidden on Small Screens) */}
      <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          HOME
        </Link>
        <Link
          to="/shop"
          className={`nav-link ${
            location.pathname === "/shop" ? "active" : ""
          }`}
        >
          DIAMOND
        </Link>
        <Link
          to="/aboutus"
          className={`nav-link ${
            location.pathname === "/aboutus" ? "active" : ""
          }`}
        >
          ABOUT US
        </Link>
        <Link
          to="/contactus"
          className={`nav-link ${
            location.pathname === "/contactus" ? "active" : ""
          }`}
        >
          CONTACT US
        </Link>
      </nav>

      {/* Right Section: Icons + Mobile Menu */}
      <div className="right-section">
        {/* Icons */}
        <div className="icons">
          <i className="fa-solid fa-magnifying-glass icon"></i>

          {/* Cart Icon with Badge */}
          <div className="cart-icon-container">
            <IconButton
              color="inherit"
              onClick={() => setCartOpen(true)}
              className="cart-button"
            >
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon fontSize="small" />
              </Badge>
            </IconButton>
          </div>
          <Drawer
            anchor="right"
            open={cartopen}
            onClose={() => setCartOpen(false)}
          >
            <Box
              className="cart-drawer"
              sx={{
                width: 350,
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                padding: 2,
                position: "relative",
              }}
            >
              <IconButton
                className="closeicon"
                onClick={() => setCartOpen(false)}
                sx={{ position: "absolute", top: 10, right: 10 }}
              >
                <CloseIcon />
              </IconButton>

              <Typography
                variant="h6"
                sx={{ marginBottom: 2, textAlign: "left" }}
              >
                CART
              </Typography>
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
                        }}
                      >
                        <div>
                          <img
                            className="ImagessElement"
                            src={item?.diamondDetails?.Image}
                            // alt={diamondType}
                            style={{
                              width: "70px",
                              height: "70px",
                              borderRadius: "10px",
                            }}
                          />
                        </div>
                        <div style={{ marginLeft: "15px" }}>
                          <span style={{ marginBottom: "0" }}>
                            <span>{item?.diamondDetails?.Carats || ""}</span> Carat{" "}
                            <span>{item?.diamondDetails?.Shape}</span>
                            <span>{item?.diamondDetails?.Color}</span> /
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

              <Button
                className="checkoutbutton"
                variant="contained"
                sx={{
                  marginTop: "auto",
                  backgroundColor: "#C9A236",
                }}
                onClick={() => {
                  navigate("/checkout");
                  setCartOpen(false);
                }}
              >
                Checkout
              </Button>
            </Box>
          </Drawer>

          {/* <i className="fa-regular fa-user icon"></i>
           */}
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <div className="user-login-container">
              {/* User Icon */}
              <PersonOutlineIcon
                className="user-icon"
                onClick={() => setOpen(!open)}
              />

              {/* Dropdown Login Form */}
              {open && (
                <div className="login-dropdown">
                  {userName ? (
                    <div className="user-info-container">
                      <p className="user-welcome-text">Welcome, {userName}</p>

                      <p
                        className="forgot-signup"
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <span
                          onClick={() => {
                            navigate("/login");
                            localStorage.clear();
                            formik.resetForm();
                            // setUserName(null);
                            setOpen(false);
                            setCountData(null);
                            handleLogout();
                          }}
                          style={{ cursor: "pointer" }}
                          className="logout-text"
                        >
                          Log out
                        </span>
                        <span
                          onClick={() => {
                            navigate("/signup");
                            setOpen(false);
                          }}
                          style={{ cursor: "pointer" }}
                          className="logout-text"
                        >
                          Sign Up
                        </span>
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={formik.handleSubmit}>
                      <FormGroup
                        className="text-boxes"
                        style={{ width: "100%", marginTop: "24px" }}
                      >
                        <TextField
                          value={formik.values.Username}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.Username &&
                            Boolean(formik.errors.Username)
                          }
                          helperText={
                            formik.touched.Username && formik.errors.Username
                          }
                          name="Username"
                          label="Username"
                          type="text"
                          className="text-blue-color w-100"
                          fullWidth
                        />
                      </FormGroup>

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
                            formik.touched.UserPassword &&
                            formik.errors.UserPassword
                          }
                        />
                      </div>

                      <p className="forgot-signup">
                        <span
                          onClick={() => {
                            navigate("/login");
                            localStorage.clear();
                            formik.resetForm();
                            setOpen(false);
                            handleLogout();
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          Log out
                        </span>{" "}
                        <span
                          className="signup-link-signup"
                          onClick={() => {
                            navigate("/signup");
                            setOpen(false);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          Sign up
                        </span>
                      </p>

                      <Button
                        type="submit"
                        variant="contained"
                        className="login-btn-login"
                      >
                        Login
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </ClickAwayListener>
        </div>

        {/* Mobile Menu Toggle (Only Visible Below 768px) */}
        <div className="mobile-menu" onClick={toggleMenu}>
          <i className={`fa-solid ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
