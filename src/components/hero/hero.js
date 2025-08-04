// components/hero/hero.js - ENHANCED VERSION
import React, { useState, useEffect } from 'react';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { motion, useAnimation } from 'framer-motion';
import './hero.css';
import profileImage from '../../assets/images/profile.webp';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();

  // Enhanced typewriter with more dynamic content
  const [text] = useTypewriter({
    words: [
      'Machine Learning Engineer 🧠',
      'AI Solutions Developer 🤖',
      'Full Stack Developer 💻',
      'Open Source Contributor 🌐',
      'Problem Solver 🔧',
      'Innovation Enthusiast 🚀'
    ],
    loop: true,
    delaySpeed: 1800,
    deleteSpeed: 50,
    typeSpeed: 80,
  });

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start('visible');
        }
      },
      { threshold: 0.1 }
    );

    const heroElement = document.getElementById('home');
    if (heroElement) {
      observer.observe(heroElement);
    }

    return () => {
      if (heroElement) {
        observer.unobserve(heroElement);
      }
    };
  }, [controls]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleScrollDown = () => {
    scrollToSection('about');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const profileVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.6, -0.05, 0.01, 0.99],
        delay: 0.2
      }
    }
  };

  const buttonVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <section id="home" className="hero">
      {/* Enhanced Parallax Background */}
      <motion.div
        className="parallax-bg"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      />

      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Enhanced Profile Photo with Animation */}
        <motion.div variants={profileVariants}>
          <motion.img
            src={profileImage}
            alt="Adimalupu Ganesh - Machine Learning Engineer"
            className="profile-photo"
            whileHover={{
              scale: 1.08,
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.6 }
            }}
            whileTap={{ scale: 0.95 }}
            loading="eager"
          />
        </motion.div>

        {/* Enhanced Title with Staggered Animation */}
        <motion.h1 variants={itemVariants}>
          Hello, I'm{' '}
          <motion.span
            className="highlight"
            whileHover={{
              scale: 1.05,
              textShadow: "0 0 20px rgba(0, 205, 254, 0.8)"
            }}
          >
            Adimalupu Ganesh
          </motion.span>
        </motion.h1>

        {/* Enhanced Typing Text with Better Animation */}
        <motion.div
          className="typing-text"
          variants={itemVariants}
        >
          <span>{text}</span>
          <Cursor
            cursorColor="#00CDFE"
            cursorStyle="|"
            cursorBlinking={true}
          />
        </motion.div>

        {/* Enhanced Buttons with Individual Animations */}
        <motion.div
          className="hero-buttons"
          variants={itemVariants}
        >
          <motion.button
            className="cta-button primary"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => scrollToSection('about')}
            aria-label="Learn more about Adimalupu Ganesh"
          >
            <span>Learn More</span>
          </motion.button>

          <motion.button
            className="cta-button secondary"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => scrollToSection('contact')}
            aria-label="Get in touch with Adimalupu Ganesh"
          >
            <span>Get In Touch</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        whileHover={{ opacity: 1, scale: 1.1 }}
        onClick={handleScrollDown}
        role="button"
        tabIndex={0}
        aria-label="Scroll to next section"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleScrollDown();
          }
        }}
      >
        <motion.span
          className="scroll-text"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll Down
        </motion.span>
        <div className="scroll-arrow" />
      </motion.div>

      {/* Additional Interactive Elements */}
      <motion.div
        className="floating-elements"
        style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          zIndex: 1,
        }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div style={{
          fontSize: '2rem',
          opacity: 0.3,
          filter: 'blur(1px)'
        }}>
          ⚡
        </div>
      </motion.div>

      <motion.div
        className="floating-elements"
        style={{
          position: 'absolute',
          top: '60%',
          left: '5%',
          zIndex: 1,
        }}
        animate={{
          y: [0, 15, 0],
          rotate: [0, -3, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <div style={{
          fontSize: '1.5rem',
          opacity: 0.2,
          filter: 'blur(1px)'
        }}>
          🚀
        </div>
      </motion.div>

      <motion.div
        className="floating-elements"
        style={{
          position: 'absolute',
          top: '30%',
          left: '15%',
          zIndex: 1,
        }}
        animate={{
          y: [0, -10, 0],
          x: [0, 5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <div style={{
          fontSize: '1.2rem',
          opacity: 0.25,
          filter: 'blur(1px)'
        }}>
          💡
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
