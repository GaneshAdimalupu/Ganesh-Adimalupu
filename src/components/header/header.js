import React, { useState, useEffect, useRef } from 'react';
import './header.css';

// --- Custom Hooks ---

// Hook to detect scroll position
const useScroll = (threshold = 10) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > threshold);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return isScrolled;
};

// Hook to track the active section in the viewport
const useScrollSpy = (sectionIds, options) => {
    const [activeSection, setActiveSection] = useState(null);
    const observer = useRef(null);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, options);

        sectionIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) observer.current.observe(element);
        });

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [sectionIds, options]);

    return activeSection;
};

// Hook to handle clicks outside a referenced element
const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
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

    // Added missing nav items
    const navItems = ['home', 'about', 'portfolio', 'certifications', 'schedule', 'contact'];
    const activeSection = useScrollSpy(navItems, { rootMargin: '-30% 0px -70% 0px' });

    const headerRef = useRef();
    useOnClickOutside(headerRef, () => setIsMenuOpen(false));

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setIsMenuOpen(false);
        }
    };

    // Prevent body scroll when mobile menu is open - only for fullscreen menus
    // Not needed for dropdown, so this is removed.

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <nav className="nav-container" ref={headerRef}>
                {/* Updated logo text */}
                <a href="#home" className="logo" onClick={() => scrollToSection('home')}>
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
                </ul>
            </nav>
        </header>
    );
};

export default Header;
