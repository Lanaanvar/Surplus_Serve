import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, MapPin, Calendar, Search } from 'lucide-react';
import axios from 'axios';
import '../styles/RecipientDash.css'
import API_URL from '../config';

const RecipientDashboard = () => {
  const [availableDonations, setAvailableDonations] = useState([]);
  const navigate = useNavigate();
  
  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('${API_URL}/api/recipient/dashboard', {
        headers: {
          'x-auth-token': token,
        },
      });
      console.log(response.data.availableDonations);
      setAvailableDonations(response.data.availableDonations);
    } catch (error) {
      console.error("Error fetching available donations: ", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleReserve = (donationId) => {
    navigate(`/reservation`, {state: {donationId}});
  };

  return (
    <div className="dashboard-container">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="dashboard-content"
      >
        {/* Header */}
        <div className="dashboard-header">
          <motion.h1 
            variants={itemVariants}
            className="text-3xl font-bold text-gray-900"
          >
            Available Donations
          </motion.h1>
          <motion.div 
            variants={itemVariants}
            className="search-controls"
          >
            <div className="search-container">
              <Search className="search-icon" />
              <input 
                type="text" 
                placeholder="Search donations..." 
                className="search-input" 
              />
            </div>
            <button className="location-button">
              <MapPin className="h-4 w-4 mr-2" />
              Change Location
            </button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div 
          variants={containerVariants}
          className="stats-grid"
        >
          <motion.div variants={itemVariants}>
            <div className="stat-card">
              <div className="stat-header">
                <h3 className="text-sm font-medium">Available Now</h3>
                <ShoppingBag className="stat-icon" />
              </div>
              <div className="stat-value">{availableDonations.length}</div>
              <p className="stat-description">In your area</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="stat-card">
              <div className="stat-header">
                <h3 className="text-sm font-medium">Next Available Pickup</h3>
                <Clock className="stat-icon" />
              </div>
              <div className="stat-value">30m</div>
              <p className="stat-description">Within 2km radius</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="stat-card">
              <div className="stat-header">
                <h3 className="text-sm font-medium">Scheduled Pickups</h3>
                <Calendar className="stat-icon" />
              </div>
              <div className="stat-value">3</div>
              <p className="stat-description">For this week</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Available Donations List */}
        <motion.div variants={itemVariants} className="donations-container">
          <h2 className="donations-title">Nearby Donations</h2>
          {availableDonations.map((donation) => (
            <div key={donation._id} className="donation-card">
              <div className="donation-info">
                <h3 className="donation-location">{donation.pickupLocation}</h3>
                <p className="donation-details">{donation.itemDetails}</p>
                <div className="donation-metadata">
                  <span className="metadata-item">
                    <MapPin className="metadata-icon" />
                    {donation.foodType}
                  </span>
                  <span className="metadata-item">
                    <Clock className="metadata-icon" />
                    {donation.quantity} servings
                  </span>
                </div>
              </div>
              <button 
                onClick={() => handleReserve(donation._id)} 
                className="reserve-button"
              >
                Reserve
              </button>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RecipientDashboard;