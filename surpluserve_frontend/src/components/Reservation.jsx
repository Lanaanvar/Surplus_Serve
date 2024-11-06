import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Clock, ShoppingBag, Check } from 'lucide-react';
import { ReceiptGenerator } from './RecieptGenerator';
import axios from 'axios';
import '../styles/Reservation.css';

const ReservationPage = () => {
  const [donation, setDonation] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const donationId = location.state?.donationId;

  useEffect(() => {
    if (!donationId) {
      navigate('/dashboard');
      return;
    }
    fetchDonationDetails();
  }, [donationId, navigate]);

  const fetchDonationDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/recipient/dashboard/${donationId}`, {
        headers: { 'x-auth-token': token }
      });
      setDonation(response.data);
    } catch (error) {
      setError('Failed to fetch donation details');
      console.error('Error fetching donation:', error);
    }
  };

  const handleClaim = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }
  
      const response = await axios.post(`/api/recipient/claim/${donationId}`, {}, {
        headers: { 'x-auth-token': token }
      });

      if (response.data.receipt && response.data.donation) {
        setReceipt(response.data.receipt);
        setDonation(response.data.donation);
        setSuccess(true);
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to claim donation');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      if (!donation || !receipt) {
        throw new Error('Missing donation or receipt data');
      }

      const generator = new ReceiptGenerator(donation, receipt);
      const doc = await generator.generateReceipt();
      doc.save(`Receipt_${receipt.receiptId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF receipt. Please try again.');
    }
  };

  if (success && receipt) {
    return (
      <div className="reservation-container">
        <div className="reservation-card">
          <div className="reservation-content">
            <div className="success-header">
              <h2 className="success-title">
                <Check className="success-icon" />
                Donation Claimed Successfully
              </h2>
              <span className="success-badge">
                Confirmed
              </span>
            </div>

            <div className="details-container">
              {/* Donation Details Section */}
              <div className="details-section">
                <h3 className="section-title">Donation Details</h3>
                <div className="details-grid">
                  <div className="details-column">
                    <div className="detail-item">
                      <ShoppingBag className="detail-icon" />
                      <span><strong>Food Type:</strong> {donation?.foodType}</span>
                    </div>
                    <div className="detail-item">
                      <Clock className="detail-icon" />
                      <span><strong>Quantity:</strong> {donation?.quantity} servings</span>
                    </div>
                  </div>
                  <div className="details-column">
                    <div className="detail-item">
                      <MapPin className="detail-icon" />
                      <span><strong>Pickup Location:</strong> {donation?.pickupLocation}</span>
                    </div>
                    <div className="detail-item">
                      <Clock className="detail-icon" />
                      <span><strong>Created:</strong> {new Date(donation?.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Receipt Details Section */}
              <div className="details-section">
                <h3 className="section-title">Receipt Details</h3>
                <div className="details-grid">
                  <div className="details-column">
                    <p className="receipt-detail"><strong>Receipt ID:</strong> <span className="mono-text">{receipt.receiptId}</span></p>
                    <p className="receipt-detail"><strong>Donor Organization:</strong> {receipt.donor}</p>
                    <p className="receipt-detail"><strong>Recipient:</strong> {receipt.recipient}</p>
                  </div>
                  <div className="details-column">
                    <p className="receipt-detail"><strong>Item Name:</strong> {receipt.itemName}</p>
                    <p className="receipt-detail"><strong>Quantity:</strong> {receipt.quantity} servings</p>
                    <p className="receipt-detail"><strong>Date:</strong> {new Date(receipt.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              {receipt.qrCode && (
                <div className="qr-section">
                  <h3 className="section-title">Pickup QR Code</h3>
                  <div className="qr-container">
                    <img 
                      src={receipt.qrCode} 
                      alt="Pickup QR Code" 
                      className="qr-code"
                    />
                  </div>
                  <p className="qr-instruction">
                    Show this QR code when picking up your donation
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons">
                <button onClick={() => window.print()} className="print-button">
                  Print Receipt
                </button>
                <button onClick={handleDownloadPDF} className="download-button">
                  Download PDF
                </button>
                <button onClick={() => navigate('/recipient-dashboard')} className="return-button">
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reservation-container">
      <div className="reservation-card">
        <div className="reservation-content">
          <h2 className="confirmation-title">Confirm Donation Claim</h2>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          {donation && (
            <div className="donation-details">
              <div className="detail-item">
                <ShoppingBag className="detail-icon" />
                <span className="detail-text">{donation.foodType}</span>
              </div>
              <div className="detail-item">
                <MapPin className="detail-icon" />
                <span className="detail-text">{donation.pickupLocation}</span>
              </div>
              <div className="detail-item">
                <Clock className="detail-icon" />
                <span className="detail-text">Quantity: {donation.quantity} servings</span>
              </div>
            </div>
          )}
          <button 
            onClick={handleClaim}
            className="claim-button"
            disabled={loading}
          >
            {loading ? 'Claiming...' : 'Claim Donation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;