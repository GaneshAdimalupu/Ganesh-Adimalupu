// components/footer/footer.js
import React from 'react';
import './footer.css';

const Footer = () => {
  const socialLinks = [
    {
      icon: '📧',
      url: 'mailto:ganeshadimalupu@disroot.org',
      label: 'Email',
      name: 'Email'
    },
    {
      icon: '💼',
      url: 'https://www.linkedin.com/in/GaneshAdimalupu/',
      label: 'LinkedIn',
      name: 'LinkedIn'
    },
    {
      icon: '🐙',
      url: 'https://github.com/GaneshAdimalupu',
      label: 'GitHub',
      name: 'GitHub'
    },
    {
      icon: '🐦',
      url: 'https://x.com/John56247240',
      label: 'x',
      name: 'x'
    }
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Ganesh Adimalupu</h3>
          <p>
            Full Stack Developer & AI Engineer passionate about creating
            innovative solutions and exceptional user experiences.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <button
                  onClick={() => scrollToSection(link.href)}
                  className="footer-link"
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect With Me</h4>
          <div className="social-links">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="social-link"
                aria-label={link.label}
                title={link.name}
                target={link.url.startsWith('http') ? '_blank' : '_self'}
                rel={link.url.startsWith('http') ? 'noopener noreferrer' : ''}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Ganesh Adimalupu. All rights reserved.</p>
        <p>Built with React.js ⚛️</p>
      </div>
    </footer>
  );
};

export default Footer;
