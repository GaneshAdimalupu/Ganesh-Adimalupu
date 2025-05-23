// FILE: src/pages/home/TechStackSection.js

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';

// Tech stack data with categories
const techStackData = {
  'Programming Languages': [
    {
      name: 'Python',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      level: 95,
      description: 'Primary language for ML/AI development'
    },
    {
      name: 'JavaScript',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      level: 85,
      description: 'Frontend development and web applications'
    },
    {
      name: 'Java',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      level: 75,
      description: 'Enterprise applications and Android development'
    },
    {
      name: 'SQL',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
      level: 80,
      description: 'Database design and optimization'
    }
  ],
  'AI/ML Frameworks': [
    {
      name: 'TensorFlow',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
      level: 90,
      description: 'Deep learning and neural networks'
    },
    {
      name: 'PyTorch',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg',
      level: 85,
      description: 'Research and dynamic neural networks'
    },
    {
      name: 'Scikit-learn',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg',
      level: 90,
      description: 'Classical machine learning algorithms'
    },
    {
      name: 'Keras',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Keras_logo.svg',
      level: 88,
      description: 'High-level neural networks API'
    }
  ],
  'Data Science': [
    {
      name: 'Pandas',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg',
      level: 92,
      description: 'Data manipulation and analysis'
    },
    {
      name: 'NumPy',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg',
      level: 90,
      description: 'Numerical computing and arrays'
    },
    {
      name: 'Matplotlib',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Matplotlib_icon.svg',
      level: 85,
      description: 'Data visualization and plotting'
    },
    {
      name: 'Jupyter',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg',
      level: 88,
      description: 'Interactive development environment'
    }
  ],
  'Web Technologies': [
    {
      name: 'React',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      level: 82,
      description: 'Frontend library for building UIs'
    },
    {
      name: 'Node.js',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      level: 78,
      description: 'Backend JavaScript runtime'
    },
    {
      name: 'Flask',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg',
      level: 85,
      description: 'Python web framework for APIs'
    },
    {
      name: 'FastAPI',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
      level: 80,
      description: 'Modern Python API framework'
    }
  ],
  'Tools & DevOps': [
    {
      name: 'Git',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      level: 88,
      description: 'Version control and collaboration'
    },
    {
      name: 'Docker',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      level: 75,
      description: 'Containerization and deployment'
    },
    {
      name: 'AWS',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
      level: 70,
      description: 'Cloud computing and services'
    },
    {
      name: 'VS Code',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
      level: 90,
      description: 'Primary development environment'
    }
  ]
};

// Custom hook for intersection observer
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

// Tech Item Component
const TechItem = React.memo(({ tech, index, isMobile, isVisible }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const itemVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: isMobile ? 0.4 : 0.6,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  }), [index, isMobile]);

  return (
    <motion.div
      className="tech-item"
      variants={itemVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover={!isMobile ? {
        y: -5,
        scale: 1.05,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)"
      } : undefined}
      whileTap={{ scale: 0.98 }}
    >
      <div className="tech-icon-wrapper">
        {!imageLoaded && !imageError && (
          <div className="tech-icon-skeleton">
            <div className="skeleton-shimmer"></div>
          </div>
        )}

        {!imageError ? (
          <img
            src={tech.icon}
            alt={tech.name}
            className="tech-icon"
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            style={{
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
        ) : (
          <div className="tech-icon-fallback">
            <span>{tech.name.charAt(0)}</span>
          </div>
        )}
      </div>

      <div className="tech-content">
        <h4 className="tech-name">{tech.name}</h4>
        <p className="tech-description">{tech.description}</p>

        <div className="tech-level">
          <div className="level-bar">
            <motion.div
              className="level-fill"
              initial={{ width: 0 }}
              animate={isVisible ? { width: `${tech.level}%` } : { width: 0 }}
              transition={{
                duration: 1,
                delay: index * 0.1 + 0.5,
                ease: "easeOut"
              }}
            />
          </div>
          <span className="level-percentage">{tech.level}%</span>
        </div>
      </div>
    </motion.div>
  );
});

// Category Tabs Component
const CategoryTabs = React.memo(({ categories, activeCategory, onCategoryChange, isMobile }) => {
  return (
    <div className="category-tabs">
      <div className="tabs-container">
        {categories.map((category) => (
          <motion.button
            key={category}
            className={`tab-button ${activeCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
            whileHover={!isMobile ? { scale: 1.05 } : undefined}
            whileTap={{ scale: 0.95 }}
          >
            {isMobile ? category.split(' ')[0] : category}
          </motion.button>
        ))}
      </div>
    </div>
  );
});

// Main TechStackSection Component
const TechStackSection = ({ isMobile }) => {
  const [activeCategory, setActiveCategory] = useState('Programming Languages');
  const [sectionRef, isVisible] = useIntersectionObserver();

  const categories = useMemo(() => Object.keys(techStackData), []);
  const activeTechs = useMemo(() => techStackData[activeCategory] || [], [activeCategory]);

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  const sectionVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  }), []);

  const headerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }), []);

  const gridVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }), []);

  return (
    <motion.section
      ref={sectionRef}
      className="tech-stack-section"
      variants={sectionVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <Container>
        <motion.div
          className="section-header"
          variants={headerVariants}
        >
          <h2>Technology Stack</h2>
          <p>The tools and technologies I use to build intelligent solutions</p>
          <div className="section-underline"></div>
        </motion.div>

        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          isMobile={isMobile}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="tech-grid"
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {activeTechs.map((tech, index) => (
              <TechItem
                key={tech.name}
                tech={tech}
                index={index}
                isMobile={isMobile}
                isVisible={isVisible}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Summary Stats */}
        <motion.div
          className="tech-summary"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Row>
            <Col md="4" className="text-center">
              <div className="summary-stat">
                <h3>{Object.values(techStackData).flat().length}+</h3>
                <p>Technologies</p>
              </div>
            </Col>
            <Col md="4" className="text-center">
              <div className="summary-stat">
                <h3>{categories.length}</h3>
                <p>Specialization Areas</p>
              </div>
            </Col>
            <Col md="4" className="text-center">
              <div className="summary-stat">
                <h3>3+</h3>
                <p>Years Experience</p>
              </div>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </motion.section>
  );
};

export default React.memo(TechStackSection);
