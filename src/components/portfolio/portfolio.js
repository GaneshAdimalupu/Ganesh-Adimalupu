import React, { useState, useEffect } from 'react';
import './portfolio.css';

// Import your images
import bestPaperCert from '../../assets/images/best pap cer.jpg';
import portfolioImage from '../../assets/images/portfolio.png';
import digit from '../../assets/images/digit.png';
import snehaDeepaImage from '../../assets/images/sneha deepa.png';
import faceRecognitionImage from '../../assets/images/face recog.jpeg';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      observer.observe(portfolioSection);
    }

    return () => {
      if (portfolioSection) {
        observer.unobserve(portfolioSection);
      }
    };
  }, []);

  const projects = [
    {
      id: 1,
      title: 'Be My Chef - Smart Food Recommendation System',
      description: 'Award-winning intelligent food recommendation system using advanced machine learning algorithms. Successfully presented at IEEE conference and received the prestigious Best Paper Award for innovation in AI-driven solutions.',
      image: bestPaperCert,
      category: 'ai-ml',
      technologies: ['Machine Learning', 'Python', 'Recommendation Systems', 'IEEE', 'Data Science'],
      githubRepo: 'https://github.com/GaneshAdimalupu/be-my-chef',
      featured: true,
      priority: 1
    },
    {
      id: 2,
      title: 'CNN for Handwritten Digit Recognition',
      description: 'Deep learning model built with TensorFlow and Keras to accurately classify handwritten digits from the MNIST dataset. Demonstrates foundational skills in building and training convolutional neural networks.',
      image: digit,
      category: 'ai-ml',
      technologies: ['Python', 'TensorFlow', 'Keras', 'Deep Learning', 'CNN', 'MNIST'],
      githubRepo: 'https://github.com/GaneshAdimalupu/CNN-Tensorflow',
      featured: true,
      priority: 2
    },
    {
      id: 3,
      title: 'Sneha Deepa Hospital Management System',
      description: 'Comprehensive hospital management web application featuring patient registration, appointment scheduling, doctor management, and secure digital record keeping with modern UI/UX design.',
      image: snehaDeepaImage,
      category: 'web-dev',
      technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Authentication'],
      githubRepo: 'https://github.com/GaneshAdimalupu/sneha-deepa-hospital',
      featured: true,
      priority: 3
    },
    {
      id: 4,
      title: 'Modern React Portfolio Website',
      description: 'Personal portfolio website built with React.js showcasing projects and skills. Features clean modern UI, dark theme, responsive design, and interactive components for optimal user experience.',
      image: portfolioImage,
      category: 'web-dev',
      technologies: ['React.js', 'CSS3', 'JavaScript', 'Responsive Design', 'UI/UX'],
      liveDemo: window.location.href,
      githubRepo: 'https://github.com/GaneshAdimalupu/portfolio',
      featured: false,
      priority: 4
    },
    {
      id: 5,
      title: 'Face Recognition Evaluation Platform',
      description: 'Robust evaluation platform for benchmarking face recognition models. Provides comprehensive tools for dataset management, performance visualization, and detailed model comparison analytics.',
      image: faceRecognitionImage,
      category: 'ai-ml',
      technologies: ['Python', 'OpenCV', 'scikit-learn', 'NumPy', 'Computer Vision'],
      githubRepo: 'https://github.com/GaneshAdimalupu/face-recognition-evaluation',
      featured: false,
      priority: 5
    },
  ];

  const categories = [
    { key: 'all', label: 'All Projects', icon: '🎯', count: projects.length },
    { key: 'ai-ml', label: 'AI/ML', icon: '🤖', count: projects.filter(p => p.category === 'ai-ml').length },
    { key: 'web-dev', label: 'Web Development', icon: '💻', count: projects.filter(p => p.category === 'web-dev').length }
  ];

  const filteredProjects = activeFilter === 'all'
    ? projects.sort((a, b) => a.priority - b.priority)
    : projects.filter(project => project.category === activeFilter).sort((a, b) => a.priority - b.priority);

  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);

    // Scroll to portfolio grid on mobile after filter change
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (portfolioGrid) {
          portfolioGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const truncateDescription = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
  };

  return (
    <section id="portfolio" className={`section ${isVisible ? 'visible' : ''}`}>
      <div className="container">
        <h2>My Portfolio</h2>
        <p className="section-text">
          A curated showcase of my recent projects in AI/ML and web development,
          demonstrating technical expertise and innovative problem-solving.
        </p>

        <div className="filter-container">
          {categories.map(category => (
            <button
              key={category.key}
              className={`filter-btn ${activeFilter === category.key ? 'active' : ''}`}
              onClick={() => handleFilterChange(category.key)}
              aria-label={`Filter by ${category.label}`}
            >
              <span className="filter-icon">{category.icon}</span>
              <span>{category.label}</span>
              <span className="filter-count">({category.count})</span>
            </button>
          ))}
        </div>

        <div className="portfolio-grid">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`portfolio-card ${project.featured ? 'featured' : ''}`}
              style={{
                animationDelay: `${index * 0.1}s`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.6s ease ${index * 0.1}s`
              }}
            >
              <div className="portfolio-image">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
                    e.target.style.display = 'flex';
                    e.target.style.alignItems = 'center';
                    e.target.style.justifyContent = 'center';
                    e.target.innerHTML = '🖼️';
                  }}
                />
              </div>

              <div className="portfolio-info">
                <h3>{project.title}</h3>
                <p className="project-description">
                  {window.innerWidth <= 768
                    ? truncateDescription(project.description, 120)
                    : project.description
                  }
                </p>

                <div className="tech-stack">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="tech-tag"
                      title={tech}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="project-links">
                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      className="btn primary"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View live demo of ${project.title}`}
                    >
                      🚀 Live Demo
                    </a>
                  )}
                  {project.githubRepo && (
                    <a
                      href={project.githubRepo}
                      className="btn secondary"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View source code of ${project.title}`}
                    >
                      📂 View Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Count Display */}
        <div className="portfolio-summary">
          <p className="project-count">
            Showing {filteredProjects.length} of {projects.length} projects
            {activeFilter !== 'all' && (
              <span className="filter-active">
                {' '}in {categories.find(cat => cat.key === activeFilter)?.label}
              </span>
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
