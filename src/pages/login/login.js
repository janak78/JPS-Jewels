import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";
import { fetchCartCount } from "../../redux/cartSlice";
import {
  TextField,
  Button,
  Checkbox,
  IconButton,
  FormGroup,
  InputAdornment,
  FormControlLabel,
} from "@mui/material";
// import InputText from "../InputFields/InputText";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import showToast from "../../components/Toast/Toaster";
import "./login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      Username: "",
      UserPassword: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object().shape({
      Username: Yup.string()
        .required("Email is required"),
      UserPassword: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
        handleSubmit(values);
    },
  });

//   const baseurl = 

  const handleSubmit = async (values) => {
    try {
    //   setLoader(true);
      const res = await axios.post(`http://localhost:5000/api/user/login`, {
        ...values,
      });

      console.log(res,"resss")
      if (res.data.statusCode === 200) {
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


  return (
    <>
      <div className="auth-container">
        {/* Login Section */}
        <div className="auth-box">
      <h2 className="auth-title">LOGIN</h2>
      <form onSubmit={formik.handleSubmit}>
        <FormGroup className="text-boxes" style={{ width: "100%", marginTop: "24px" }}>
          <TextField
            value={formik.values.Username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.Username && Boolean(formik.errors.Username)}
            helperText={formik.touched.Username && formik.errors.Username}
            name="Username"
            type="text"
            className="text-blue-color w-100"
            fullWidth
            label="Username"
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
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={formik.touched.UserPassword && Boolean(formik.errors.UserPassword)}
            helperText={formik.touched.UserPassword && formik.errors.UserPassword}
          />
        </div>
        <p className="forgot-password">Lost your password?</p>
        <Button type="submit" variant="contained" className="login-btn">
          Login
        </Button>
      </form>
    </div>

        {/* Register Section */}
        <div className="auth-box">
          <h2 className="auth-title">REGISTER</h2>
          <p>
            To sign up or register, please click the link below. By registering,
            you agree to our{" "}
            <span
              className="privacy-link"
              onClick={() => navigate("/privacypolicy")}
            >
              Privacy Policy
            </span>{" "}
            and{" "}
            <span
              className="terms-link"
              onClick={() => navigate("/termsofuse")}
            >
              Terms & Conditions
            </span>
            .
          </p>
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="I agree to the Privacy Policy and Terms & Conditions"
          />
          <Button variant="contained" className="register-btn">
            Register or Sign Up
          </Button>
        </div>
      </div>
    </>
  );
};

export default Login;
