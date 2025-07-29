// components/hero/hero.js
import React from 'react';
import './hero.css';
import profileImage from '../../assets/images/profile.svg';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <img
          src={profileImage}
          alt="Ganesh Adimalupu"
          className="profile-photo"
        />
        <h1>Hello, I'm Adimalupu Ganesh</h1>
        <p>Machine Learning Engineer & AI Solutions Developer passionate about creating intelligent systems that solve real-world problems</p>
        <div className="hero-buttons">
          <button
            className="cta-button primary"
            onClick={() => scrollToSection('about')}
          >
            Learn More
          </button>
          <button
            className="cta-button secondary"
            onClick={() => scrollToSection('contact')}
          >
            Get In Touch
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
