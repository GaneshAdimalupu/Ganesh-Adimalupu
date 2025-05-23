// FILE: src/pages/about/index.js

import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import {
  dataabout,
  meta,
  worktimeline,
  skills,
  services,
  education,
  certifications
} from "../../content_option";
import SkillsBar from "../../components/skillsbar";
import Timeline from "../../components/timeline/Timeline";

// Custom hooks for mobile optimization
const useMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width <= breakpoint);

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

const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isIntersecting];
};

// Optimized Section Component
const AnimatedSection = React.memo(({
  children,
  className = "",
  delay = 0,
  isMobile
}) => {
  const [sectionRef, isVisible] = useIntersectionObserver();

  const sectionVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      y: isMobile ? 15 : 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.4 : 0.6,
        delay,
        ease: "easeOut"
      }
    }
  }), [delay, isMobile]);

  return (
    <motion.div
      ref={sectionRef}
      className={className}
      variants={sectionVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
});

// Interactive Stats Component
const StatsCounter = React.memo(({ value, label, duration = 2000, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [statsRef] = useIntersectionObserver();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true);
      }
    });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [statsRef, isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      const increment = value / (duration / 50);
      let current = 0;

      const counter = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(counter);
        } else {
          setCount(Math.floor(current));
        }
      }, 50);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, value, duration, delay]);

  return (
    <motion.div
      ref={statsRef}
      className="stats-item"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
    >
      <div className="stats-number">{count}+</div>
      <div className="stats-label">{label}</div>
    </motion.div>
  );
});

// Enhanced Certification Card
const CertificationCard = React.memo(({ certification, index, isMobile }) => {
  const [cardRef, isVisible] = useIntersectionObserver();

  const cardVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: isMobile ? 0.3 : 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  }), [index, isMobile]);

  return (
    <motion.div
      ref={cardRef}
      className="certification-card"
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover={!isMobile ? {
        y: -5,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)"
      } : undefined}
      whileTap={{ scale: 0.98 }}
    >
      <div className="certification-icon">
        <span>{certification.title.charAt(0)}</span>
      </div>
      <div className="certification-content">
        <h5 className="certification-title">{certification.title}</h5>
        <p className="certification-issuer">{certification.issuer}</p>
        <span className="certification-date">{certification.date}</span>
      </div>
      {certification.link && (
        <motion.a
          href={certification.link}
          target="_blank"
          rel="noopener noreferrer"
          className="certification-link"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.a>
      )}
    </motion.div>
  );
});

// Enhanced Service Card
const ServiceCard = React.memo(({ service, index, isMobile }) => {
  const [cardRef, isVisible] = useIntersectionObserver();

  const cardVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      x: index % 2 === 0 ? -30 : 30
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: isMobile ? 0.4 : 0.6,
        delay: index * 0.2,
        ease: "easeOut"
      }
    }
  }), [index, isMobile]);

  return (
    <motion.div
      ref={cardRef}
      className="service-card"
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover={!isMobile ? {
        x: 10,
        transition: { duration: 0.3 }
      } : undefined}
    >
      <div className="service-number">{String(index + 1).padStart(2, '0')}</div>
      <div className="service-content">
        <h5 className="service-title">{service.title}</h5>
        <p className="service-description">{service.description}</p>
      </div>
    </motion.div>
  );
});

// Tab Navigation Component
const TabNavigation = React.memo(({ activeTab, onTabChange, isMobile }) => {
  const tabs = [
    { id: 'overview', label: isMobile ? 'Overview' : 'About Me' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'services', label: 'Services' },
    { id: 'certifications', label: isMobile ? 'Certs' : 'Certifications' }
  ];

  return (
    <motion.div
      className="tab-navigation"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="tab-list">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            whileHover={!isMobile ? { scale: 1.05 } : undefined}
            whileTap={{ scale: 0.95 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>
      <motion.div
        className="tab-indicator"
        layoutId="activeTab"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </motion.div>
  );
});

// Main About Component
export const About = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { isMobile, screenSize } = useMobile();

  // Performance optimization
  const [renderOptimization, setRenderOptimization] = useState({
    animationsEnabled: true,
    reducedMotion: false
  });

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLowPerformance = navigator.hardwareConcurrency <= 2 ||
                           (navigator.deviceMemory && navigator.deviceMemory <= 2);

    setRenderOptimization({
      animationsEnabled: !prefersReducedMotion && !isLowPerformance,
      reducedMotion: prefersReducedMotion
    });
  }, []);

  // Memoized animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: renderOptimization.animationsEnabled ? 0.1 : 0,
        delayChildren: 0.2
      }
    }
  }), [renderOptimization.animationsEnabled]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Stats data
  const stats = useMemo(() => [
    { value: 15, label: "Projects Completed" },
    { value: 3, label: "Years Experience" },
    { value: 8, label: "Certifications" },
    { value: 50, label: "Technologies" }
  ], []);

  // Render tab content
  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case 'overview':
        return (
          <AnimatedSection className="overview-section" isMobile={isMobile}>
            <Row className="mb-5">
              <Col lg="6">
                <motion.div
                  className="about-text"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="section-subtitle">{dataabout.title}</h3>
                  <p className="about-description">{dataabout.aboutme}</p>
                </motion.div>
              </Col>
              <Col lg="6">
                <motion.div
                  className="stats-grid"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {stats.map((stat, index) => (
                    <StatsCounter
                      key={stat.label}
                      value={stat.value}
                      label={stat.label}
                      delay={index * 200}
                    />
                  ))}
                </motion.div>
              </Col>
            </Row>
          </AnimatedSection>
        );

      case 'experience':
        return (
          <AnimatedSection className="experience-section" delay={0.1} isMobile={isMobile}>
            <h3 className="section-subtitle">Professional Experience</h3>
            <Timeline data={worktimeline} />
          </AnimatedSection>
        );

      case 'education':
        return (
          <AnimatedSection className="education-section" delay={0.1} isMobile={isMobile}>
            <h3 className="section-subtitle">Educational Background</h3>
            <div className="education-timeline">
              {education?.map((edu, index) => (
                <motion.div
                  key={index}
                  className="education-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="education-content">
                    <h4 className="education-degree">{edu.degree}</h4>
                    <p className="education-institution">{edu.institution}</p>
                    <p className="education-location">{edu.location}</p>
                    <span className="education-period">{edu.period}</span>
                    {edu.description && (
                      <p className="education-description">{edu.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        );

      case 'skills':
        return (
          <AnimatedSection className="skills-section" delay={0.1} isMobile={isMobile}>
            <h3 className="section-subtitle">Technical Skills & Expertise</h3>
            <SkillsBar skills={skills} />
          </AnimatedSection>
        );

      case 'services':
        return (
          <AnimatedSection className="services-section" delay={0.1} isMobile={isMobile}>
            <h3 className="section-subtitle">What I Offer</h3>
            <div className="services-grid">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  service={service}
                  index={index}
                  isMobile={isMobile}
                />
              ))}
            </div>
          </AnimatedSection>
        );

      case 'certifications':
        return (
          <AnimatedSection className="certifications-section" delay={0.1} isMobile={isMobile}>
            <h3 className="section-subtitle">Certifications & Achievements</h3>
            <div className="certifications-grid">
              {certifications?.map((cert, index) => (
                <CertificationCard
                  key={index}
                  certification={cert}
                  index={index}
                  isMobile={isMobile}
                />
              ))}
            </div>
          </AnimatedSection>
        );

      default:
        return null;
    }
  }, [activeTab, isMobile, stats]);

  return (
    <HelmetProvider>
      <Container className="about-page">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} - About</title>
          <meta name="description" content={`Learn more about ${meta.title} - ${dataabout.aboutme.substring(0, 150)}...`} />

          {/* OpenGraph tags */}
          <meta property="og:title" content={`${meta.title} - About`} />
          <meta property="og:description" content={`Learn more about ${meta.title} - AI/ML Specialist with expertise in Python, Deep Learning, and Data Engineering.`} />
          <meta property="og:type" content="profile" />
          <meta property="og:url" content="https://ganeshadimalupu.github.io/Ganesh-Adimalupu/about" />

          {/* Keywords */}
          <meta name="keywords" content="Ganesh Adimalupu, About, Machine Learning Engineer, AI Specialist, Experience, Education, Skills, Certifications" />
        </Helmet>

        {/* Page Header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">About Me</h1>
          <p className="page-subtitle">
            Passionate AI/ML Engineer crafting intelligent solutions for tomorrow's challenges
          </p>
          <motion.div
            className="header-divider"
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isMobile={isMobile}
        />

        {/* Tab Content */}
        <motion.div
          className="tab-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: renderOptimization.animationsEnabled ? 0.4 : 0.1,
                ease: "easeInOut"
              }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Call to Action */}
        <AnimatedSection className="cta-section" delay={0.3} isMobile={isMobile}>
          <motion.div
            className="cta-card"
            whileHover={!isMobile ? {
              y: -5,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
            } : undefined}
          >
            <h3>Let's Work Together</h3>
            <p>
              Ready to bring your AI/ML ideas to life? Let's discuss how we can
              collaborate to create innovative solutions.
            </p>
            <motion.a
              href="/contact"
              className="cta-button"
              whileHover={!isMobile ? { scale: 1.05 } : undefined}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </AnimatedSection>
      </Container>
    </HelmetProvider>
  );
};
