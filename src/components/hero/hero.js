import React, { useState, useEffect, useRef } from 'react';
import './hero.css'; // Ensure this CSS file is imported
import profileImage from '../../assets/images/profile.webp'; // Uncomment this to use your local image

// Custom hook for the typing effect
const useTypingEffect = (text, duration = 100, isStarted = true) => {
    const [currentText, setCurrentText] = useState('');
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        if (!isStarted || !text) return;

        setCurrentText('');
        setIsDone(false);
        let i = 0;
        const timer = setInterval(() => {
            setCurrentText(prev => prev + text.charAt(i));
            i++;
            if (i >= text.length) {
                clearInterval(timer);
                setIsDone(true);
            }
        }, duration);

        return () => clearInterval(timer);
    }, [text, duration, isStarted]);

    return [currentText, isDone];
};

const Hero = () => {
    const [isMounted, setIsMounted] = useState(false);
    const heroVisualRef = useRef(null);
    const fullRoleText = 'Machine Learning Engineer';
    const [roleText, isTypingDone] = useTypingEffect(fullRoleText, 100, isMounted);

    // Set component as mounted after initial render
    useEffect(() => {
        setIsMounted(true);

        const heroVisualNode = heroVisualRef.current;
        if (!heroVisualNode) return;

        // Mouse tracking for parallax effect, optimized with CSS variables
        const handleMouseMove = (e) => {
            if (window.innerWidth <= 768) return;
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth) - 0.5;
            const y = (clientY / window.innerHeight) - 0.5;
            heroVisualNode.style.setProperty('--mouse-x', x);
            heroVisualNode.style.setProperty('--mouse-y', y);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Function to scroll to a specific section
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Fallback for profile image
    const handleImageError = (e) => {
        e.target.src = `https://placehold.co/400x400/1a0f23/f0e6f0?text=GA`;
    };

    return (
        <section id="home" className="hero">
            <div className="hero-container">
                {/* Left Content */}
                <div className="hero-content">
                    <div className="greeting-badge">
                        <span className="wave" role="img" aria-label="waving hand">👋</span>
                        <span>Hello, I'm Ganesh!</span>
                    </div>

                    <h1 className="hero-title">
                        A Creative <span className="name-highlight">Developer</span> From India
                        <span className="role">
                            {roleText}
                            {!isTypingDone && <span className="cursor" />}
                        </span>
                    </h1>

                    <p className="hero-description">
                        I build intelligent and beautiful web applications. From machine learning models to pixel-perfect user interfaces, I love turning complex problems into elegant solutions.
                    </p>

                    <div className="hero-buttons">
                        <button
                            className="cta-btn primary"
                            onClick={() => scrollToSection('about')}
                            aria-label="Find out more about me"
                        >
                            <span>More About Me</span>
                            <span>&rarr;</span>
                        </button>
                        <button
                            className="cta-btn secondary"
                            onClick={() => scrollToSection('contact')} // Assuming a contact section exists
                            aria-label="Contact me"
                        >
                            Contact
                        </button>
                    </div>
                </div>

                {/* Right Content - Visual */}
                <div className="hero-visual" ref={heroVisualRef}>
                    <div className="image-wrapper">
                        <div className="bg-blobs">
                            <div className="blob blob-1"></div>
                            <div className="blob blob-2"></div>
                        </div>
                        <img
                             src={profileImage}
                            //src="https://placehold.co/400x400/0D0D0D/f0e6f0?text=Ganesh" // Placeholder image
                            alt="Ganesh Adimalupu - Machine Learning Engineer"
                            className="hero-image"
                            onError={handleImageError}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
