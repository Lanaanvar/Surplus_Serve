import React, { useRef } from 'react';
import '../styles/LandPage.css';
import feature1Image from '../assets/pic2.jpg';
import feature2Image from '../assets/pic3.jpg';
import feature3Image from '../assets/pic4.jpg';
import feature4Image from '../assets/pic5.jpg';

const LandingPage = () => {
  const scrollContainerRef = useRef(null);
  // Add a new ref for the features section
  const featuresSectionRef = useRef(null);

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  // Add function to handle scrolling to features
  const scrollToFeatures = () => {
    featuresSectionRef.current.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-heading">Welcome To Surplus Serve!</h1>
          <button 
            className="hero-button"
            onClick={scrollToFeatures}  // Add onClick handler
          >
            Explore the features
          </button>
        </div>
      </section>

      {/* Feature Scrolling Section */}
      <div 
        className="features-section"
        ref={featuresSectionRef}  // Add ref to features section
      >
        <h2 className="feature-heading">Our Features</h2>
        <div className="image-scroll-container">
          <button className="scroll-button left" onClick={scrollLeft}>&lt;</button>
          <div className="image-scroll" ref={scrollContainerRef}>
            <div className="scroll-item">
              <img src={feature1Image} alt="Feature 1" className="scroll-image" />
              <p className="feature-caption">Feature 1: Donate Surplus Food</p>
            </div>
            <div className="scroll-item">
              <img src={feature2Image} alt="Feature 2" className="scroll-image" />
              <p className="feature-caption">Feature 2: Find Nearby Charities</p>
            </div>
            <div className="scroll-item">
              <img src={feature3Image} alt="Feature 3" className="scroll-image" />
              <p className="feature-caption">Feature 3: Get Discounted Meals</p>
            </div>
            <div className="scroll-item">
              <img src={feature4Image} alt="Feature 4" className="scroll-image" />
              <p className="feature-caption">Feature 4: Reduce Food Waste</p>
            </div>
          </div>
          <button className="scroll-button right" onClick={scrollRight}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;