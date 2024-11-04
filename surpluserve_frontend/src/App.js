import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/LandPage';
import Navbar from './components/Navbar';
import LandPage from './components/Login';
import AboutPage from './components/About';
import ContactPage from './components/Contact';
import DonorAuth from './components/DonorAuth';
import RecipientAuth from './components/RecipientAuth';
import DonorDashboard from './components/DonorDash';
import RecipientDashboard from './components/RecipientDash';
import ReservationPage from './components/Reservation';
import NewDonation from './components/NewDonation';
//import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LandPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/donor-auth" element={<DonorAuth />} />
        <Route path="/recipient-auth" element={<RecipientAuth />} />
        <Route path="/donor-dashboard" element={<DonorDashboard />} />
        <Route path="/new-donations" element={<NewDonation/>} />
        <Route path="/recipient-dashboard" element={<RecipientDashboard />} />
        <Route path="/reservation" element={<ReservationPage />} />
      </Routes>
    </Router>
  );
}

export default App;