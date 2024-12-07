import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import { motion } from 'framer-motion';
import axios from 'axios'; // Import axios for API calls
import '../styles/Auth.css';

const DonorAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  // const [role] = useState('donor'); // Set role as 'donor'
  const [error, setError] = useState(null);
  
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Define the endpoint based on the action
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    const data = isLogin
      ? { email, password }  // Data for login
      : { email, password, role: 'donor', name, organization, phone }; // Data for signup

      try {
        const response = await axios.post(endpoint, data);
  
        if (response.data.token) {
          // Save token to local storage
          localStorage.setItem('token', response.data.token);
  
          // Navigate to donor dashboard
          navigate('/donor-dashboard');
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.msg || 'An error occurred');
      }

    // Mock login/signup logic (replace with your API call later)
    // if (email && password) {
    //   console.log(isLogin ? 'Donor Login' : 'Donor Signup', { email, password, name });

      // Simulate a successful login/signup (replace this logic as needed)
    //   if (isLogin || (!isLogin && name)) {
    //     // Navigate to the DonorDash page after successful login/signup
    //     navigate('/donor-dashboard');
    //   } else {
    //     alert('Please enter all required fields.');
    //   }
    // }
  };

  return (
    <div className="auth-page donor-theme">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="auth-card"
      >
        <h2 className="auth-title">
          {isLogin ? 'Donor Login' : 'Donor Signup'}
        </h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Name field for signup only */}
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="form-group"
            >
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </motion.div>
          )}

          {/* Organization field for signup only */}
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="form-group"
            >
              <label>Organization</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </motion.div>
          )}

          {/* Phone field for signup only */}
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="form-group"
            >
              <label>Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </motion.div>
          )}

          {/* Email field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="form-group"
          >
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </motion.div>

          {/* Password field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="form-group"
          >
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </motion.div>

          {/* Error message display */}
          {error && <p className="error-message">{error}</p>}

          {/* Submit button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="submit-button"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </motion.button>
        </form>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="auth-toggle"
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="toggle-button"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default DonorAuth;
