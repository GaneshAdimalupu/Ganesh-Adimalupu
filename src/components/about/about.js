import React, { useState, useEffect, useRef } from 'react';
import './about.css';

// Import all available images
import fossUnitedImage from '../../assets/images/about/yukthi_team.webp';
import talkImage from '../../assets/images/about/talk_1.webp';
import talk2Image from '../../assets/images/about/talk_2.webp';
import talk3Image from '../../assets/images/about/talk_3.webp';
import classImage from '../../assets/images/about/class.webp';
import graduationImage from '../../assets/images/about/graduation.webp';
import withThemImage from '../../assets/images/about/with_them.webp';

// Simple Image carousel component
const ImageCarousel = ({ images, interval = 4000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  if (!images || images.length === 0) {
    return (
      <div className="image-carousel">
        <div style={{
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          color: 'var(--text-secondary)'
        }}>
          No images available
        </div>
      </div>
    );
  }

  return (
    <div className="image-carousel">
      {images.map((image, index) => (
        <div
          key={index}
          className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: index === currentIndex ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out'
          }}
        >
          <img
            src={image.src}
            alt={image.alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
            onError={(e) => {
              console.error('Image failed to load:', e.target.src);
            }}
            onLoad={(e) => {
              console.log('Image loaded:', e.target.src);
            }}
          />
        </div>
      ))}

      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`indicator ${currentIndex === index ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Custom hook for observing visibility
const useElementOnScreen = (options) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [containerRef, options]);

  return [containerRef, isVisible];
};

// Comprehensive skills from CV
const technicalSkills = {
  languages: ['Python', 'JavaScript', 'Dart', 'C++', 'HTML', 'CSS'],
  frameworks: [
    'React.js',
    'Next.js',
    'Flutter',
    'PyTorch',
    'Transformers',
    'scikit-learn',
    'Tailwind CSS',
  ],
  tools: [
    'Jupyter Notebook',
    'Git',
    'GitHub',
    'Arduino IDE',
    'Visual Studio Code',
    'Streamlit',
    'npm',
  ],
  cloud: ['Firebase', 'AWS Amplify', 'Vercel'],
  databases: ['Firebase', 'SQL', 'MongoDB'],
  concepts: [
    'Machine Learning',
    'Deep Learning',
    'NLP',
    'Computer Vision',
    'IoT',
    'Embedded Systems',
    'Cross-platform App Development',
  ],
};

// Leadership achievements from CV
const leadershipData = [
  {
    role: 'Chapter Lead - FOSS United STIST',
    organization: 'FOSS United',
    period: '2023 – Present',
    achievements: [
      'Launched the second-ever FOSS United college chapter in Kerala',
      'Built student-led team from scratch fostering active contributor culture',
      'Organized FOSS Hack Localhost 2024 (officially recognized national node)',
      'Conducted multiple Linux installation parties and GitHub workshops',
    ],
  },
  {
    role: "Lead Organizer - Yukthi'25 TechFest",
    organization: 'St Thomas Institute for Science and Technology',
    period: '2025',
    achievements: [
      'Spearheaded planning for 500+ participants from colleges across Kerala',
      'Secured ₹3.73 lakhs in sponsorship',
      'Led complete budget management and outreach campaigns',
      'Coordinated technical sessions and industry speaker invitations',
    ],
  },
  {
    role: 'ICFOSS Collaborator',
    organization: 'International Centre for Free and Open Source Software',
    period: '2023 – Present',
    achievements: [
      'Bridge between ICFOSS and campus communities',
      'Organized awareness sessions and FOSS 101 workshops',
      'Led CLI Treasure Hunts and technical talks',
    ],
  },
];

// Education data from CV
const educationData = [
  {
    degree: 'Bachelor of Technology, Computer Science',
    institution: 'St Thomas Institute for Science and Technology',
    location: 'Trivandrum, Kerala',
    graduation: 'April 2025',
    type: 'current',
  },
  {
    degree: 'Higher Secondary School, Mathematics',
    institution: 'Narayana Junior College',
    location: 'Kurnool, AP',
    graduation: 'September 2021',
    type: 'completed',
  },
    {
    degree: 'Secondary School',
    institution: 'Christ Jyothi E.M School',
    location: 'Gajulapalle, AP',
    graduation: 'March 2019',
    type: 'completed',
  },
];

// Internship data from CV
const internshipData = [
  {
    company: 'HDLC Info Technologies',
    period: 'May 2023 - June 2023',
    type: 'Academic Internship',
    achievements: [
      'Completed 2-month structured learning program in Data Science and Machine Learning',
      'Developed handwritten digit detection using CNN',
      'Built news classification system using Natural Language Processing',
      'Created celebrity image classifier using deep learning techniques',
    ],
  },
  {
    company: 'Techniche IIT Guwahati & 1Stop.ai',
    period: 'June 2022 - August 2022',
    type: 'AI Program',
    achievements: [
      'Completed intensive AI program covering machine learning fundamentals',
      'Gained exposure to practical ML implementations',
      'Completed projects involving data preprocessing and model development',
    ],
  },
];

// Main About Component
const About = () => {
  const [containerRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  });

  const [activeTab, setActiveTab] = useState('overview');

  // Create image arrays with different intervals for alternating effect
  const talkImages = [
    { src: talkImage, alt: 'Ganesh giving technical talk 1' },
    { src: talk2Image, alt: 'Ganesh giving technical talk 2' },
    { src: talk3Image, alt: 'Ganesh giving technical talk 3' },
    { src: classImage, alt: 'Ganesh teaching in class' },
  ];

  const communityImages = [
    { src: fossUnitedImage, alt: 'FOSS United STIST Chapter Team' },
    { src: graduationImage, alt: 'Graduation ceremony' },
    { src: withThemImage, alt: 'Community engagement' },
  ];

  // Debug logging
  useEffect(() => {
    console.log('=== IMAGE DEBUG ===');
    console.log('Talk Images:', talkImages.map(img => ({ src: img.src, hasImage: !!img.src })));
    console.log('Community Images:', communityImages.map(img => ({ src: img.src, hasImage: !!img.src })));
  }, []);

  return (
    <section
      id="about"
      className={`about-section ${isVisible ? 'is-visible' : ''}`}
      ref={containerRef}
    >
      <div className="about-container">
        <div className="about-header">
          <h2>About Me</h2>
          <p>
            Recent Computer Science graduate with strong foundational knowledge
            in AI/ML technologies and hands-on experience gained through
            academic internships and research projects.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="about-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => setActiveTab('education')}
          >
            Education
          </button>
          <button
            className={`tab-btn ${activeTab === 'leadership' ? 'active' : ''}`}
            onClick={() => setActiveTab('leadership')}
          >
            Leadership
          </button>
          <button
            className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            Skills
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="tab-panel">
              <div className="alternating-row">
                <div className="alternating-visual">
                  <ImageCarousel images={communityImages} interval={5000} />
                </div>
                <div className="alternating-text">
                  <h3>Community Builder & FOSS Advocate</h3>
                  <p>
                    As the founder and Chapter Lead of the second FOSS United
                    chapter in Kerala, I am dedicated to fostering a vibrant
                    culture of open-source contribution. Successfully organized{' '}
                    <strong>FOSS Hack Localhost 2024</strong>, an officially
                    recognized national node, bringing together students and
                    professionals to collaborate and innovate.
                  </p>
                  <div className="highlight-stats">
                   <div className="stat-item">
                    <h3>500+</h3>
                    <p>Participants at Yukthi'25 TechFest</p>
                  </div>
                  <div className="stat-item">
                    <h3>₹3.73L</h3>
                    <p>Sponsorship Secured for Events</p>
                  </div>
                  </div>
                </div>
              </div>

              <div className="alternating-row reverse">
                <div className="alternating-visual">
                  <ImageCarousel images={talkImages} interval={4000} />
                </div>
                <div className="alternating-text">
                  <h3>Technical Expertise & Mentorship</h3>
                  <p>
                    My project work spans AI/ML, IoT, and Full-Stack Development
                    with expertise in the complete project lifecycle. I
                    continuously expand my skills by leading workshops,
                    contributing to open-source projects, and mentoring peers in
                    technologies like Linux, Git/GitHub, and software
                    development methodologies.
                  </p>
                  <div className="internship-preview">
                    <h4>Recent Internships:</h4>
                    <ul>
                      <li>
                        <strong>HDLC Info Technologies</strong> - Data Science &
                        ML (2023)
                      </li>
                      <li>
                        <strong>Techniche IIT Guwahati</strong> - AI Program
                        (2022)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="tab-panel">
              <div className="education-timeline">
                {educationData.map((edu, index) => (
                  <div key={index} className={`education-item ${edu.type}`}>
                    <div className="education-marker"></div>
                    <div className="education-content">
                      <h3>{edu.degree}</h3>
                      <p className="institution">{edu.institution}</p>
                      <p className="location">{edu.location}</p>
                      <span className="graduation-date">{edu.graduation}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="internship-section">
                <h3>Academic Internships & Programs</h3>
                <div className="internship-grid">
                  {internshipData.map((internship, index) => (
                    <div key={index} className="internship-card">
                      <div className="internship-header">
                        <h4>{internship.company}</h4>
                        <span className="internship-type">
                          {internship.type}
                        </span>
                        <span className="internship-period">
                          {internship.period}
                        </span>
                      </div>
                      <ul className="internship-achievements">
                        {internship.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leadership' && (
            <div className="tab-panel">
              <div className="leadership-grid">
                {leadershipData.map((role, index) => (
                  <div key={index} className="leadership-card">
                    <div className="leadership-header">
                      <h3>{role.role}</h3>
                      <p className="organization">{role.organization}</p>
                      <span className="period">{role.period}</span>
                    </div>
                    <div className="achievements-list">
                      {role.achievements.map((achievement, i) => (
                        <div key={i} className="achievement-item">
                          <span className="achievement-icon">✓</span>
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="tab-panel">
              <div className="skills-categories">
                {Object.entries(technicalSkills).map(([category, skills]) => (
                  <div key={category} className="skill-category">
                    <h3>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h3>
                    <div className="skills-list">
                      {skills.map((skill, index) => (
                        <span key={index} className="skill-item">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Stats Grid */}
        <div className="stats-grid">
          <div className="stat-item">
            <h3>15+</h3>
            <p>Students onboarded to GitHub via MuLearn</p>
          </div>
          <div className="stat-item">
            <h3>#2</h3>
            <p>FOSS United College Chapter Founded in Kerala</p>
          </div>
          <div className="stat-item">
            <h3>2</h3>
            <p>Academic Internships Completed</p>
          </div>
          <div className="stat-item">
            <h3>3+</h3>
            <p>Years of Community Building</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
