import React from 'react';
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header"
import Footer from "./components/Footer"
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Aboutus from './pages/Aboutus';
import Contactus from './pages/Contactus';
import Privacypolicy from './pages/privacypolicy/privacypolicy';
import Termsofuse from './pages/Termsofuse/Termsofuse';
import Checkout from './pages/Checkout/Checkout';
import Login from './pages/login/login';
import Signup from './pages/register/register';
import Shop from './pages/shop/shop';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/privacypolicy" element={<Privacypolicy />} />
        <Route path="/termsofuse" element={<Termsofuse />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
      <Toaster />
      <ToastContainer />
      <Footer />
    </div>
  );
}

export default App;
