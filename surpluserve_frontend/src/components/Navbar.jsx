import React, { useState } from 'react';
import logo from '../assets/logo.png'; // Adjust the path to your logo

const navbarStyles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    position: 'relative', // Set position relative for dropdown alignment
  },
  navbarLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  navbarLogo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginLeft: '12px',
  },
  logoImage: {
    height: '60px', // Adjust the size as needed
    width: '60px',
  },
  dropdown: {
    position: 'absolute', // Ensures it overlaps other content
    top: '1rem', 
    right: '1rem', 
    zIndex: 3, // High z-index for overlap
  },
  dropdownButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer',
  },
  dropdownContent: {
    display: 'none', // Hidden by default
    position: 'absolute',
    backgroundColor: '#4CAF50',
    minWidth: '160px',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
    zIndex: 3, // Ensure dropdown is on top
  },
  dropdownContentVisible: {
    display: 'block', // Shown when the dropdown is toggled
  },
  dropdownItem: {
    color: 'white',
    padding: '12px 16px',
    textDecoration: 'none',
    display: 'block',
  },
  dropdownItemHover: {
    backgroundColor: '#3e8e41',
  },
};

function Navbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <nav style={navbarStyles.navbar}>
      <div style={navbarStyles.navbarLeft}>
        <img src={logo} alt="Logo" style={navbarStyles.logoImage} />
        <span style={navbarStyles.navbarLogo}>SURPLUS SERVE</span>
      </div>
      <div style={navbarStyles.dropdown}>
        <button style={navbarStyles.dropdownButton} onClick={toggleDropdown}>
          MENU
        </button>
        <div
          style={{
            ...navbarStyles.dropdownContent,
            ...(dropdownVisible ? navbarStyles.dropdownContentVisible : {}),
          }}
        >
          <a href="/" style={navbarStyles.dropdownItem}>
            HOME
          </a>
          <a href="/about" style={navbarStyles.dropdownItem}>
            ABOUT
          </a>
          <a href="/contact" style={navbarStyles.dropdownItem}>
            CONTACT
          </a>
          <a href="/login" style={navbarStyles.dropdownItem}>
            LOGIN
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
