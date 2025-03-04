import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { Routes, Route, useLocation } from "react-router-dom";
import store from "./redux/store";

import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";

import Home from "./pages/Home/Home";
import Aboutus from "./pages/About/Aboutus";
import Contactus from "./pages/Contactus/Contactus";
import Privacypolicy from "./pages/privacypolicy/privacypolicy";
import Termsofuse from "./pages/Termsofuse/Termsofuse";
import Checkout from "./pages/Checkout/Checkout";
import Login from "./pages/login/login";
import Signup from "./pages/register/register";
import Shop from "./pages/shop/shop";
import Pagenotfound from "./pages/Pagenotfound/Pagenotfound";
import Diamonddetail from "./pages/Diamonddetail/Diamonddetail";
import Forgotpassword from "./pages/Forgotpassword/Forgotpassword";
import Resetpassword from "./pages/Forgotpassword/Resetpassword";

import "./App.css";

function App() {
  console.error = () => {};
  console.warn = () => {};

  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };

  return (
    <Provider store={store}>
      <ScrollToTop />
      <Routes>
        {/* Routes with Header & Footer */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/aboutus"
          element={
            <MainLayout>
              <Aboutus />
            </MainLayout>
          }
        />
        <Route
          path="/contactus"
          element={
            <MainLayout>
              <Contactus />
            </MainLayout>
          }
        />
        <Route
          path="/privacypolicy"
          element={
            <MainLayout>
              <Privacypolicy />
            </MainLayout>
          }
        />
        <Route
          path="/termsofuse"
          element={
            <MainLayout>
              <Termsofuse />
            </MainLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <MainLayout>
              <Checkout />
            </MainLayout>
          }
        />
        <Route
          path="/diamond"
          element={
            <MainLayout>
              <Shop />
            </MainLayout>
          }
        />
        <Route
          path="/diamonddetail"
          element={
            <MainLayout>
              <Diamonddetail />
            </MainLayout>
          }
        />
        <Route
          path="*"
          element={
            <MainLayout>
              <Pagenotfound />
            </MainLayout>
          }
        />

        {/* Routes without Header & Footer */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthLayout>
              <Signup />
            </AuthLayout>
          }
        />
        <Route
          path="/forgotpassword"
          element={
            <AuthLayout>
              <Forgotpassword />
            </AuthLayout>
          }
        />
        <Route
          path="/resetpassword"
          element={
            <AuthLayout>
              <Resetpassword />
            </AuthLayout>
          }
        />
      </Routes>
      <Toaster />
      <ToastContainer />
    </Provider>
  );
}

export default App;
