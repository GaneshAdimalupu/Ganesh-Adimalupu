// components/header/header.js - Beautiful Desktop & Mobile Header
import React, { useState, useEffect } from 'react';
import './header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section detection for navigation highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'portfolio', 'certifications', 'schedule', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);

    // Prevent body scroll when menu is open
    if (!isMobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove('menu-open');
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Close mobile menu first
      closeMobileMenu();

      // Small delay to allow menu closing animation
      setTimeout(() => {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, isMobileMenuOpen ? 300 : 0);
    }
  };

  // Handle CTA button click
  const handleCTAClick = () => {
    scrollToSection('contact');
  };

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'about', label: 'About', icon: '👨‍💻' },
    { id: 'portfolio', label: 'Portfolio', icon: '💼' },
    { id: 'certifications', label: 'Certifications', icon: '🏆' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'contact', label: 'Contact', icon: '📧' }
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <nav className="nav">
        {/* Logo */}
        <a
          href="#"
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}
          aria-label="Ganesh Adimalupu - Go to home"
        >
          Ganesh Adimalupu
        </a>

        {/* Desktop Navigation */}
        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {isMobileMenuOpen && (
            <button
              className="menu-close"
              onClick={closeMobileMenu}
              aria-label="Close navigation menu"
            >
              ×
            </button>
          )}

          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={activeSection === item.id ? 'active' : ''}
                onClick={() => scrollToSection(item.id)}
                aria-label={`Navigate to ${item.label} section`}
              >
                <span className="nav-icon" style={{ marginRight: '0.5rem' }}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            </li>
          ))}

          {/* Mobile CTA Button */}
          {isMobileMenuOpen && (
            <button
              className="mobile-cta"
              onClick={handleCTAClick}
              aria-label="Get in touch"
            >
              Let's Work Together
            </button>
          )}
        </ul>

        {/* Desktop CTA Button */}
        <button
          className="header-cta"
          onClick={handleCTAClick}
          aria-label="Get in touch"
        >
          Let's Talk
        </button>

        {/* Mobile Menu Toggle */}
        <button
          className={`menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </nav>
    </header>
  );
};

export default Header;
