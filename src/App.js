import React, { lazy, Suspense, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { Routes, Route, useLocation } from "react-router-dom";
import store from "./redux/store";

import "./App.css";
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import Loader from "./components/Loader/loader";
const Home = lazy(() => import("./pages/Home/Home"));
const Aboutus = lazy(() => import("./pages/About/Aboutus"));
const Contactus = lazy(() => import("./pages/Contactus/Contactus"));
const Privacypolicy = lazy(() => import("./pages/privacypolicy/privacypolicy"));
const Termsofuse = lazy(() => import("./pages/Termsofuse/Termsofuse"));
const Checkout = lazy(() => import("./pages/Checkout/Checkout"));
const Login = lazy(() => import("./pages/login/login"));
const Signup = lazy(() => import("./pages/register/register"));
const Shop = lazy(() => import("./pages/shop/shop"));
const Pagenotfound = lazy(() => import("./pages/Pagenotfound/Pagenotfound"));
const Diamonddetail = lazy(() => import("./pages/Diamonddetail/Diamonddetail"));
const Forgotpassword = lazy(() =>
  import("./pages/Forgotpassword/Forgotpassword")
);
const Resetpassword = lazy(() =>
  import("./pages/Forgotpassword/Resetpassword")
);
const UserProfile = lazy(() => import("./pages/Userprofile/UserProfile"));

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
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
            index
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
            path="/diamonddetail/:SKU"
            element={
              <MainLayout>
                <Diamonddetail />
              </MainLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <MainLayout>
                <UserProfile />
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
      </Suspense>

      <ToastContainer />
    </Provider>
  );
}

export default App;
