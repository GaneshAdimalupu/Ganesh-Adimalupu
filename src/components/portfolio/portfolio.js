// components/portfolio/portfolio.js
import React, { useState } from 'react';
import './portfolio.css';

// NOTE: You must add images for the new projects below!
import bestPaperCert from '../../assets/images/best pap cer.jpg';
import portfolioImage from '../../assets/images/portfolio.png';
import digit from '../../assets/images/digit.png';
import snehaDeepaImage from '../../assets/images/sneha deepa.png';
import faceRecognitionImage from '../../assets/images/face recog.jpeg';

//const faceRecognitionImage = 'https://placehold.co/600x400/1e293b/ffffff?text=Face+Recognition+Platform';



// Supporting images for gallery
import profileSVG from '../../assets/images/profile.svg';
import logoSTIST from '../../assets/images/logoSTIST.png';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  // --- EXPANDED LIST OF YOUR BEST PROJECTS ---
  const projects = [
    // --- Tier 1 Projects ---
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
// --- Tier X Projects --- (update Tier as appropriate)
    {
      id: 4, // Assign a unique ID
      title: 'Sneha Deepa Hospital Website',
      description: 'A comprehensive hospital management system web application built with modern web technologies. Features include patient registration, appointment scheduling, doctor management, and digital record keeping.',
      image: snehaDeepaImage, // Replace with your actual project image variable
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
    // --- Tier X Projects ---
    {
      id: 6, // Assign a unique ID
      title: 'Face Recognition Evaluation Platform',
      description: 'A robust evaluation platform for benchmarking face recognition models. Provides tools for dataset management, result visualization, and model comparison to streamline research and development.',
      image: faceRecognitionImage, // Replace with your actual project image variable
      category: 'machine-learning',
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

  const openModal = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  };

  // PASTE THE REST OF YOUR RETURN JSX HERE (from the previous answer)
  // It starts with: return (<section id="portfolio" ... > ... </section>);
  // The JSX for rendering the grid and modal does not need to be changed.
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

      {selectedProject && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="project-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>×</button>
            <div className="modal-content">
              {/* The modal's detailed content will be rendered here */}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
