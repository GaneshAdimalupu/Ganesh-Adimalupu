// components/portfolio/portfolio.js - COMPLETE WITH FIXED MODAL
import React, { useState, useEffect } from 'react';
import './portfolio.css';

// Import your images
import bestPaperCert from '../../assets/images/best pap cer.jpg';
import portfolioImage from '../../assets/images/portfolio.png';
import digit from '../../assets/images/digit.png';
import snehaDeepaImage from '../../assets/images/sneha deepa.png';
import faceRecognitionImage from '../../assets/images/face recog.jpeg';
import profileSVG from '../../assets/images/profile.webp';
import logoSTIST from '../../assets/images/logoSTIST.png';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  // Your projects data
  const projects = [
    {
      id: 1,
      title: 'Be My Chef - Smart Food Recommendation System',
      description: 'An award-winning, intelligent food recommendation system that uses machine learning to suggest personalized recipes. This project was presented at an IEEE conference and received the Best Paper Award.',
      image: bestPaperCert,
      gallery: [bestPaperCert, logoSTIST],
      category: 'ai-ml',
      technologies: ['Machine Learning', 'Python', 'Recommendation Systems', 'IEEE'],
      githubRepo: 'https://github.com/GaneshAdimalupu/be-my-chef',
      featured: true,
      achievements: ['🏆 Best Paper Award (IEEE)', '📄 IEEE Publication', '🎤 Conference Presentation'],
    },
    {
      id: 2,
      title: 'CNN for Handwritten Digit Recognition',
      description: 'A deep learning model built with TensorFlow and Keras to accurately classify handwritten digits from the MNIST dataset, demonstrating foundational skills in building and training CNNs.',
      image: digit,
      gallery: [digit],
      category: 'ai-ml',
      technologies: ['Python', 'TensorFlow', 'Keras', 'Deep Learning', 'CNN'],
      githubRepo: 'https://github.com/GaneshAdimalupu/CNN-Tensorflow',
      featured: true,
      achievements: ['🧠 Deep Learning Implementation', '🔢 High Accuracy Model', '📊 Data Visualization'],
    },
    {
      id: 3,
      title: 'Modern React Portfolio Website',
      description: 'This personal portfolio, built with React.js to showcase my projects and skills. Features a clean UI, dark theme, and interactive components.',
      image: portfolioImage,
      gallery: [portfolioImage, profileSVG],
      category: 'web-dev',
      technologies: ['React.js', 'CSS3', 'JavaScript', 'Responsive Design', 'UI/UX'],
      liveDemo: window.location.href,
      githubRepo: 'https://github.com/GaneshAdimalupu/portfolio',
      featured: false,
      achievements: ['🎨 Modern UI/UX', '📱 Fully Responsive', '⚡ Fast Performance', '🌙 Dark Theme'],
    },
    {
      id: 4,
      title: 'Sneha Deepa Hospital Website',
      description: 'A comprehensive hospital management system web application built with modern web technologies. Features include patient registration, appointment scheduling, doctor management, and digital record keeping.',
      image: snehaDeepaImage,
      category: 'web-dev',
      technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'CSS Modules'],
      githubRepo: 'https://github.com/GaneshAdimalupu/sneha-deepa-hospital',
      featured: true,
      achievements: [
        '🩺 Patient & Doctor Management',
        '📅 Appointment Scheduling',
        '📄 Digital Records',
        '🔒 Secure Authentication'
      ],
    },
    {
      id: 5,
      title: 'Face Recognition Evaluation Platform',
      description: 'A robust evaluation platform for benchmarking face recognition models. Provides tools for dataset management, result visualization, and model comparison to streamline research and development.',
      image: faceRecognitionImage,
      category: 'ai-ml',
      technologies: ['Python', 'OpenCV', 'scikit-learn', 'NumPy', 'Matplotlib'],
      githubRepo: 'https://github.com/GaneshAdimalupu/face-recognition-evaluation',
      featured: false,
      achievements: [
        '📊 Benchmarking Multiple Models',
        '🖼️ Dataset Handling & Preprocessing',
        '🚀 Fast Results Visualization',
        '📈 Performance Metrics & Comparison'
      ],
    },
  ];

  const categories = [
    { key: 'all', label: 'All', icon: '🎯' },
    { key: 'ai-ml', label: 'AI/ML', icon: '🤖' },
    { key: 'web-dev', label: 'Web Dev', icon: '💻' }
  ];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  // FIXED Modal Functions
  const openModal = (project) => {
    setSelectedProject(project);
    // Prevent body scrolling and save current scroll position
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    // Restore body scrolling and scroll position
    const scrollY = document.body.style.top;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.classList.remove('modal-open');
    window.scrollTo(0, parseInt(scrollY || '0') * -1);

    setSelectedProject(null);
  };

  // Enhanced useEffect for keyboard and window management
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedProject) {
        closeModal();
      }
    };

    const handleResize = () => {
      // Modal will automatically reposition due to flexbox centering
      if (selectedProject) {
        // Force a re-render to ensure proper centering
        const modal = document.querySelector('.project-modal');
        if (modal) {
          modal.style.transform = 'none';
          // Trigger reflow
          modal.offsetHeight;
          modal.style.transform = '';
        }
      }
    };

    // Add event listeners when modal is open
    if (selectedProject) {
      document.addEventListener('keydown', handleEscape);
      window.addEventListener('resize', handleResize);

      // Prevent background scrolling on mobile
      document.addEventListener('touchmove', (e) => {
        if (!e.target.closest('.project-modal')) {
          e.preventDefault();
        }
      }, { passive: false });
    }

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('touchmove', () => {});

      // Ensure body scroll is restored if component unmounts with modal open
      if (selectedProject) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.classList.remove('modal-open');
      }
    };
  }, [selectedProject]);

  return (
    <section id="portfolio" className="section">
      <div className="container">
        <h2>My Portfolio</h2>
        <p className="section-text">
          Here are some of my best projects, showcasing my skills in AI, Machine Learning, and Web Development.
        </p>

        <div className="filter-container">
          {categories.map(category => (
            <button
              key={category.key}
              className={`filter-btn ${activeFilter === category.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(category.key)}
            >
              <span className="filter-icon">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        <div className="portfolio-grid">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className={`portfolio-card ${project.featured ? 'featured' : ''}`}
              onClick={() => openModal(project)}
            >
              {project.featured && <div className="featured-badge">🏆 Featured</div>}
              <div className="portfolio-image">
                <img src={project.image} alt={project.title} loading="lazy" />
                <div className="portfolio-overlay">
                  <div className="overlay-content">
                    <h3>{project.title}</h3>
                    <p>{project.description.substring(0, 100)}...</p>
                    <button className="view-btn">View Details</button>
                  </div>
                </div>
              </div>
              <div className="portfolio-info">
                <h3>{project.title}</h3>
                <div className="tech-stack">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="tech-tag more">+{project.technologies.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="no-projects">
            <p>No projects found for this category. More coming soon!</p>
          </div>
        )}
      </div>

      {/* FIXED Modal with Perfect Centering */}
      {selectedProject && (
        <div
          className="modal-overlay"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="project-modal"
            onClick={e => e.stopPropagation()}
            role="document"
          >
            <button
              className="close-modal"
              onClick={closeModal}
              aria-label="Close modal"
              title="Close (Esc)"
            >
              ×
            </button>

            <div className="modal-content">
              <div className="modal-image">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  loading="lazy"
                />
              </div>

              <div className="modal-details">
                <h2 id="modal-title">{selectedProject.title}</h2>
                <p>{selectedProject.description}</p>

                {/* Achievements Section */}
                {selectedProject.achievements && (
                  <div className="achievements-full">
                    <h4>🏆 Key Achievements</h4>
                    <ul className="achievement-list">
                      {selectedProject.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies Section */}
                <div className="tech-stack-full">
                  <h4>🛠️ Technologies Used</h4>
                  <div className="tech-tags">
                    {selectedProject.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>

                {/* Project Actions */}
                <div className="project-actions">
                  {selectedProject.liveDemo && (
                    <a
                      href={selectedProject.liveDemo}
                      className="action-btn primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🚀 Live Demo
                    </a>
                  )}
                  {selectedProject.githubRepo && (
                    <a
                      href={selectedProject.githubRepo}
                      className="action-btn secondary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📂 View Code
                    </a>
                  )}
                </div>

                {/* Image Gallery */}
                {selectedProject.gallery && selectedProject.gallery.length > 1 && (
                  <div className="image-gallery">
                    <h4>📸 Project Gallery</h4>
                    <div className="gallery-grid">
                      {selectedProject.gallery.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedProject.title} screenshot ${index + 1}`}
                          className="gallery-image"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Project Info */}
                <div className="documents-section">
                  <h4>📋 Project Information</h4>
                  <div className="document-list">
                    <div className="document-item">
                      <span className="doc-icon">📅</span>
                      <span className="doc-name">Status: {selectedProject.featured ? 'Featured Project' : 'Completed'}</span>
                    </div>
                    <div className="document-item">
                      <span className="doc-icon">🏷️</span>
                      <span className="doc-name">Category: {selectedProject.category === 'ai-ml' ? 'AI & Machine Learning' : 'Web Development'}</span>
                    </div>
                    <div className="document-item">
                      <span className="doc-icon">🔧</span>
                      <span className="doc-name">Technologies: {selectedProject.technologies.length} different tools</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
