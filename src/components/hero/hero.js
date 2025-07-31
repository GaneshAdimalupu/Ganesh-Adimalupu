import React from 'react';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { motion } from 'framer-motion';
import './hero.css';
import profileImage from '../../assets/images/profile.webp';

const Hero = () => {
  const [text] = useTypewriter({
    words: [
      'Machine Learning Engineer 💻',
      'AI Solutions Developer 🤖',
      'Open Source Contributor 🌐',
    ],
    loop: true,
    delaySpeed: 2000,
  });

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="parallax-bg"></div>

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <img
          src={profileImage}
          alt="Adimalupu Ganesh profile"
          className="profile-photo"
        />
        <h1>Hello, I'm <span className="highlight">Adimalupu Ganesh</span></h1>

        <p className="typing-text">
          <span>{text}</span>
          <Cursor cursorColor="#00CDFE" />
        </p>

        <div className="hero-buttons">
          <button
            className="cta-button primary"
            onClick={() => scrollToSection('about')}
            aria-label="Scroll to About Section"
          >
            Learn More
          </button>
          <button
            className="cta-button secondary"
            onClick={() => scrollToSection('contact')}
            aria-label="Scroll to Contact Section"
          >
            Get In Touch
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
