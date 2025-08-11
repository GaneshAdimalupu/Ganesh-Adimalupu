import React, { useState, useEffect, useRef } from 'react';
import './hero.css';
// Ensure the path to your profile image is correct
import profileImage from '../../assets/images/profile.webp';

// --- DATA CONFIGURATION ---
// Centralize all component data here for easy updates.
const heroData = {
  greeting: "Hello, I'm Ganesh Adimalupu",
  title: {
    prefix: 'A Creative',
    highlight: 'Engineer',
    suffix: 'From India',
  },
  roles: [
    'AI/ML Enthusiast',
    'Computer Science Graduate',
    'Full-Stack Developer',
    'FOSS Community Leader',
    'ML & Pipeline Builder',
  ],
  description:
    'Recent Computer Science graduate with strong foundational knowledge in AI/ML technologies and hands-on experience gained through academic internships and research projects. Passionate about leveraging AI to solve real-world problems.',
  highlights: [
    { icon: '🎓', text: 'B.Tech Computer Science Graduate' },
    { icon: '🏆', text: "Best Paper Award Winner (NCAISF'25)" },
    { icon: '🚀', text: 'FOSS Community Leader' },
  ],
  socialLinks: [
    {
      name: 'GitHub',
      url: 'https://github.com/GaneshAdimalupu',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/GaneshAdimalupu/',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: 'Email',
      url: 'mailto:ganeshadimalupu@disroot.org',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
  ],
  achievements: [
    {
      icon: '🏆',
      title: 'Best Paper Award Winner',
      description: "NCAISF'25 for AI-Powered Recipe Recommendation",
    },
    {
      icon: '🚀',
      title: 'FOSS Chapter Lead',
      description: 'Founded 2nd FOSS United chapter in Kerala',
    },
    {
      icon: '🎯',
      title: 'Event Organizer',
      description: "Led Yukthi'25 TechFest with 500+ participants",
    },
  ],
};

// Custom Hook for Typing Effect
const useTypingEffect = (
  texts,
  typeSpeed = 100,
  deleteSpeed = 50,
  pauseDuration = 2000
) => {
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!texts || texts.length === 0) return;
    const handleTyping = () => {
      const fullText = texts[textIndex];
      if (isDeleting) {
        if (currentText.length > 0) {
          setCurrentText(fullText.substring(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      } else {
        if (currentText.length < fullText.length) {
          setCurrentText(fullText.substring(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      }
    };
    const timer = setTimeout(
      handleTyping,
      isDeleting ? deleteSpeed : typeSpeed
    );
    return () => clearTimeout(timer);
  }, [
    currentText,
    isDeleting,
    textIndex,
    texts,
    typeSpeed,
    deleteSpeed,
    pauseDuration,
  ]);

  return currentText;
};

// Main Hero Component
const Hero = () => {
  const [showAchievements, setShowAchievements] = useState(false);
  const roleText = useTypingEffect(heroData.roles, 80, 50, 1500);
  const heroRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowAchievements(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { offsetWidth, offsetHeight } = heroRef.current;
      const xPercent = (clientX / offsetWidth - 0.5) * 2;
      const yPercent = (clientY / offsetHeight - 0.5) * 2;
      heroRef.current.style.setProperty('--mouse-x', `${xPercent}`);
      heroRef.current.style.setProperty('--mouse-y', `${yPercent}`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Helper functions
  const scrollToSection = (sectionId) => {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/400x400/1a0f23/f0e6f0?text=GA';
    e.target.alt = 'Placeholder image for Ganesh Adimalupu';
  };

  const downloadCV = () => {
    const cvUrl = '/Ganesh-CV.pdf';
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = 'Ganesh_Adimalupu_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="hero-container">
        {/* --- LEFT CONTENT COLUMN --- */}
        <div className="hero-content">
          <div className="greeting-badge">
            <span className="wave" role="img" aria-label="waving hand">
              👋
            </span>
            <span>{heroData.greeting}</span>
          </div>

          <h1 className="hero-title">
            {heroData.title.prefix}{' '}
            <span className="name-highlight">{heroData.title.highlight}</span>{' '}
            {heroData.title.suffix}
            <span className="role">
              {roleText}
              <span className="cursor" />
            </span>
          </h1>

          <p className="hero-description">{heroData.description}</p>

          <div className="hero-buttons">
            <button
              className="cta-btn primary"
              onClick={() => scrollToSection('projects')}
              aria-label="View my projects"
            >
              View My Work <span>→</span>
            </button>
            <button
              className="cta-btn secondary"
              onClick={downloadCV}
              aria-label="Download my CV"
            >
              Download CV
            </button>
            <button
              className="cta-btn tertiary"
              onClick={() => scrollToSection('contact')}
              aria-label="Contact me"
            >
              Let's Connect
            </button>
          </div>

          <div className="hero-social">
            <span className="social-label">Connect with me:</span>
            <div className="social-links">
              {heroData.socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label={`My ${link.name} profile`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT VISUAL COLUMN --- */}
        <div className="hero-visual">
          <div className="image-wrapper">
            <div className="bg-blobs">
              <div className="blob blob-1"></div>
              <div className="blob blob-2"></div>
              <div className="blob blob-3"></div>
            </div>
            <img
              src={profileImage}
              alt="Ganesh Adimalupu - AI/ML Engineer"
              className="hero-image"
              onError={handleImageError}
            />
          </div>

        </div>
      </div>

      {/* --- ACHIEVEMENTS & STATS SECTIONS --- */}
      <div
        className={`achievements-section ${showAchievements ? 'visible' : ''}`}
      >
        <div className="achievements-container">
          <h3>Key Achievements</h3>
          <div className="achievements-grid">
            {heroData.achievements.map((item) => (
              <div key={item.title} className="achievement-card">
                <span className="achievement-icon">{item.icon}</span>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
