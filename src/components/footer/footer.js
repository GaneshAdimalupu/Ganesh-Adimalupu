import React from 'react';
import './footer.css';

// --- SVG Icons ---
const icons = {
  email: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
  linkedin: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>,
  github: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>,
  twitter: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>,
};

// --- Data ---
const socialLinks = [
    { icon: icons.email, url: 'mailto:ganeshadimalupu@disroot.org', label: 'Email' },
    { icon: icons.linkedin, url: 'https://www.linkedin.com/in/GaneshAdimalupu/', label: 'LinkedIn' },
    { icon: icons.github, url: 'https://github.com/GaneshAdimalupu', label: 'GitHub' },
    { icon: icons.twitter, url: 'https://x.com/John56247240', label: 'Twitter' }
];

const quickLinks = ['home', 'about', 'projects', 'contact'];

// --- Main Footer Component ---
const Footer = () => {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-about">
                        <h3>Ganesh Adimalupu</h3>
                        <p>
                            A passionate developer from India, crafting intelligent solutions and beautiful digital experiences.
                        </p>
                    </div>
                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            {quickLinks.map((link) => (
                                <li key={link}>
                                    <button onClick={() => scrollToSection(link)}>
                                        {link.charAt(0).toUpperCase() + link.slice(1)}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>Connect</h4>
                        <div className="social-links">
                            {socialLinks.map((link) => (
                                <a key={link.label} href={link.url} className="social-link" aria-label={link.label} target="_blank" rel="noopener noreferrer">
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Ganesh Adimalupu. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
