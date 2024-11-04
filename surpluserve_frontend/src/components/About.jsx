import React from 'react';
import '../styles/About.css';

function About() {
  return (
    <div className="about-container">
      <div className="about-header-container">
        <h1 className="about-heading">About Surplus Serve</h1>
        <div className="about-header-animation">
          <div className="zoom-container">
            <div className="zoom-in-out">
              <svg viewBox="0 0 100 100" className="about-icon">
                <path d="M50,20A30,30,0,1,0,80,50,30,30,0,0,0,50,20Zm0,55A25,25,0,1,1,75,50,25,25,0,0,1,50,75Z" />
                <path d="M46.78,49.14l-.56.56a1,1,0,0,0,0,1.41l7.51,7.51a1,1,0,0,0,1.41,0l.56-.56a1,1,0,0,0,0-1.41l-7.51-7.51A1,1,0,0,0,46.78,49.14Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="about-content-container">
        <p className="about-paragraph">
          Surplus Serve is a platform dedicated to reducing food waste and fighting hunger in our communities. We connect food donors with local organizations and individuals in need, ensuring that surplus food finds its way to those who can benefit from it most.
        </p>
        <p className="about-paragraph">
          Our mission is to create a more sustainable and equitable food system by:
        </p>
        <ul className="about-list">
          <li>Reducing food waste from restaurants, grocery stores, and other food businesses</li>
          <li>Providing nutritious meals to individuals and families facing food insecurity</li>
          <li>Fostering a sense of community and social responsibility</li>
          <li>Promoting environmental sustainability by reducing the environmental impact of food waste</li>
        </ul>
        <p className="about-paragraph">
          Join us in our efforts to make a positive impact on both people and the planet. Whether you're a potential donor or recipient, your participation can help create a more sustainable and caring world.
        </p>
      </div>
    </div>
  );
}

export default About;