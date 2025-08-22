import React, { useState, useEffect } from 'react';
import './hero.css';
import profileImage from '../../assets/images/profile.webp';

// FIXED: Custom hook for the typing effect
const useTypingEffect = (text, duration = 100, isStarted = true) => {
  const [currentText, setCurrentText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isStarted || !text) {
      setCurrentText('');
      setIsDone(false);
      return;
    }

    // FIXED: Reset states properly
    setCurrentText('');
    setIsDone(false);

    let i = 0;
    const timer = setInterval(() => {
      // FIXED: Use functional update to ensure we get the correct character
      setCurrentText((prev) => {
        const newText = text.slice(0, i + 1);
        return newText;
      });

      i++;

      // FIXED: Check against text length properly
      if (i >= text.length) {
        clearInterval(timer);
        setIsDone(true);
      }
    }, duration);

    return () => {
      clearInterval(timer);
    };
  }, [text, duration, isStarted]);

  return [currentText, isDone];
};

// Achievement data - can be easily modified
const achievements = [
  {
    icon: '🏆',
    title: 'Best Paper Award Winner',
    subtitle: "NCAISF'25 for AI-Powered Recipe Recommendation",
    color: '#FFD700',
  },
  {
    icon: '🚀',
    title: 'FOSS Chapter Lead',
    subtitle: 'Founded 2nd FOSS United chapter in Kerala',
    color: '#F72585',
  },
  {
    icon: '🎯',
    title: 'Event Organizer',
    subtitle: "Led Yukthi'25 TechFest with 500+ participants",
    color: '#4CC9F0',
  },
];

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // FIXED: Ensure the full text is used
  const fullRoleText = 'ML & Pipeline Builder';
  const [roleText, isTypingDone] = useTypingEffect(fullRoleText, 120, isMounted);

  console.log('Typing Debug:', { fullRoleText, roleText, length: roleText.length, isDone: isTypingDone });

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // FIXED: Add small delay before starting typing
    setTimeout(() => {
      setIsMounted(true);
    }, 500);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleImageError = (e) => {
    console.error('Profile image failed to load:', e.target.src);
    setImageError(true);
    e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23F72585'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='48' font-family='Arial'%3EGA%3C/svg%3E`;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // IMPROVED: Better CV download function with multiple fallbacks
  const downloadCV = () => {
    try {
      // Method 1: Try direct download
      const link = document.createElement('a');
      link.href = '/Ganesh-CV.pdf'; // This should point to public/Ganesh-CV.pdf
      link.download = 'Ganesh_Adimalupu_CV.pdf'; // Name for downloaded file
      link.target = '_blank'; // Open in new tab as fallback

      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('CV download initiated successfully');
    } catch (error) {
      console.error('Download failed, opening in new tab:', error);

      // Fallback: Open in new tab
      try {
        window.open('/Ganesh-CV.pdf', '_blank');
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        alert('CV download failed. Please contact me directly for my resume.');
      }
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        {/* Mobile Layout */}
        {isMobile ? (
          <div className="mobile-layout">
            {/* Compact Header */}
            <div className="mobile-header">
              <div className="profile-section">
                <div className="image-wrapper mobile">
                  <img
                    src={profileImage}
                    alt="Ganesh Adimalupu - AI/ML Engineer and Computer Science Graduate"
                    className={`hero-image mobile ${imageLoaded ? 'loaded' : ''}`}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    loading="lazy"
                    style={{
                      opacity: imageLoaded ? 1 : 0.5,
                      transition: 'opacity 0.3s ease'
                    }}
                  />
                  {!imageLoaded && !imageError && (
                    <div className="image-loading" style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)'
                    }}>
                      ...
                    </div>
                  )}
                </div>
                <div className="intro-text">
                  <div className="greeting-badge mobile">
                    <span className="wave">👋</span>
                    <span>Hello, I'm Ganesh</span>
                  </div>
                  <h1 className="hero-title mobile">
                    A Creative <span className="name-highlight">Engineer</span>
                    <span className="role mobile" style={{ minHeight: '1.5rem', display: 'block' }}>
                      {roleText}
                      {!isTypingDone && <span className="cursor" />}
                    </span>
                  </h1>
                </div>
              </div>
            </div>

            {/* Compact Description */}
            <p className="hero-description mobile">
              Recent CS graduate with strong AI/ML foundation. Passionate about
              leveraging AI to solve real-world problems and building tech
              communities.
            </p>

            {/* Compact Achievement Grid */}
            <div className="achievements-mobile">
              <h3 className="achievements-title">Key Achievements</h3>
              <div className="achievements-scroll-container">
                <div className="achievements-grid mobile">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="achievement-card mobile">
                      <div
                        className="achievement-icon"
                        style={{ color: achievement.color }}
                        role="img"
                        aria-label={achievement.title}
                      >
                        {achievement.icon}
                      </div>
                      <div className="achievement-content">
                        <h4>{achievement.title}</h4>
                        <p>{achievement.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Compact Action Buttons */}
            <div className="hero-buttons mobile">
              <button
                className="cta-btn primary mobile"
                onClick={() => scrollToSection('projects')}
                aria-label="View my portfolio projects"
              >
                View Work
              </button>
              <button
                className="cta-btn secondary mobile"
                onClick={downloadCV}
                aria-label="Download Ganesh's resume PDF"
              >
                Download CV
              </button>
            </div>
          </div>
        ) : (
          /* Desktop Layout */
          <div className="desktop-layout">
            <div className="hero-content">
              <div className="greeting-badge">
                <span className="wave">👋</span>
                <span>Hello, I'm Ganesh Adimalupu</span>
              </div>

              <h1 className="hero-title">
                A Creative <span className="name-highlight">Engineer</span> From
                India
                <span className="role" style={{ minHeight: '2.2rem', display: 'block' }}>
                  {roleText}
                  {!isTypingDone && <span className="cursor" />}
                </span>
              </h1>

              <p className="hero-description">
                A recent Computer Science graduate with strong foundational
                knowledge in AI/ML technologies. Passionate about leveraging AI
                to solve real-world problems, I am eager to contribute fresh
                perspectives and technical skills to a dynamic development team.
              </p>

              <div className="hero-buttons">
                <button
                  className="cta-btn primary"
                  onClick={() => scrollToSection('projects')}
                  aria-label="View my portfolio projects"
                >
                  <span>View My Work</span>
                  <span>&rarr;</span>
                </button>
                <button
                  className="cta-btn secondary"
                  onClick={downloadCV}
                  aria-label="Download Ganesh's resume PDF"
                >
                  Download CV
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="image-wrapper">
                <div className="bg-blobs">
                  <div className="blob blob-1"></div>
                  <div className="blob blob-2"></div>
                </div>
                <img
                  src={profileImage}
                  alt="Ganesh Adimalupu - Machine Learning Engineer, AI/ML Enthusiast, and Computer Science Graduate"
                  className={`hero-image ${imageLoaded ? 'loaded' : ''}`}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  loading="lazy"
                  style={{
                    opacity: imageLoaded ? 1 : 0.5,
                    transition: 'opacity 0.3s ease'
                  }}
                />
                {!imageLoaded && !imageError && (
                  <div className="image-loading" style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '1rem',
                    color: 'var(--text-secondary)'
                  }}>
                    Loading...
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Achievement Cards */}
            <div className="achievements-desktop">
              <div className="achievements-grid desktop">
                {achievements.map((achievement, index) => (
                  <div key={index} className="achievement-card desktop">
                    <div
                      className="achievement-icon"
                      style={{ color: achievement.color }}
                      role="img"
                      aria-label={achievement.title}
                    >
                      {achievement.icon}
                    </div>
                    <div className="achievement-content">
                      <h4>{achievement.title}</h4>
                      <p>{achievement.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
