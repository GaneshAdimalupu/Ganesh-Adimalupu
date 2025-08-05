// components/hero/hero.js - Beautiful Desktop & Mobile Hero
import React, { useState, useEffect } from 'react';
import './hero.css';
import profileImage from '../../assets/images/profile.webp';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Component loaded animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Mouse tracking for desktop parallax effect
    const handleMouseMove = (e) => {
      if (window.innerWidth > 768) {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: (e.clientY / window.innerHeight) * 2 - 1
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleImageError = (e) => {
    // Fallback for broken image
    e.target.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
    e.target.style.display = 'flex';
    e.target.style.alignItems = 'center';
    e.target.style.justifyContent = 'center';
    e.target.innerHTML = '👨‍💻';
    e.target.style.fontSize = '4rem';
  };

  // Typing effect for role
  const [roleText, setRoleText] = useState('');
  const fullRoleText = 'Machine Learning Engineer';

  useEffect(() => {
    if (isLoaded) {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= fullRoleText.length) {
          setRoleText(fullRoleText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 100);

      return () => clearInterval(typingInterval);
    }
  }, [isLoaded]);

  // Dynamic parallax transform for desktop
  const parallaxTransform = {
    transform: window.innerWidth > 768
      ? `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
      : 'none'
  };

  return (
    <section id="home" className={`hero ${isLoaded ? 'loaded' : ''}`}>
      <div className="hero-container">
        {/* Left Content */}
        <div className="hero-content">
          <div className="greeting-badge">
            <span className="wave">👋</span>
            <span>Hello, Welcome!</span>
          </div>

          <h1 className="hero-title">
            I'm <span className="name-highlight">Ganesh</span>,<br />
            <span className="role">
              {roleText}
              <span className="cursor" style={{
                opacity: roleText.length < fullRoleText.length ? 1 : 0,
                animation: roleText.length < fullRoleText.length ? 'blink 1s infinite' : 'none'
              }}>|</span>
            </span>
          </h1>

          <p className="hero-description">
            Exceptional AI solutions for your business success.
            Building intelligent systems that solve real-world problems and drive innovation
            through cutting-edge machine learning technologies.
          </p>

          <div className="hero-buttons">
            <button
              className="cta-btn primary"
              onClick={() => scrollToSection('portfolio')}
              aria-label="View my portfolio"
            >
              <span>View Portfolio</span>
              <span className="arrow">↗</span>
            </button>
            <button
              className="cta-btn secondary"
              onClick={() => scrollToSection('contact')}
              aria-label="Contact me"
            >
              <span>Hire Me</span>
            </button>
          </div>
        </div>

        {/* Right Content - Image & Stats */}
        <div className="hero-visual" style={parallaxTransform}>
          <div className="image-container">
            <div className="bg-circle"></div>
            <img
              src={profileImage}
              alt="Ganesh Adimalupu - Machine Learning Engineer"
              className="hero-image"
              onError={handleImageError}
              loading="eager"
            />
          </div>

          <div className="experience-card">
            <div className="stars">
              <span role="img" aria-label="5 star rating">⭐⭐⭐⭐⭐</span>
            </div>
            <div className="experience-text">
              <span className="years">3+</span>
              <span className="label">Years Experience</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional CSS for typing cursor */}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .cursor {
          display: inline-block;
          width: 2px;
          margin-left: 2px;
          color: #00CDFE;
        }

        .hero.loaded .hero-content {
          animation: slideInLeft 1.2s ease-out;
        }

        .hero.loaded .hero-visual {
          animation: slideInRight 1.2s ease-out;
        }

        /* Enhanced mobile interactions */
        @media (max-width: 768px) {
          .hero-image {
            transition: transform 0.3s ease;
          }

          .hero-image:active {
            transform: scale(0.95);
          }

          .cta-btn:active {
            transform: scale(0.95);
          }

          .greeting-badge:active {
            transform: scale(0.95);
          }
        }

        /* Smooth transitions for all interactive elements */
        .hero * {
          transition: transform 0.3s ease, opacity 0.3s ease;
        }

        /* Enhanced focus states for accessibility */
        .cta-btn:focus {
          outline: 2px solid #00CDFE;
          outline-offset: 2px;
        }

        /* Loading state */
        .hero:not(.loaded) .hero-content,
        .hero:not(.loaded) .hero-visual {
          opacity: 0;
          transform: translateY(30px);
        }
      `}</style>
    </section>
  );
};

export default Hero;
