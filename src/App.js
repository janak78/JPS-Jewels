import React from 'react';
import { Provider } from "react-redux";  // ✅ Import Provider
import store from "./redux/store";  // ✅ Import store
import { Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from './pages/Home';
import Aboutus from './pages/Aboutus';
import Contactus from './pages/Contactus';
import Privacypolicy from './pages/privacypolicy/privacypolicy';
import Termsofuse from './pages/Termsofuse/Termsofuse';
import Checkout from './pages/Checkout/Checkout';
import Login from './pages/login/login';
import Signup from './pages/register/register';
import Shop from './pages/shop/shop';
import Pagenotfound from './pages/Pagenotfound/Pagenotfound';

import './App.css';

function App() {
  return (
    <Provider store={store}> {/* ✅ Wrap inside Provider */}
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
          <Route path="*" element={<Pagenotfound />} />
        </Routes>
        <Footer />
      </div>
    </Provider>
  );
}

export default App;
