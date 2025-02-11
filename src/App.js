import React from 'react';
import Header from "./components/Header"
import Footer from "./components/Footer"
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Aboutus from './pages/Aboutus';
import Contactus from './pages/Contactus';
import Termsofuse from './pages/Termsofuse/Termsofuse';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/termsofuse" element={<Termsofuse />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
