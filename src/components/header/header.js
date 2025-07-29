// components/header/header.js
import React, { useState, useEffect } from 'react';
import './header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <nav className="nav">
        <a href="#" className="logo">Ganesh Adimalupu</a>

        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><button onClick={() => scrollToSection('home')}>Home</button></li>
          <li><button onClick={() => scrollToSection('about')}>About</button></li>
          <li><button onClick={() => scrollToSection('portfolio')}>Portfolio</button></li>
          <li><button onClick={() => scrollToSection('certifications')}>Certifications</button></li>
          <li><button onClick={() => scrollToSection('schedule')}>Schedule</button></li>
          <li><button onClick={() => scrollToSection('contact')}>Contact</button></li>
        </ul>

        <button className="menu-toggle" onClick={toggleMobileMenu}>
          ☰
        </button>
      </nav>
    </header>
  );
};

export default Header;
