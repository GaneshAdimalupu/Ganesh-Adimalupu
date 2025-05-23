// FILE: src/pages/home/index.js

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';
import { introdata, meta, dataportfolio, skills } from '../../content_option';
import HeroSection from '../../components/hero-section/HeroSection';
import AiExperienceSection from '../../components/ai-experience/AiExperienceSection';
import ProjectsShowcase from '../../components/projectsshowcase';
import ProjectAnalytics from '../../components/analytics/ProjectAnalytics';
import BlogSection from '../../components/blog-section/BlogSection';
import SkillsBar from '../../components/skillsbar';
import TechStackSection from './TechStackSection';
import './style.css';

// Custom hooks for optimization
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
      rootMargin: '100px',
      ...options
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isIntersecting];
};

const usePerformanceMode = () => {
  const [performanceMode, setPerformanceMode] = useState('normal');

  useEffect(() => {
    const detectPerformance = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 2;
      const hasSlowConnection = navigator.connection &&
        ['slow-2g', '2g', '3g'].includes(navigator.connection.effectiveType);
      const hasLowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;

      if (isMobile || hasLowMemory || hasSlowConnection || hasLowCores) {
        setPerformanceMode('low');
      } else if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
        setPerformanceMode('medium');
      } else {
        setPerformanceMode('high');
      }
    };

    detectPerformance();
  }, []);

  return performanceMode;
};

// Optimized Section Component
const AnimatedSection = React.memo(({
  children,
  className = "",
  delay = 0,
  isMobile,
  performanceMode
}) => {
  const [sectionRef, isVisible] = useIntersectionObserver();

  const sectionVariants = useMemo(() => {
    if (performanceMode === 'low') {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } }
      };
    }

    return {
      hidden: {
        opacity: 0,
        y: isMobile ? 20 : 40
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: isMobile ? 0.5 : 0.8,
          delay,
          ease: "easeOut"
        }
      }
    };
  }, [delay, isMobile, performanceMode]);

  return (
    <motion.section
      ref={sectionRef}
      className={className}
      variants={sectionVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {children}
    </motion.section>
  );
});

// Quick Stats Component
const QuickStats = React.memo(({ isMobile }) => {
  const [statsRef, isVisible] = useIntersectionObserver();
  const [counts, setCounts] = useState({
    projects: 0,
    experience: 0,
    technologies: 0,
    clients: 0
  });

  const targetCounts = useMemo(() => ({
    projects: 15,
    experience: 3,
    technologies: 25,
    clients: 8
  }), []);

  useEffect(() => {
    if (!isVisible) return;

    const animateCounters = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      Object.keys(targetCounts).forEach((key) => {
        const target = targetCounts[key];
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCounts(prev => ({ ...prev, [key]: target }));
            clearInterval(timer);
          } else {
            setCounts(prev => ({ ...prev, [key]: Math.floor(current) }));
          }
        }, stepDuration);
      });
    };

    const timeout = setTimeout(animateCounters, 300);
    return () => clearTimeout(timeout);
  }, [isVisible, targetCounts]);

  const statsData = useMemo(() => [
    { label: 'Projects Completed', value: counts.projects, suffix: '+' },
    { label: 'Years Experience', value: counts.experience, suffix: '+' },
    { label: 'Technologies', value: counts.technologies, suffix: '+' },
    { label: 'Happy Clients', value: counts.clients, suffix: '+' }
  ], [counts]);

  return (
    <motion.div
      ref={statsRef}
      className="quick-stats"
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
    >
      <Container>
        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="stat-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={!isMobile ? { scale: 1.05 } : undefined}
            >
              <div className="stat-number">
                {stat.value}{stat.suffix}
              </div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.div>
  );
});

// CTA Section Component
const CTASection = React.memo(({ isMobile }) => {
  const [ctaRef, isVisible] = useIntersectionObserver();

  return (
    <motion.section
      ref={ctaRef}
      className="cta-section"
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Container>
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Row className="align-items-center">
            <Col lg="8">
              <div className="cta-text">
                <h2>Ready to Build Something Amazing?</h2>
                <p>
                  Let's collaborate on your next AI/ML project. From concept to deployment,
                  I'll help you create intelligent solutions that drive real results.
                </p>
              </div>
            </Col>
            <Col lg="4" className="text-lg-end">
              <div className="cta-actions">
                <motion.a
                  href="/contact"
                  className="cta-btn primary"
                  whileHover={!isMobile ? { scale: 1.05, y: -2 } : undefined}
                  whileTap={{ scale: 0.95 }}
                >
                  Start a Project
                </motion.a>
                <motion.a
                  href="/portfolio"
                  className="cta-btn secondary"
                  whileHover={!isMobile ? { scale: 1.05, y: -2 } : undefined}
                  whileTap={{ scale: 0.95 }}
                >
                  View Work
                </motion.a>
              </div>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </motion.section>
  );
});

// Testimonials/Reviews placeholder component
const TestimonialsSection = React.memo(({ isMobile }) => {
  const testimonials = useMemo(() => [
    {
      name: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      content: "Ganesh delivered an exceptional machine learning solution that improved our prediction accuracy by 40%. His expertise in AI is remarkable.",
      rating: 5,
      avatar: "https://via.placeholder.com/60x60?text=SJ"
    },
    {
      name: "Michael Chen",
      role: "CTO at DataFlow",
      content: "Working with Ganesh was a game-changer for our data analytics platform. His deep learning models revolutionized our insights.",
      rating: 5,
      avatar: "https://via.placeholder.com/60x60?text=MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Research Director",
      content: "Ganesh's NLP solutions helped us process thousands of documents automatically. The accuracy and efficiency gains were incredible.",
      rating: 5,
      avatar: "https://via.placeholder.com/60x60?text=ER"
    }
  ], []);

  const [testimonialsRef, isVisible] = useIntersectionObserver();

  return (
    <motion.section
      ref={testimonialsRef}
      className="testimonials-section"
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
    >
      <Container>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2>What Clients Say</h2>
          <p>Trusted by professionals worldwide for AI/ML solutions</p>
          <div className="section-underline"></div>
        </motion.div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={!isMobile ? { y: -5 } : undefined}
            >
              <div className="testimonial-content">
                <div className="stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
                <p>"{testimonial.content}"</p>
              </div>
              <div className="testimonial-author">
                <img src={testimonial.avatar} alt={testimonial.name} />
                <div className="author-info">
                  <h5>{testimonial.name}</h5>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.section>
  );
});

// Blog posts data
const blogPosts = [
  {
    title: "Understanding Neural Networks: A Beginner's Guide",
    excerpt: "Neural networks are the foundation of deep learning. Let's explore how they work and why they're so powerful for AI applications.",
    category: "Deep Learning",
    date: "Dec 15, 2024",
    image: "https://via.placeholder.com/600x400?text=Neural+Networks",
    link: "/blog/understanding-neural-networks",
    readTime: "5 min read"
  },
  {
    title: "5 Python Libraries Every Data Scientist Should Know",
    excerpt: "Python has become the dominant language for data science. Here are the essential libraries that will boost your productivity.",
    category: "Data Science",
    date: "Dec 10, 2024",
    image: "https://via.placeholder.com/600x400?text=Python+Libraries",
    link: "/blog/python-libraries-data-science",
    readTime: "7 min read"
  },
  {
    title: "Building a Recommendation System with TensorFlow",
    excerpt: "Learn how to create a personalized recommendation system using collaborative filtering techniques with TensorFlow.",
    category: "Machine Learning",
    date: "Dec 5, 2024",
    image: "https://via.placeholder.com/600x400?text=Recommendation+System",
    link: "/blog/recommendation-system-tensorflow",
    readTime: "10 min read"
  }
];

// Main Home Component
export const Home = () => {
  const { isMobile, screenSize } = useMobile();
  const performanceMode = usePerformanceMode();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Only show featured projects on home page
  const featuredProjects = useMemo(() => {
    return dataportfolio.slice(0, isMobile ? 2 : 3);
  }, [dataportfolio, isMobile]);

  // Performance optimization for animations
  const containerVariants = useMemo(() => {
    if (performanceMode === 'low') {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      };
    }

    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.3,
          delayChildren: 0.2
        }
      }
    };
  }, [performanceMode]);

  return (
    <HelmetProvider>
      <motion.div
        className="home-page"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />

          {/* OpenGraph tags for better social sharing */}
          <meta property="og:title" content={meta.title} />
          <meta property="og:description" content={meta.description} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://ganeshadimalupu.github.io/Ganesh-Adimalupu/" />
          <meta property="og:image" content="https://ganeshadimalupu.github.io/Ganesh-Adimalupu/preview.png" />

          {/* Twitter card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={meta.title} />
          <meta name="twitter:description" content={meta.description} />
          <meta name="twitter:image" content="https://ganeshadimalupu.github.io/Ganesh-Adimalupu/preview.png" />

          {/* Keywords */}
          <meta name="keywords" content="Ganesh Adimalupu, Machine Learning Engineer, AI Specialist, Python Developer, Deep Learning, NLP, Data Science, Artificial Intelligence, Portfolio, TensorFlow, Keras, Neural Networks, Data Engineering" />

          {/* Canonical URL */}
          <link rel="canonical" href="https://ganeshadimalupu.github.io/Ganesh-Adimalupu/" />
        </Helmet>

        {/* Hero Section */}
        <HeroSection />

        {/* Quick Stats */}
        <QuickStats isMobile={isMobile} />

        {/* Project Analytics */}
        <AnimatedSection
          className="analytics-section"
          delay={0.1}
          isMobile={isMobile}
          performanceMode={performanceMode}
        >
          <Container>
            <ProjectAnalytics />
          </Container>
        </AnimatedSection>

        {/* AI Experience Section */}
        <AnimatedSection
          delay={0.2}
          isMobile={isMobile}
          performanceMode={performanceMode}
        >
          <AiExperienceSection />
        </AnimatedSection>

        {/* Tech Stack Section */}
        <AnimatedSection
          delay={0.3}
          isMobile={isMobile}
          performanceMode={performanceMode}
        >
          <TechStackSection isMobile={isMobile} />
        </AnimatedSection>

        {/* Skills Section */}
        <AnimatedSection
          className="skills-section"
          delay={0.4}
          isMobile={isMobile}
          performanceMode={performanceMode}
        >
          <Container>
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>Technical Skills</h2>
              <p>Technologies and tools I work with to create intelligent solutions</p>
              <div className="section-underline"></div>
            </motion.div>

            <SkillsBar skills={skills} />
          </Container>
        </AnimatedSection>

        {/* Featured Projects Section */}
        <AnimatedSection
          className="projects-section"
          delay={0.5}
          isMobile={isMobile}
          performanceMode={performanceMode}
        >
          <Container>
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>Featured Projects</h2>
              <p>Showcasing some of my recent work in AI and development</p>
              <div className="section-underline"></div>
            </motion.div>

            <ProjectsShowcase projects={featuredProjects} />

            <div className="view-more-container">
              <motion.a
                href="/portfolio"
                className="view-more-btn"
                whileHover={!isMobile ? {
                  y: -5,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                } : undefined}
                whileTap={{ scale: 0.95 }}
              >
                View All Projects
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 17L17 7M17 7H7M17 7V17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.a>
            </div>
          </Container>
        </AnimatedSection>

        {/* Testimonials Section */}
        <AnimatedSection
          delay={0.6}
          isMobile={isMobile}
          performanceMode={performanceMode}
        >
          <TestimonialsSection isMobile={isMobile} />
        </AnimatedSection>

        {/* Blog Section */}
        <AnimatedSection
          delay={0.7}
          isMobile={isMobile}
          performanceMode={performanceMode}
        >
          <BlogSection posts={blogPosts} />
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection
          delay={0.8}
          isMobile={isMobile}
          performanceMode={performanceMode}
        >
          <CTASection isMobile={isMobile} />
        </AnimatedSection>
      </motion.div>
    </HelmetProvider>
  );
};
