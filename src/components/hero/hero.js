// components/hero/hero.js - Modern Jenny-Style Hero
import React from 'react';
import './hero.css';
import profileImage from '../../assets/images/profile.webp';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        {/* Left Content */}
        <div className="hero-content">
          <div className="greeting-badge">
            <span className="wave">👋</span>
            <span>Hello!</span>
          </div>

          <h1 className="hero-title">
            I'm <span className="name-highlight">Ganesh</span>,<br />
            <span className="role">Machine Learning Engineer</span>
          </h1>

          <p className="hero-description">
            Exceptional AI solutions for your business success.
            Building intelligent systems that solve real-world problems.
          </p>

          <div className="hero-buttons">
            <button
              className="cta-btn primary"
              onClick={() => scrollToSection('portfolio')}
            >
              Portfolio <span className="arrow">↗</span>
            </button>
            <button
              className="cta-btn secondary"
              onClick={() => scrollToSection('contact')}
            >
              Hire me
            </button>
          </div>
        </div>

        {/* Right Content - Image & Stats */}
        <div className="hero-visual">
          <div className="image-container">
            <div className="bg-circle"></div>
            <img
              src={profileImage}
              alt="Ganesh Adimalupu"
              className="hero-image"
            />
          </div>

          <div className="experience-card">
            <div className="stars">
              <span>⭐⭐⭐⭐⭐</span>
            </div>
            <div className="experience-text">
              <span className="years">1+</span>
              <span className="label">Years Experience</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
