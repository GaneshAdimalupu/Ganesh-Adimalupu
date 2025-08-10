import React, { useState, useEffect, useRef } from 'react';
import './certifications.css';

// --- SVG Icons for Different Providers ---
const icons = {
  google: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect x="4" y="12" width="16" height="8" rx="2" />
      <path d="M2 12h20" />
      <path d="M12 12v.01" />
    </svg>
  ),
  udemy: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 11 3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  cokonet: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <path d="M20 8v6m0 0v6m0-6h6m-6 0H14" />
    </svg>
  ),
  internship: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  workshop: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 14 4-4" />
      <path d="m18 16 4-4" />
      <path d="m6 8-4 4 4 4" />
      <path d="m12 14 4 4" />
      <path d="m18 8-4 4" />
    </svg>
  ),
  iit: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2,17 12,22 22,17" />
      <polyline points="2,12 12,17 22,12" />
    </svg>
  ),
  edureka: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
};

// Comprehensive certifications data from CV
const certificationsData = [
  {
    id: 1,
    title: 'Machine Learning Crash Course',
    provider: 'Google',
    date: '2025',
    type: 'Professional Course',
    status: 'completed',
    description:
      'A comprehensive course from Google covering machine learning fundamentals, TensorFlow basics, and practical applications with real-world projects.',
    skills: [
      'Machine Learning',
      'TensorFlow',
      'Data Science',
      'Neural Networks',
      'Model Training',
    ],
    logo: icons.google,
    credentialId: 'GOOGLE-ML-2025',
    duration: '40+ hours',
    level: 'Intermediate',
    highlights: [
      'Hands-on experience with TensorFlow',
      'Real-world ML project implementations',
      'Understanding of ML algorithms and concepts',
      'Practical experience with model evaluation',
    ],
  },
  {
    id: 2,
    title: 'Professional Internship Program',
    provider: 'Edureka',
    date: '2024',
    type: 'Internship Certificate',
    status: 'completed',
    description:
      'A comprehensive internship program focusing on real-world project development, industry best practices in data science, machine learning, and professional development.',
    skills: [
      'Project Management',
      'Agile Methodology',
      'Professional Development',
      'Data Science',
      'Team Collaboration',
    ],
    logo: icons.edureka,
    credentialId: 'EDUREKA-INTERN-2024',
    duration: '3 months',
    level: 'Professional',
    highlights: [
      'Real-world project development experience',
      'Industry best practices in data science',
      'Agile development methodologies',
      'Professional communication and teamwork',
    ],
  },
  {
    id: 3,
    title: 'Artificial Intelligence Program',
    provider: '1Stop.ai & Techniche IIT Guwahati',
    date: '2022',
    type: 'Intensive Program',
    status: 'completed',
    description:
      'An intensive AI program covering machine learning fundamentals, practical implementations, and projects involving data preprocessing and model development in collaboration with IIT Guwahati.',
    skills: [
      'Artificial Intelligence',
      'Machine Learning',
      'Data Preprocessing',
      'Model Development',
      'Algorithm Implementation',
    ],
    logo: icons.iit,
    credentialId: 'IIT-GUWAHATI-AI-2022',
    duration: '2 months',
    level: 'Advanced',
    highlights: [
      'Collaboration with prestigious IIT Guwahati',
      'Comprehensive AI fundamentals coverage',
      'Hands-on project implementations',
      'Advanced algorithm understanding',
    ],
  },
  {
    id: 4,
    title: 'Machine Learning in Python & R',
    provider: 'Udemy',
    date: '2024',
    type: 'Online Course',
    status: 'completed',
    description:
      'A practical course focused on implementing machine learning models using both Python and R programming languages, covering data analysis, modeling, and statistical concepts.',
    skills: [
      'Python',
      'R Programming',
      'Data Analysis',
      'Statistical Modeling',
      'Data Visualization',
    ],
    logo: icons.udemy,
    credentialId: 'UDEMY-ML-PY-R-2024',
    duration: '30+ hours',
    level: 'Intermediate',
    highlights: [
      'Dual-language ML implementation',
      'Comprehensive data analysis techniques',
      'Statistical modeling approaches',
      'Practical hands-on projects',
    ],
  },
  {
    id: 5,
    title: 'Python Programming Course',
    provider: 'Cokonet',
    date: '2023',
    type: 'Programming Certificate',
    status: 'completed',
    description:
      'A foundational Python programming course covering core concepts, object-oriented programming, data structures, and practical application development.',
    skills: [
      'Python Programming',
      'Object-Oriented Programming',
      'Data Structures',
      'Algorithm Design',
      'Software Development',
    ],
    logo: icons.cokonet,
    credentialId: 'COKONET-PYTHON-2023',
    duration: '25+ hours',
    level: 'Beginner to Intermediate',
    highlights: [
      'Strong foundation in Python programming',
      'Object-oriented programming concepts',
      'Data structures and algorithms',
      'Practical application development',
    ],
  },
  {
    id: 6,
    title: 'DevOps & MLOps Workshop',
    provider: 'Professional Workshop',
    date: '2024',
    type: 'Technical Workshop',
    status: 'completed',
    description:
      'An advanced workshop on DevOps practices and MLOps for streamlined machine learning deployment, operations, and continuous integration/deployment pipelines.',
    skills: [
      'DevOps',
      'MLOps',
      'CI/CD',
      'Docker',
      'Kubernetes',
      'Model Deployment',
    ],
    logo: icons.workshop,
    credentialId: 'DEVOPS-MLOPS-2024',
    duration: '2 days intensive',
    level: 'Advanced',
    highlights: [
      'Modern DevOps practices and tools',
      'MLOps pipeline implementation',
      'Containerization with Docker',
      'Continuous deployment strategies',
    ],
  },
  {
    id: 7,
    title: 'Android Development Webinar',
    provider: 'Tech Workshop',
    date: '2024',
    type: 'Development Webinar',
    status: 'completed',
    description:
      'A comprehensive webinar covering modern Android app development, best practices, mobile technologies, and cross-platform development approaches.',
    skills: [
      'Android Development',
      'Mobile Technologies',
      'Java',
      'Mobile UI/UX',
      'App Architecture',
    ],
    logo: icons.workshop,
    credentialId: 'ANDROID-DEV-2024',
    duration: '4 hours',
    level: 'Intermediate',
    highlights: [
      'Modern Android development practices',
      'Mobile app architecture patterns',
      'Cross-platform development insights',
      'Industry best practices and trends',
    ],
  },
];

// Certificate categories for filtering
const certificateCategories = [
  'All',
  'Machine Learning',
  'Programming',
  'Professional Development',
  'Workshops',
];

// Custom hooks
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
    return () => observer.current?.disconnect();
  }, [elements, options]);

  return setElements;
};

// Enhanced Certificate Card Component
const CertificationCard = React.forwardRef(({ cert, onClick }, ref) => {
  const getCategoryFromSkills = (skills) => {
    if (
      skills.some(
        (skill) =>
          skill.toLowerCase().includes('machine learning') ||
          skill.toLowerCase().includes('ai')
      )
    ) {
      return 'ML/AI';
    }
    if (
      skills.some(
        (skill) =>
          skill.toLowerCase().includes('python') ||
          skill.toLowerCase().includes('programming')
      )
    ) {
      return 'Programming';
    }
    if (
      skills.some(
        (skill) =>
          skill.toLowerCase().includes('project') ||
          skill.toLowerCase().includes('professional')
      )
    ) {
      return 'Professional';
    }
    return 'Technical';
  };

  return (
    <div className="cert-card" onClick={onClick} ref={ref}>
      <div className="card-header">
        <div className="card-icon">{cert.logo}</div>
        <div className="card-title-group">
          <h3>{cert.title}</h3>
          <p className="provider">{cert.provider}</p>
          <div className="cert-meta">
            <span className="cert-date">{cert.date}</span>
            <span className="cert-type">{cert.type}</span>
            <span className={`cert-status ${cert.status}`}>{cert.status}</span>
          </div>
        </div>
      </div>

      <div className="card-body">
        <p className="card-description">
          {cert.description.length > 120
            ? `${cert.description.substring(0, 110)}...`
            : cert.description}
        </p>

        <div className="cert-details">
          <div className="detail-item">
            <span className="label">Duration:</span>
            <span className="value">{cert.duration}</span>
          </div>
          <div className="detail-item">
            <span className="label">Level:</span>
            <span className="value">{cert.level}</span>
          </div>
          <div className="detail-item">
            <span className="label">Category:</span>
            <span className="value">{getCategoryFromSkills(cert.skills)}</span>
          </div>
        </div>

        <div className="skills-preview">
          {cert.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
          {cert.skills.length > 3 && (
            <span className="skill-tag more">
              +{cert.skills.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

// Enhanced Certificate Modal Component
const CertificationModal = ({ cert, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>

        <div className="modal-header">
          <div className="modal-icon">{cert.logo}</div>
          <div className="modal-title-section">
            <h2>{cert.title}</h2>
            <p className="modal-provider">
              Issued by {cert.provider} • {cert.date}
            </p>
            <div className="modal-badges">
              <span className="badge type">{cert.type}</span>
              <span className="badge level">{cert.level}</span>
              <span className="badge duration">{cert.duration}</span>
              <span className={`badge status ${cert.status}`}>
                {cert.status}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="description-section">
            <h3>About this certification</h3>
            <p>{cert.description}</p>

            {cert.credentialId && (
              <div className="credential-info">
                <strong>Credential ID:</strong> {cert.credentialId}
              </div>
            )}
          </div>

          {cert.highlights && (
            <div className="highlights-section">
              <h3>Key Highlights</h3>
              <ul className="highlights-list">
                {cert.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="skills-section">
            <h3>Skills Covered</h3>
            <div className="modal-tags">
              {cert.skills.map((skill, index) => (
                <span key={index} className="tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Statistics Component
const CertificationStats = ({ certifications }) => {
  const stats = {
    total: certifications.length,
    completed: certifications.filter((cert) => cert.status === 'completed')
      .length,
    providers: [...new Set(certifications.map((cert) => cert.provider))].length,
    totalHours: certifications.reduce((total, cert) => {
      const hours = cert.duration.match(/(\d+)/);
      return total + (hours ? parseInt(hours[1]) : 0);
    }, 0),
  };

  return (
    <div className="cert-stats">
      <div className="stat-item">
        <span className="stat-number">{stats.total}</span>
        <span className="stat-label">Total Certificates</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{stats.completed}</span>
        <span className="stat-label">Completed</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{stats.providers}</span>
        <span className="stat-label">Providers</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{stats.totalHours}+</span>
        <span className="stat-label">Learning Hours</span>
      </div>
    </div>
  );
};

// Main Certifications Component
const Certifications = () => {
  const [selectedCert, setSelectedCert] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [displayedCerts, setDisplayedCerts] = useState(certificationsData);
  const setObservedElements = useIntersectionObserver({ threshold: 0.1 });
  const cardRefs = useRef([]);

  // Filter and sort certifications
  useEffect(() => {
    let filtered = certificationsData;

    // Apply filter
    if (activeFilter !== 'All') {
      filtered = filtered.filter((cert) => {
        const skillsText = cert.skills.join(' ').toLowerCase();
        switch (activeFilter) {
          case 'Machine Learning':
            return (
              skillsText.includes('machine learning') ||
              skillsText.includes('ai') ||
              skillsText.includes('tensorflow')
            );
          case 'Programming':
            return (
              skillsText.includes('python') ||
              skillsText.includes('programming') ||
              skillsText.includes('development')
            );
          case 'Professional Development':
            return (
              cert.type.includes('Internship') ||
              skillsText.includes('professional') ||
              skillsText.includes('project')
            );
          case 'Workshops':
            return (
              cert.type.includes('Workshop') || cert.type.includes('Webinar')
            );
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        return parseInt(b.date) - parseInt(a.date);
      }
      if (sortBy === 'provider') {
        return a.provider.localeCompare(b.provider);
      }
      if (sortBy === 'level') {
        const levelOrder = {
          'Beginner to Intermediate': 1,
          Intermediate: 2,
          Advanced: 3,
          Professional: 4,
        };
        return (levelOrder[b.level] || 0) - (levelOrder[a.level] || 0);
      }
      return 0;
    });

    setDisplayedCerts(filtered);
  }, [activeFilter, sortBy]);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, displayedCerts.length);
    setObservedElements(cardRefs.current);
  }, [displayedCerts, setObservedElements]);

  return (
    <>
      <section id="certifications" className="certifications-section">
        <div className="certifications-container">
          <div className="certifications-header">
            <h2>Certifications & Professional Development</h2>
            <p>
              A comprehensive collection of my professional credentials,
              courses, and continuous learning journey in technology and AI/ML.
            </p>

            <CertificationStats certifications={certificationsData} />
          </div>

          {/* Controls */}
          <div className="certifications-controls">
            <div className="filter-buttons">
              {certificateCategories.map((category) => (
                <button
                  key={category}
                  className={`filter-btn ${
                    activeFilter === category ? 'active' : ''
                  }`}
                  onClick={() => setActiveFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="sort-controls">
              <label htmlFor="cert-sort">Sort by:</label>
              <select
                id="cert-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="date">Latest First</option>
                <option value="provider">Provider</option>
                <option value="level">Skill Level</option>
              </select>
            </div>
          </div>

          {/* Certifications Grid */}
          <div className="certifications-grid">
            {displayedCerts.map((cert, index) => (
              <CertificationCard
                key={cert.id}
                cert={cert}
                onClick={() => setSelectedCert(cert)}
                ref={(el) => (cardRefs.current[index] = el)}
              />
            ))}
          </div>

          {displayedCerts.length === 0 && (
            <div className="no-results">
              <p>No certifications found for the selected filter.</p>
            </div>
          )}
        </div>
      </section>

      {selectedCert && (
        <CertificationModal
          cert={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </>
  );
};

export default Certifications;
