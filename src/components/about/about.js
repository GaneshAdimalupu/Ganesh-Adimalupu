import React, { useState, useEffect, useRef } from 'react';
import './about.css';

// === SVG ICONS ===
const icons = {
  ml: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3"/>
      <path d="M8 21H5a2 2 0 0 1-2-2v-3m18 0v3a2 2 0 0 1-2 2h-3"/>
      <path d="M8 12a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1Z"/>
      <path d="M12 8v8"/>
    </svg>
  ),
  fullstack: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 17V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10"/>
      <path d="M4 17h16"/>
      <path d="M6 21h12"/>
    </svg>
  ),
  data: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20V10"/>
      <path d="M18 20V4"/>
      <path d="M6 20v-4"/>
    </svg>
  ),
  cloud: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
    </svg>
  ),
};

// === CUSTOM HOOKS ===
const useIntersectionObserver = (options) => {
  const [entry, setEntry] = useState(null);
  const [node, setNode] = useState(null);
  const observer = useRef(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(([entry]) => setEntry(entry), options);
    if (node) observer.current.observe(node);
    return () => observer.current.disconnect();
  }, [node, options]);

  return [setNode, entry];
};

const useAnimatedCounter = (target, isVisible) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const animationFrameId = useRef();

  useEffect(() => {
    if (isVisible) {
      const startTime = Date.now();
      const duration = 2000;

      const animate = () => {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < duration) {
          const progress = elapsedTime / duration;
          countRef.current = Math.min(target, Math.ceil(target * progress));
          setCount(countRef.current);
          animationFrameId.current = requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };

      animationFrameId.current = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [target, isVisible]);

  return count;
};


// === DATA ===
const skillsData = [
  { icon: icons.ml, title: 'Machine Learning', description: 'Expertise in ML algorithms, neural networks, and AI model development.' },
  { icon: icons.fullstack, title: 'Full Stack Development', description: 'Proficient in modern web tech, from React to Node.js and databases.' },
  { icon: icons.data, title: 'Data Science', description: 'Advanced data analysis, visualization, and statistical modeling.' },
  { icon: icons.cloud, title: 'Cloud & DevOps', description: 'Experience with cloud platforms, containerization, and CI/CD pipelines.' }
];

const timelineData = [
    { year: '2018', title: 'Started University', description: 'Began my B.Tech in Computer Science, diving deep into foundational concepts.' },
    { year: '2020', title: 'First Internship', description: 'Gained practical experience as a web development intern at a startup.' },
    { year: '2021', title: 'AI/ML Specialization', description: 'Focused my studies and projects on Machine Learning and Data Science.' },
    { year: '2022', title: 'Graduated & First Job', description: 'Joined a leading tech company as a Junior Software Engineer.' },
];


// === CHILD COMPONENTS ===
const SkillCard = ({ icon, title, description, delay }) => (
  <div className="skill-card" style={{ transitionDelay: `${delay}s` }}>
    <div className="icon">{icon}</div>
    <h4>{title}</h4>
    <p>{description}</p>
  </div>
);

const StatCard = ({ target, label, isVisible, delay }) => {
  const count = useAnimatedCounter(target, isVisible);
  return (
    <div className="stat-card" style={{ transitionDelay: `${delay}s` }}>
      <h3>{count}+</h3>
      <p>{label}</p>
    </div>
  );
};

const Timeline = ({ data }) => (
    <div className="timeline-container">
        {data.map((item, index) => (
            <div
                className="timeline-item"
                key={index}
                style={{ animationDelay: `${0.5 + index * 0.3}s` }}
            >
                <div className="timeline-content">
                    <span className="year">{item.year}</span>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                </div>
            </div>
        ))}
    </div>
);


// === MAIN COMPONENT ===
const About = () => {
  const [sectionRef, sectionEntry] = useIntersectionObserver({ threshold: 0.2 }); // Adjusted threshold
  const isVisible = sectionEntry ? sectionEntry.isIntersecting : false;

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`about-section ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="about-container">
        <h2>About Me & My Journey</h2>

        <div className="about-content-grid">
          <div className="about-text-content">
            <p className="intro">
              I'm a passionate Machine Learning Engineer and Full Stack Developer with a deep commitment to creating innovative, high-impact solutions.
            </p>
            <p className="details">
              My journey in technology is driven by a curiosity for intelligent systems, leading me to specialize in building end-to-end applications that merge cutting-edge machine learning with robust, scalable, and user-friendly design.
            </p>
            <div className="skills-grid">
              {skillsData.map((skill, index) => (
                <SkillCard key={skill.title} {...skill} delay={index * 0.1} />
              ))}
            </div>
          </div>
          <Timeline data={timelineData} />
        </div>

        <div className="stats-grid">
          <StatCard target={8} label="Major Projects" isVisible={isVisible} delay={0} />
          <StatCard target={32} label="Certifications" isVisible={isVisible} delay={0.1} />
          <StatCard target={3} label="Years Experience" isVisible={isVisible} delay={0.2} />
        </div>

        <div className="about-cta">
          <h3>Ready to Build Together?</h3>
          <p>
            I'm always excited to collaborate on innovative projects. Let's discuss how we can bring your ideas to life with cutting-edge technology.
          </p>
          <button
            className="cta-button"
            onClick={() => scrollToSection('contact')}
            aria-label="Scroll to contact section"
          >
            Let's Connect
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
