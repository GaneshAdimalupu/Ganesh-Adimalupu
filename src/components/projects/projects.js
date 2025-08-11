import React, { useState, useEffect, useRef } from 'react';
import './projects.css';

// Import images
import bestPaperCert from '../../assets/images/projects/best pap cer.webp';
import portfolioImage from '../../assets/images/projects/portfolio.webp';
import digit from '../../assets/images/projects/digit.webp';
import snehaDeepaImage from '../../assets/images/projects/sneha deepa.webp';
import faceRecognitionImage from '../../assets/images/projects/face recog.webp';
import newsImage from '../../assets/images/projects/news.webp';
import liftImage from '../../assets/images/projects/lift.webp';

// Hook to track element visibility for animations
const useIntersectionObserver = (options) => {
  const [elements, setElements] = useState([]);
  const observer = useRef(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.current.unobserve(entry.target);
        }
      });
    }, options);

    elements.forEach((el) => {
      if (el) observer.current.observe(el);
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [elements, options]);

  return setElements;
};

// Data for projects
const projectsData = [
  {
    id: 1,
    title: 'Be My Chef AI - AI-Powered Recipe Recommendation System',
    shortTitle: 'Be My Chef AI',
    description:
      'An award-winning AI-powered web application that generates complete recipes from user-uploaded food images using deep learning pipeline combining CNNs for ingredient recognition and Transformer models for recipe text generation.',
    image: bestPaperCert,
    category: 'AI/ML',
    featured: true,
    period: 'October 2024 - March 2025',
    status: 'completed',
    tags: [
      'Python',
      'PyTorch',
      'Transformers',
      'CNNs',
      'Streamlit',
      'Deep Learning',
    ],
    achievements: [
      "Winner: Best Paper Award (NCAISF'25) for innovative AI solution",
      'COSIM: 0.7282, WER: 0.7613, ROUGE-2: 0.2470, BLEU: 0.3245',
      'Real-time automated recipe creation with chef persona selection',
      'Integrated multiple chef models for varied culinary styles',
    ],
    technologies: {
      frontend: ['Streamlit'],
      backend: ['Python', 'PyTorch'],
      ai: ['CNNs', 'Transformers', 'Chef Transformer model'],
      tools: ['Jupyter Notebook'],
    },
    liveDemo: '#',
    githubRepo: 'https://github.com/GaneshAdimalupu/be-my-chef',
    impact:
      'Enhanced food exploration and discovery for users through innovative AI solution',
  },
  {
    id: 2,
    title: 'IoT Lift Access Control System using RFID',
    shortTitle: 'Smart Lift Control',
    description:
      'An innovative IoT-based lift access control system integrating secure RFID authentication, keypad floor selection, and real-time cloud monitoring with mobile app support.',
    image: liftImage,
    category: 'IoT',
    featured: true,
    period: 'March 2024 - May 2024',
    status: 'completed',
    tags: ['Flutter', 'C++', 'ESP8266', 'Firebase', 'Arduino', 'IoT'],
    achievements: [
      'Received formal certificate and appreciation from Principal',
      'Significantly enhanced building security and operational efficiency',
      'Real-time cloud monitoring and access logging',
      'Cross-platform mobile app (Android, iOS, web, desktop)',
    ],
    technologies: {
      mobile: ['Flutter', 'Dart'],
      embedded: ['C++', 'Arduino IDE'],
      hardware: ['ESP8266', 'RFID'],
      cloud: ['Firebase'],
      platforms: ['Android', 'iOS', 'Web', 'Desktop'],
    },
    liveDemo: '#',
    githubRepo: 'https://github.com/GaneshAdimalupu/IoT-Lift-Access-Control',
    impact:
      'Revolutionary approach to building security with granular access control',
  },
  {
    id: 3,
    title: 'Hospital Management System - Sneha Deepa Hospital',
    shortTitle: 'Hospital Management',
    description:
      'A responsive, SEO-optimized website for Sneha Deepa Hospital with comprehensive features including bilingual support, appointment systems, and modern web practices.',
    image: snehaDeepaImage,
    category: 'Web Dev',
    featured: true,
    period: 'May 2025',
    status: 'completed',
    tags: ['Next.js', 'React.js', 'Tailwind CSS', 'AWS Amplify', 'Vercel'],
    achievements: [
      "Enhanced hospital's online presence and accessibility",
      'Implemented bilingual support for wider reach',
      'Deployed to AWS Amplify and Vercel with CI/CD',
      'Emphasized accessibility and cross-browser compatibility',
    ],
    technologies: {
      frontend: ['React.js', 'Next.js', 'Tailwind CSS'],
      languages: ['JavaScript', 'HTML', 'CSS'],
      deployment: ['AWS Amplify', 'Vercel'],
      features: [
        'SEO Optimization',
        'Server-side Rendering',
        'Responsive Design',
      ],
    },
    liveDemo: '#',
    githubRepo: 'https://github.com/GaneshAdimalupu/sneha-deepa-hospital',
    impact:
      'Improved hospital outreach, patient engagement, and operational efficiency',
  },
  {
    id: 4,
    title: 'Handwritten Digit Recognition using CNN',
    shortTitle: 'Digit Recognition',
    description:
      'A Deep Learning model using TensorFlow and Keras to classify handwritten digits from the MNIST dataset with high accuracy using Convolutional Neural Networks.',
    image: digit,
    category: 'AI/ML',
    featured: false,
    period: 'During HDLC Internship 2023',
    status: 'completed',
    tags: ['TensorFlow', 'Keras', 'CNN', 'Python', 'MNIST'],
    achievements: [
      'Achieved high accuracy on MNIST dataset',
      'Implemented advanced CNN architecture',
      'Part of structured ML learning program',
      'Practical application of deep learning concepts',
    ],
    technologies: {
      frameworks: ['TensorFlow', 'Keras'],
      languages: ['Python'],
      concepts: ['CNN', 'Deep Learning', 'Image Classification'],
      dataset: ['MNIST'],
    },
    liveDemo: '#',
    githubRepo: 'https://github.com/GaneshAdimalupu/CNN-Tensorflow',
    impact:
      'Demonstrated practical application of deep learning in image recognition',
  },
  {
    id: 5,
    title: 'Face Recognition Evaluation Platform',
    shortTitle: 'Face Recognition',
    description:
      'A robust platform for benchmarking face recognition models, providing comprehensive tools for dataset management and performance analytics.',
    image: faceRecognitionImage,
    category: 'AI/ML',
    featured: false,
    period: '2023',
    status: 'completed',
    tags: ['Python', 'OpenCV', 'scikit-learn', 'Computer Vision'],
    achievements: [
      'Comprehensive benchmarking capabilities',
      'Advanced dataset management tools',
      'Performance analytics and reporting',
      'Support for multiple face recognition algorithms',
    ],
    technologies: {
      languages: ['Python'],
      libraries: ['OpenCV', 'scikit-learn'],
      concepts: ['Computer Vision', 'Face Recognition', 'Model Evaluation'],
      tools: ['Performance Analytics'],
    },
    liveDemo: '#',
    githubRepo:
      'https://github.com/GaneshAdimalupu/face-recognition-evaluation',
    impact:
      'Provided standardized evaluation framework for face recognition research',
  },
  {
    id: 6,
    title: 'Modern React Portfolio Website',
    shortTitle: 'React Portfolio',
    description:
      'This personal portfolio website built with React, featuring a modern dark theme, responsive design, interactive components, and comprehensive backend integration.',
    image: portfolioImage,
    category: 'Web Dev',
    featured: false,
    period: '2025',
    status: 'ongoing',
    tags: ['React', 'Node.js', 'MongoDB', 'CSS3', 'Express'],
    achievements: [
      'Modern responsive design with dark theme',
      'Interactive scheduling system with Google Calendar integration',
      'Comprehensive contact form with email notifications',
      'Enhanced user experience with smooth animations',
    ],
    technologies: {
      frontend: ['React', 'CSS3', 'JavaScript'],
      backend: ['Node.js', 'Express'],
      database: ['MongoDB'],
      integrations: ['Google Calendar API', 'Email Service'],
      deployment: ['Vercel'],
    },
    liveDemo: '#',
    githubRepo: 'https://github.com/GaneshAdimalupu/Ganesh-Adimalupu',
    impact:
      'Showcases technical skills and provides professional online presence',
  },
  {
    id: 7,
    title: 'News Classification System using NLP',
    shortTitle: 'News Classifier',
    description:
      'A Natural Language Processing system for automatically classifying news articles into categories, developed during academic internship with advanced text processing techniques.',
    image: newsImage,
    category: 'AI/ML',
    featured: false,
    period: 'HDLC Internship 2023',
    status: 'completed',
    tags: ['NLP', 'Python', 'Text Classification', 'Machine Learning'],
    achievements: [
      'Implemented advanced NLP techniques',
      'Automated news categorization system',
      'High accuracy in text classification',
      'Practical application of NLP concepts',
    ],
    technologies: {
      languages: ['Python'],
      concepts: ['NLP', 'Text Classification', 'Machine Learning'],
      techniques: ['Text Preprocessing', 'Feature Extraction'],
      tools: ['Natural Language Processing Libraries'],
    },
    liveDemo: '#',
    githubRepo: '#',
    impact:
      'Demonstrated practical application of NLP in content categorization',
  },
];

const filterCategories = ['All', 'AI/ML', 'Web Dev', 'IoT'];

// Simplified ProjectCard component without click functionality
const ProjectCard = React.forwardRef(({ project }, ref) => {
  const handleImageError = (e) => {
    e.target.src = `https://placehold.co/600x400/1a0f23/f0e6f0?text=${encodeURIComponent(
      project.shortTitle
    )}`;
  };

  return (
    <div
      className={`projects-card ${project.featured ? 'featured' : ''}`}
      ref={ref}
    >
      <div className="card-image-wrapper">
        {project.featured && <div className="featured-badge">Featured</div>}
        <div className="status-indicator">
          <span className={`status ${project.status}`}>
            {project.status === 'completed' ? '✓' : '⚠'} {project.status}
          </span>
        </div>
        <img
          src={project.image}
          alt={project.title}
          className="card-image"
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      <div className="card-content">
        <div className="card-header">
          <h3>{project.shortTitle}</h3>
          <span className="project-period">{project.period}</span>
        </div>
        <p className="card-description">{project.description}</p>
        <div className="card-tags">
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="tag more">+{project.tags.length - 4} more</span>
          )}
        </div>
        {project.achievements && (
          <div className="achievements-preview">
            <h4>Key Achievements:</h4>
            <ul>
              {project.achievements.slice(0, 2).map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="card-links">
          {project.liveDemo !== '#' && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="card-link primary"
            >
              Live Demo <span>→</span>
            </a>
          )}
          {project.githubRepo !== '#' && (
            <a
              href={project.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="card-link secondary"
            >
              GitHub <span>→</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

// Main Projects Component
const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [displayedProjects, setDisplayedProjects] = useState(projectsData);
  const [sortBy, setSortBy] = useState('featured');
  const setObservedElements = useIntersectionObserver({ threshold: 0.1 });

  const gridRef = useRef(null);
  const cardRefs = useRef([]);

  // Filter and sort projects
  useEffect(() => {
    let filtered =
      activeFilter === 'All'
        ? projectsData
        : projectsData.filter((p) => p.category === activeFilter);

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      }
      if (sortBy === 'date') {
        return (
          new Date(b.period.split(' - ')[0]) -
          new Date(a.period.split(' - ')[0])
        );
      }
      if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });

    setDisplayedProjects(filtered);
  }, [activeFilter, sortBy]);

  // Handle observing card elements
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, displayedProjects.length);
    setObservedElements(cardRefs.current);
  }, [displayedProjects, setObservedElements]);

  const projectStats = {
    total: projectsData.length,
    completed: projectsData.filter((p) => p.status === 'completed').length,
    featured: projectsData.filter((p) => p.featured).length,
    categories: [...new Set(projectsData.map((p) => p.category))].length,
  };

  return (
    <section id="projects" className="projects-section">
      <div className="projects-container">
        <div className="projects-header">
          <h2>My Projects</h2>
          <p>
            A comprehensive showcase of my AI/ML, IoT, and Web Development
            projects with real-world impact.
          </p>
          <div className="project-stats">
            <div className="stat">
              <span className="stat-number">{projectStats.total}</span>
              <span className="stat-label">Total Projects</span>
            </div>
            <div className="stat">
              <span className="stat-number">{projectStats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat">
              <span className="stat-number">{projectStats.featured}</span>
              <span className="stat-label">Featured</span>
            </div>
            <div className="stat">
              <span className="stat-number">{projectStats.categories}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>

        <div className="projects-controls">
          <div className="filter-buttons">
            {filterCategories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${
                  activeFilter === category ? 'active' : ''
                }`}
                onClick={() => setActiveFilter(category)}
              >
                {category}
                <span className="count">
                  (
                  {category === 'All'
                    ? projectsData.length
                    : projectsData.filter((p) => p.category === category)
                        .length}
                  )
                </span>
              </button>
            ))}
          </div>
          <div className="sort-controls">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="featured">Featured First</option>
              <option value="date">Latest First</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        <div className="projects-grid" ref={gridRef}>
          {displayedProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              ref={(el) => (cardRefs.current[index] = el)}
            />
          ))}
        </div>

        {displayedProjects.length === 0 && (
          <div className="no-projects">
            <p>No projects found for the selected filter.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
