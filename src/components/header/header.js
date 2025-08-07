import React, { useState, useEffect, useRef } from 'react';
import './header.css';

// --- Custom Hooks ---

const useScroll = (threshold = 10) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);
  return isScrolled;
};

const useScrollSpy = (sectionIds, options) => {
  const [activeSection, setActiveSection] = useState(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, options);
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [sectionIds, options]);
  return activeSection;
};

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

// --- Main Header Component ---

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrolled = useScroll(50);
  const navItems = [
    'home',
    'about',
    'projects',
    'certifications',
    'schedule',
    'contact',
  ];
  const activeSection = useScrollSpy(navItems, {
    rootMargin: '-30% 0px -70% 0px',
  });
  const headerRef = useRef();
  useOnClickOutside(headerRef, () => setIsMenuOpen(false));

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="nav-container" ref={headerRef}>
        <a
          href="#home"
          className="logo"
          onClick={() => scrollToSection('home')}
        >
          Ganesh <span>Adimalupu</span>
        </a>

        <button
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <li key={item}>
              <button
                className={activeSection === item ? 'active' : ''}
                onClick={() => scrollToSection(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            </li>
          ))}

          {/* --- ADDED RESUME BUTTON HERE --- */}
          <li>
            <a
              href="/Ganesh-Adimalupu-Resume.pdf"
              className="resume-btn"
              download="Ganesh Adimalupu - Resume.pdf"
            >
              Resume
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
