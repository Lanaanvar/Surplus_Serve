/**
 * Common utility functions for the donation application
 */

/**
 * Format a date string or Date object into a localized string
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
    try {
      const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(dateObj);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };
  
  /**
   * Format currency values
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code (default: 'USD')
   * @returns {string} Formatted currency string
   */
  export const formatCurrency = (amount, currency = 'USD') => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `${amount}`;
    }
  };
  
  /**
   * Generate a unique identifier
   * @param {string} prefix - Optional prefix for the ID
   * @returns {string} Unique identifier
   */
  export const generateId = (prefix = '') => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${prefix}${timestamp}-${randomStr}`;
  };
  
  /**
   * Format quantity with units
   * @param {number} quantity - The quantity amount
   * @param {string} unit - The unit of measurement (e.g., 'servings', 'pieces')
   * @returns {string} Formatted quantity string
   */
  export const formatQuantity = (quantity, unit = 'servings') => {
    try {
      const formattedNum = new Intl.NumberFormat('en-US').format(quantity);
      return `${formattedNum} ${unit}`;
    } catch (error) {
      console.error('Error formatting quantity:', error);
      return `${quantity} ${unit}`;
    }
  };
  
  /**
   * Truncate text to a specified length
   * @param {string} text - Text to truncate
   * @param {number} length - Maximum length
   * @returns {string} Truncated text
   */
  export const truncateText = (text, length = 50) => {
    if (!text) return '';
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };
  
  /**
   * Validate email address format
   * @param {string} email - Email address to validate
   * @returns {boolean} Whether the email is valid
   */
  export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Convert file to base64 string
   * @param {File} file - File to convert
   * @returns {Promise<string>} Base64 string
   */
  export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  
  /**
   * Format phone number to (XXX) XXX-XXXX
   * @param {string} phoneNumber - Phone number to format
   * @returns {string} Formatted phone number
   */
  export const formatPhoneNumber = (phoneNumber) => {
    try {
      const cleaned = phoneNumber.replace(/\D/g, '');
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
      }
      return phoneNumber;
    } catch (error) {
      console.error('Error formatting phone number:', error);
      return phoneNumber;
    }
  };
  
  /**
   * Calculate time difference from now
   * @param {string|Date} date - Date to compare
   * @returns {string} Human readable time difference
   */
  export const timeFromNow = (date) => {
    try {
      const now = new Date();
      const then = new Date(date);
      const diffInSeconds = Math.floor((now - then) / 1000);
      
      if (diffInSeconds < 60) return 'just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
      
      return formatDate(date, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      console.error('Error calculating time difference:', error);
      return 'Invalid Date';
    }
  };