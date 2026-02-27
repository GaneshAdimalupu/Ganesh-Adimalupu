import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './header.css';

const useScroll = (threshold = 10) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);
  return isScrolled;
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
  const headerRef = useRef();
  useOnClickOutside(headerRef, () => setIsMenuOpen(false));

  const navLinks = [
    { path: '/', label: 'Home', end: true },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    { path: '/certifications', label: 'Certifications' },
    { path: '/contact', label: 'Contact' },
  ];

  const downloadCV = (e) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = '/Ganesh-CV.pdf';
    link.download = 'Ganesh_Adimalupu_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="nav-container" ref={headerRef}>
        <NavLink
          to="/"
          className={({ isActive }) => `logo logo-link ${isActive ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Ganesh <span>Adimalupu</span>
        </NavLink>

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
          {navLinks.map(({ path, label, end }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li>
            <a href="/Ganesh-CV.pdf" className="resume-btn" download="Ganesh_Adimalupu_CV.pdf" onClick={downloadCV}>
              Resume
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
