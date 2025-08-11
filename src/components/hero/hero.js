import React, { useState, useEffect } from 'react';
import './hero.css';
import profileImage from '../../assets/images/profile.webp';

// Custom hook for the typing effect
const useTypingEffect = (text, duration = 100, isStarted = true) => {
  const [currentText, setCurrentText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isStarted || !text) return;

    setCurrentText('');
    setIsDone(false);
    let i = 0;
    const timer = setInterval(() => {
      setCurrentText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        setIsDone(true);
      }
    }, duration);

    return () => clearInterval(timer);
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
  {
    icon: '💼',
    title: 'Academic Internships',
    subtitle: 'Completed 2 structured ML/AI programs',
    color: '#7209B7',
  },
];

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const fullRoleText = 'ML & Pipeline Builder';
  const [roleText, isTypingDone] = useTypingEffect(fullRoleText, 80, isMounted);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    setIsMounted(true);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleImageError = (e) => {
    e.target.src = `https://placehold.co/200x200/1a0f23/f0e6f0?text=GA`;
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
                    alt="Ganesh Adimalupu"
                    className="hero-image mobile"
                    onError={handleImageError}
                  />
                </div>
                <div className="intro-text">
                  <div className="greeting-badge mobile">
                    <span className="wave">👋</span>
                    <span>Hello, I'm Ganesh</span>
                  </div>
                  <h1 className="hero-title mobile">
                    A Creative <span className="name-highlight">Engineer</span>
                    <span className="role mobile">
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
              >
                View Work
              </button>
              <button
                className="cta-btn secondary mobile"
                onClick={() => window.open('/Ganesh CV.pdf', '_blank')}
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
                <span className="role">
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
                >
                  <span>View My Work</span>
                  <span>&rarr;</span>
                </button>
                <button
                  className="cta-btn secondary"
                  onClick={() => window.open('/Ganesh CV.pdf', '_blank')}
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
                  alt="Ganesh Adimalupu - Machine Learning Engineer"
                  className="hero-image"
                  onError={handleImageError}
                />
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
