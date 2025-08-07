// about.js
import React, { useState, useEffect, useRef } from 'react';
import './about.css';

// --- Custom Hook for observing visibility ---
// This hook encapsulates the Intersection Observer logic.
const useElementOnScreen = (options) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // If the element is intersecting (visible), update the state.
      if (entry.isIntersecting) {
        setIsVisible(true);
        // We can unobserve after it's visible to prevent re-triggering.
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

// --- Data (assuming it's here for simplicity) ---
const skills = [
  'React',
  'JavaScript (ES6+)',
  'Node.js',
  'Python',
  'TensorFlow',
  'PyTorch',
  'SQL & NoSQL',
  'Docker',
  'AWS',
  'CI/CD',
  'HTML5 & CSS3',
  'REST APIs',
];
const statsData = [
  { target: 3, label: 'Years Experience' },
  { target: 8, label: 'Major Projects' },
  { target: 32, label: 'Certifications' },
];

// --- Child Components ---
// (Your StatItem and AbstractVisual components can remain as they were)
const StatItem = ({ target, label }) => {
  // This counter can be simplified or enhanced to start on visibility
  return (
    <div className="stat-item">
      <h3>{target}+</h3>
      <p>{label}</p>
    </div>
  );
};

const AbstractVisual = () => (
  <div className="about-visual-wrapper">
    <svg
      viewBox="0 0 200 200"
      className="abstract-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* SVG content from your original file */}
      <defs>
        <linearGradient
          id="grad-purple-magenta"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: 'var(--glow-purple)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--glow-magenta)' }} />
        </linearGradient>
        <linearGradient
          id="grad-cyan-purple"
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" style={{ stopColor: 'var(--glow-cyan)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--glow-purple)' }} />
        </linearGradient>
      </defs>
      <g className="shape-1">
        <path
          fill="url(#grad-purple-magenta)"
          d="M48.2,-61.6C62.2,-52.3,73.1,-37.9,76.5,-22.1C80,-6.3,76,11,67.8,24.6C59.6,38.2,47.2,48.1,33.8,56.1C20.4,64.1,6,70.2,-8.1,70.8C-22.1,71.4,-35.9,66.5,-48.8,57.7C-61.7,48.9,-73.7,36.2,-78.3,21.1C-82.9,6,-80.1,-11.4,-71.9,-25.7C-63.7,-40,-50.1,-51.2,-36.2,-60.1C-22.3,-69,-8.1,-75.7,6.4,-77.9C20.9,-80.1,41.8,-77.8,48.2,-61.6Z"
          transform="translate(100 100) scale(0.9)"
        />
      </g>
      <g className="shape-2">
        <path
          fill="url(#grad-cyan-purple)"
          opacity="0.7"
          d="M39.9,-46.6C51.3,-33.4,59.9,-16.7,60.2,0.5C60.5,17.7,52.5,35.4,39.4,46.9C26.3,58.4,8.1,63.7,-9.8,62.2C-27.7,60.7,-45.3,52.4,-55.8,38.8C-66.3,25.2,-69.7,6.3,-65.5,-10.8C-61.3,-27.9,-49.5,-43.2,-35.3,-55.8C-21.1,-68.4,-4.5,-78.3,11.1,-76.7C26.7,-75.1,53.3,-62.1,39.9,-46.6Z"
          transform="translate(110 90) scale(0.8)"
        />
      </g>
      <g className="shape-3">
        <circle cx="50" cy="50" r="15" fill="var(--glow-cyan)" opacity="0.8" />
      </g>
    </svg>
  </div>
);

// --- Main About Component ---
const About = () => {
  // Use our custom hook to get a ref and the visibility state.
  // Trigger animation when section is 20% visible.
  const [containerRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: '0px',
    threshold: 0.2,
  });

  return (
    // 1. Attach the ref to the main section element.
    // 2. Dynamically add the 'is-visible' class when the state is true.
    <section
      id="about"
      className={`about-section ${isVisible ? 'is-visible' : ''}`}
      ref={containerRef}
    >
      <div className="about-container">
        <div className="about-header">
          <h2>About Me</h2>
          <p>A brief introduction to my background, passions, and skills.</p>
        </div>

        <div className="about-main-grid">
          <AbstractVisual />
          <div className="about-text-content">
            <h3>Passionate Developer, Creative Problem-Solver</h3>
            <p>
              Hello! I'm Ganesh, a Machine Learning Engineer based in India. My
              passion lies at the intersection of intelligent systems and clean,
              user-centric design.
            </p>
            <p>
              From developing complex algorithms to architecting scalable
              backend systems, I'm driven by a constant desire to learn and push
              the boundaries of what's possible with technology.
            </p>
            <ul className="skills-list">
              {skills.map((skill) => (
                <li key={skill} className="skill-item">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="stats-grid">
          {statsData.map((stat) => (
            <StatItem
              key={stat.label}
              target={stat.target}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
