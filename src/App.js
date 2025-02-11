import React from 'react';
import Header from "./components/Header"
import Footer from "./components/Footer"
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contactus from './pages/Contactus';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Contactus />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
