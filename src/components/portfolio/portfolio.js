import React, { useState } from 'react';
import './portfolio.css';

// Import your images
import bestPaperCert from '../../assets/images/best pap cer.jpg';
import portfolioImage from '../../assets/images/portfolio.png';
import digit from '../../assets/images/digit.png';
import snehaDeepaImage from '../../assets/images/sneha deepa.png';
import faceRecognitionImage from '../../assets/images/face recog.jpeg';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'Be My Chef - Smart Food Recommendation System',
      description: 'Award-winning intelligent food recommendation system using machine learning. Presented at IEEE conference and received Best Paper Award.',
      image: bestPaperCert,
      category: 'ai-ml',
      technologies: ['Machine Learning', 'Python', 'Recommendation Systems', 'IEEE'],
      githubRepo: 'https://github.com/GaneshAdimalupu/be-my-chef',
      featured: true,
    },
    {
      id: 2,
      title: 'CNN for Handwritten Digit Recognition',
      description: 'Deep learning model built with TensorFlow and Keras to classify handwritten digits from MNIST dataset.',
      image: digit,
      category: 'ai-ml',
      technologies: ['Python', 'TensorFlow', 'Keras', 'Deep Learning', 'CNN'],
      githubRepo: 'https://github.com/GaneshAdimalupu/CNN-Tensorflow',
      featured: true,
    },
    {
      id: 3,
      title: 'Modern React Portfolio Website',
      description: 'Personal portfolio built with React.js featuring clean UI, dark theme, and interactive components.',
      image: portfolioImage,
      category: 'web-dev',
      technologies: ['React.js', 'CSS3', 'JavaScript', 'Responsive Design'],
      liveDemo: window.location.href,
      githubRepo: 'https://github.com/GaneshAdimalupu/portfolio',
      featured: false,
    },
    {
      id: 4,
      title: 'Sneha Deepa Hospital Website',
      description: 'Comprehensive hospital management system with patient registration, appointment scheduling, and digital records.',
      image: snehaDeepaImage,
      category: 'web-dev',
      technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
      githubRepo: 'https://github.com/GaneshAdimalupu/sneha-deepa-hospital',
      featured: true,
    },
    {
      id: 5,
      title: 'Face Recognition Evaluation Platform',
      description: 'Evaluation platform for benchmarking face recognition models with dataset management and result visualization.',
      image: faceRecognitionImage,
      category: 'ai-ml',
      technologies: ['Python', 'OpenCV', 'scikit-learn', 'NumPy'],
      githubRepo: 'https://github.com/GaneshAdimalupu/face-recognition-evaluation',
      featured: false,
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

  return (
    <section id="portfolio" className="section">
      <div className="container">
        <h2>My Portfolio</h2>
        <p className="section-text">
          A showcase of my recent projects in AI/ML and web development.
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
            >
              <div className="portfolio-image">
                <img src={project.image} alt={project.title} loading="lazy" />
              </div>

              <div className="portfolio-info">
                <h3>{project.title}</h3>
                <p className="project-description">{project.description}</p>

                <div className="tech-stack">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>

                <div className="project-links">
                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      className="btn primary"
                      target="_blank"
                      rel="noopener noreferrer"
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
                    >
                      📂 View Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
