// FILE: src/components/hero-section/HeroSection.js

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { introdata } from '../../content_option';
import './style.css';
import Typewriter from 'typewriter-effect';

// Import profile image safely
let ProfileImage;
try {
  ProfileImage = require('../../assets/images/profile.svg').default;
} catch (error) {
  console.warn('Profile image not found, using fallback');
  ProfileImage = null;
}

// Custom hook for mobile detection
const useMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const mobile = width <= breakpoint;
      setIsMobile(mobile);

      // Set screen size categories
      if (width <= 576) setScreenSize('mobile-small');
      else if (width <= 768) setScreenSize('mobile');
      else if (width <= 991) setScreenSize('tablet');
      else setScreenSize('desktop');
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return { isMobile, screenSize };
};

// Custom hook for performance detection
const usePerformanceMode = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    const detectPerformance = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 2;
      const hasSlowConnection = navigator.connection &&
        ['slow-2g', '2g', '3g'].includes(navigator.connection.effectiveType);
      const hasLowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;

      setIsLowPerformance(isMobileDevice || hasLowMemory || hasSlowConnection || hasLowCores);
    };

    detectPerformance();
  }, []);

  return isLowPerformance;
};

// Optimized Image Component with multiple fallbacks
const OptimizedProfileImage = React.memo(({ isMobile, isLowPerformance }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  // Set image source with fallbacks
  useEffect(() => {
    const loadImage = async () => {
      try {
        // Try different image paths
        const imagePaths = [
          ProfileImage,
          '/Ganesh-Adimalupu/static/media/profile.svg',
          './assets/images/profile.svg',
          '/assets/images/profile.svg',
          'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="%2300c7ff" opacity="0.2"/><text x="100" y="110" text-anchor="middle" font-size="40" fill="%2300c7ff" font-family="Arial">GA</text></svg>'
        ];

        for (const path of imagePaths) {
          if (path) {
            setImageSrc(path);
            break;
          }
        }
      } catch (error) {
        console.warn('Error loading profile image:', error);
        setImageError(true);
      }
    };

    loadImage();
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    console.warn('Failed to load profile image, using fallback');
    setImageError(true);
    setImageLoaded(true);

    // Set SVG fallback
    setImageSrc('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="%2300c7ff" opacity="0.2"/><text x="100" y="110" text-anchor="middle" font-size="40" fill="%2300c7ff" font-family="Arial">GA</text></svg>');
  }, []);

  // Don't render complex image on very low performance devices
  if (isLowPerformance && isMobile) {
    return (
      <div className="hero-image-placeholder">
        <div className="placeholder-content">GA</div>
      </div>
    );
  }

  return (
    <motion.div
      className="hero-image-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      <div
        className="hero-background-shape"
        style={{
          animation: isMobile || isLowPerformance ? 'none' : 'morphing 8s ease-in-out infinite'
        }}
      />

      <div className="hero-image">
        {!imageLoaded && !imageError && (
          <div className="image-loading-skeleton">
            <div className="skeleton-content"></div>
          </div>
        )}

        {imageSrc && !imageError ? (
          <img
            src={imageSrc}
            alt="Ganesh Adimalupu - Machine Learning Engineer"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
              animation: isMobile || isLowPerformance ? 'none' : 'float 6s ease-in-out infinite'
            }}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="image-fallback">
            <span>GA</span>
          </div>
        )}
      </div>

      {!isMobile && !isLowPerformance && (
        <div className="hero-particles" />
      )}
    </motion.div>
  );
});

// Optimized Typewriter Component
const OptimizedTypewriter = React.memo(({ roles, isMobile }) => {
  const typewriterOptions = useMemo(() => ({
    strings: roles,
    autoStart: true,
    loop: true,
    deleteSpeed: isMobile ? 30 : 20, // Faster on mobile for better UX
    typeSpeed: isMobile ? 60 : 50,
    pauseFor: isMobile ? 1500 : 2000
  }), [roles, isMobile]);

  return (
    <motion.div
      className="hero-roles"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      <Typewriter options={typewriterOptions} />
    </motion.div>
  );
});

// Button Component with optimized animations
const HeroButton = React.memo(({
  to,
  variant = 'primary',
  children,
  isMobile,
  ...props
}) => {
  const buttonVariants = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: isMobile ? {} : { scale: 1.05, y: -3 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  }), [isMobile]);

  return (
    <Link to={to}>
      <motion.button
        className={`btn-${variant}`}
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover="whileHover"
        whileTap="whileTap"
        {...props}
      >
        {children}
      </motion.button>
    </Link>
  );
});

const HeroSection = () => {
  const { isMobile, screenSize } = useMobile();
  const isLowPerformance = usePerformanceMode();
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const heroElement = document.querySelector('.hero-section');
    if (heroElement) {
      observer.observe(heroElement);
    }

    return () => observer.disconnect();
  }, []);

  // Animation variants optimized for performance
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.2 : 0.3,
        delayChildren: 0.1
      }
    }
  }), [isMobile]);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }), []);

  // Optimized greeting component
  const greetingText = useMemo(() => {
    const greetings = {
      'mobile-small': 'Hi!',
      'mobile': 'Hello!',
      'tablet': 'Hello, I\'m',
      'desktop': 'Hello, I\'m'
    };
    return greetings[screenSize] || 'Hello, I\'m';
  }, [screenSize]);

  // Responsive button layout
  const buttonLayout = useMemo(() => ({
    direction: isMobile ? 'column' : 'row',
    gap: isMobile ? '0.8rem' : '1.2rem'
  }), [isMobile]);

  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <motion.div
              className="hero-content"
              variants={containerVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
            >
              <motion.span
                className="hero-greeting"
                variants={itemVariants}
              >
                {greetingText}
              </motion.span>

              <motion.h1
                className="hero-name"
                variants={itemVariants}
              >
                {introdata.title}
              </motion.h1>

              <OptimizedTypewriter
                roles={[
                  introdata.animated.first,
                  introdata.animated.second,
                  introdata.animated.third,
                ]}
                isMobile={isMobile}
              />

              <motion.p
                className="hero-description"
                variants={itemVariants}
              >
                {introdata.description}
              </motion.p>

              <motion.div
                className="hero-buttons"
                variants={itemVariants}
                style={{
                  flexDirection: buttonLayout.direction,
                  gap: buttonLayout.gap
                }}
              >
                <HeroButton
                  to="/portfolio"
                  variant="primary"
                  isMobile={isMobile}
                >
                  View Portfolio
                </HeroButton>

                <HeroButton
                  to="/contact"
                  variant="outline"
                  isMobile={isMobile}
                >
                  Contact Me
                </HeroButton>
              </motion.div>
            </motion.div>
          </div>

          <div className="col-lg-6">
            <AnimatePresence>
              {isVisible && (
                <OptimizedProfileImage
                  isMobile={isMobile}
                  isLowPerformance={isLowPerformance}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Performance-aware decorative elements */}
      {!isMobile && !isLowPerformance && (
        <>
          <motion.div
            className="floating-element floating-element-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1, duration: 1 }}
          />
          <motion.div
            className="floating-element floating-element-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.5, duration: 1 }}
          />
        </>
      )}
    </section>
  );
};

// Add error boundary for better resilience
class HeroErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Hero section error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="hero-section">
          <div className="container">
            <div className="hero-fallback">
              <h1>Ganesh Adimalupu</h1>
              <p>Machine Learning Engineer & AI Specialist</p>
              <div className="hero-buttons">
                <Link to="/portfolio" className="btn-primary">View Portfolio</Link>
                <Link to="/contact" className="btn-outline">Contact Me</Link>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return <HeroSection />;
  }
}

export default HeroErrorBoundary;
