// components/about/about.js
import React from 'react';
import './about.css';

const About = () => {

  const stats = [
    { number: '8+', label: 'Projects Completed' },
    { number: '32+', label: 'Certifications Earned' },
    { number: '1', label: 'Years Experience' },
  ];

  return (
    <section id="about" className="section">
      <div className="container">
        <h2>About Me</h2>
        <div className="about-content">
          <div className="about-text">
            <p className="section-text">
              I'm a passionate Full Stack Developer and AI Engineer with over 3 years of experience
              in creating innovative digital solutions. I specialize in building modern web applications,
              implementing AI/ML solutions, and delivering exceptional user experiences.
            </p>
            <p className="section-text">
              My journey in technology started with a curiosity about how things work, which led me
              to pursue computer science and develop expertise in both frontend and backend technologies.
              I'm always eager to learn new technologies and take on challenging projects.
            </p>
          </div>

          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
