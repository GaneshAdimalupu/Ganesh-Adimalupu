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
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

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

  const openSidePanel = (project) => {
    setSelectedProject(project);
    setSidePanelOpen(true);
    document.body.classList.add('side-panel-open');
  };

  const closeSidePanel = () => {
    setSidePanelOpen(false);
    document.body.classList.remove('side-panel-open');
    setTimeout(() => {
      setSelectedProject(null);
    }, 300);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && sidePanelOpen) {
        closeSidePanel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('side-panel-open');
    };
  }, [sidePanelOpen]);

  return (
    <section id="portfolio" className="section">
      {/* Apply the with-panel class to container instead of grid */}
      <div className={`container ${sidePanelOpen ? 'with-panel' : ''}`}>
        <h2>My Portfolio</h2>
        <p className="section-text">
          Click on any project to see detailed information in the side panel.
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
              className={`portfolio-card ${project.featured ? 'featured' : ''} ${selectedProject?.id === project.id ? 'selected' : ''}`}
              onClick={() => openSidePanel(project)}
            >
              <div className="portfolio-image">
                <img src={project.image} alt={project.title} loading="lazy" />
                <div className="portfolio-overlay">
                  <div className="overlay-content">
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
      </div>

      {/* Side Panel */}
      <div className={`side-panel ${sidePanelOpen ? 'open' : ''}`}>
        <div className="side-panel-overlay" onClick={closeSidePanel}></div>
        <div className="side-panel-content">
          <div className="side-panel-header">
            <h2>Project Details</h2>
            <button className="close-panel" onClick={closeSidePanel} aria-label="Close panel">×</button>
          </div>

          {selectedProject && (
            <div className="side-panel-body">
              <div className="project-image">
                <img src={selectedProject.image} alt={selectedProject.title} />
              </div>

              <div className="project-details">
                <h3>{selectedProject.title}</h3>
                <p>{selectedProject.description}</p>

                {selectedProject.achievements && (
                  <div className="achievements">
                    <h4>🏆 Achievements</h4>
                    <ul>
                      {selectedProject.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="technologies">
                  <h4>🛠️ Technologies</h4>
                  <div className="tech-tags">
                    {selectedProject.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>

                <div className="project-links">
                  {selectedProject.liveDemo && (
                    <a
                      href={selectedProject.liveDemo}
                      className="btn primary"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View live demo"
                    >
                      🚀 Live Demo
                    </a>
                  )}
                  {selectedProject.githubRepo && (
                    <a
                      href={selectedProject.githubRepo}
                      className="btn secondary"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View source code"
                    >
                      📂 View Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
