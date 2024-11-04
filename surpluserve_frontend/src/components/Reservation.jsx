import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Clock, ShoppingBag, Check } from 'lucide-react';
import { ReceiptGenerator } from './RecieptGenerator';
import axios from 'axios';
// import jsPDF from 'jspdf';
import { formatDate } from '../utils';

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
    }finally {
      setLoading(false); // Ensure loading state is set to false
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
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Check className="text-green-500" />
                Donation Claimed Successfully
              </h2>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                Confirmed
              </span>
            </div>

            <div className="space-y-6">
              {/* Donation Details Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4 text-lg">Donation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-gray-500" />
                      <span><strong>Food Type:</strong> {donation?.foodType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span><strong>Quantity:</strong> {donation?.quantity} servings</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <span><strong>Pickup Location:</strong> {donation?.pickupLocation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span><strong>Created:</strong> {new Date(donation?.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Receipt Details Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4 text-lg">Receipt Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><strong>Receipt ID:</strong> <span className="font-mono">{receipt.receiptId}</span></p>
                    <p><strong>Donor Organization:</strong> {receipt.donor}</p>
                    <p><strong>Recipient:</strong> {receipt.recipient}</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Item Name:</strong> {receipt.itemName}</p>
                    <p><strong>Quantity:</strong> {receipt.quantity} servings</p>
                    <p><strong>Date:</strong> {new Date(receipt.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              {receipt.qrCode && (
                <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-medium mb-4 text-lg">Pickup QR Code</h3>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <img 
                      src={receipt.qrCode} 
                      alt="Pickup QR Code" 
                      className="w-48 h-48"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-4 text-center">
                    Show this QR code when picking up your donation
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => window.print()}
                  // className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                  style={{ backgroundColor: 'gray', color: 'white' }} 
                >
                  Print Receipt
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                >
                  Download PDF
                </button>
                <button 
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                  onClick={() => navigate('/dashboard')}
                >
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
    <div className="max-w-2xl mx-auto p-6">
      {/* Loading and error handling UI */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Confirm Donation Claim</h2>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}
          {donation && (
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gray-500" />
                <span className="font-medium">{donation.foodType}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span>{donation.pickupLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span>Quantity: {donation.quantity} servings</span>
              </div>
            </div>
          )}
          <button 
            onClick={handleClaim}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
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
