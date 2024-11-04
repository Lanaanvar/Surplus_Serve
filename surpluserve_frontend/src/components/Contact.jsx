import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageSquare, Check, Loader } from 'lucide-react';
import '../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [status, setStatus] = useState('idle'); // idle, submitting, success
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form submitted:', formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success status after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('idle');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  const successVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <motion.div 
      className="contact-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="contact-card"
        variants={itemVariants}
      >
        <motion.h1 
          className="contact-heading"
          variants={itemVariants}
        >
          Get in Touch
        </motion.h1>
        <motion.p 
          className="contact-subheading"
          variants={itemVariants}
        >
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </motion.p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <motion.div 
            className={`input-group ${focusedField === 'name' ? 'focused' : ''}`}
            variants={itemVariants}
          >
            <User className="input-icon" size={18} />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              required
              className="contact-input"
            />
          </motion.div>

          <motion.div 
            className={`input-group ${focusedField === 'email' ? 'focused' : ''}`}
            variants={itemVariants}
          >
            <Mail className="input-icon" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
              className="contact-input"
            />
          </motion.div>

          <motion.div 
            className={`input-group ${focusedField === 'message' ? 'focused' : ''}`}
            variants={itemVariants}
          >
            <MessageSquare className="input-icon" size={18} />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField(null)}
              required
              className="contact-textarea"
            ></textarea>
          </motion.div>

          <motion.button
            type="submit"
            className={`contact-button ${status !== 'idle' ? 'submitting' : ''}`}
            variants={itemVariants}
            disabled={status !== 'idle'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {status === 'idle' && (
              <>
                <span>Send Message</span>
                <Send className="button-icon" size={18} />
              </>
            )}
            {status === 'submitting' && (
              <>
                <span>Sending...</span>
                <Loader className="button-icon animate-spin" size={18} />
              </>
            )}
            {status === 'success' && (
              <motion.div
                variants={successVariants}
                initial="hidden"
                animate="visible"
                className="success-content"
              >
                <span>Message Sent!</span>
                <Check className="button-icon" size={18} />
              </motion.div>
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default Contact;