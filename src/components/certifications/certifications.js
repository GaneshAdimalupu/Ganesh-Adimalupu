import React, { useState, useEffect, useRef } from 'react';
import './certifications.css';

// --- SVG Icons ---
const icons = {
  ml: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect x="4" y="12" width="16" height="8" rx="2"/><path d="M2 12h20"/><path d="M12 12v.01"/></svg>,
  devops: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 11v0"/></svg>,
  mobile: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2" width="10" height="20" rx="2" ry="2"/><path d="M12 18h.01"/></svg>,
  professional: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6m0 0v6m0-6h6m-6 0H14"/></svg>,
  online: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  workshop: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="m18 16 4-4"/><path d="m6 8-4 4 4 4"/><path d="m12 14 4 4"/><path d="m18 8-4 4"/></svg>,
  programming: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
};

// --- Data ---
const certificationsData = [
    { id: 1, title: 'Google Machine Learning Crash Course', provider: 'Google', category: 'ml', date: '2025', description: 'A comprehensive course from Google covering machine learning fundamentals, TensorFlow, and practical ML applications.', skills: ['Machine Learning', 'TensorFlow', 'Python', 'Data Science'], logo: icons.ml },
    { id: 2, title: 'DevOps & MLOps Participation', provider: 'Professional Workshop', category: 'devops', date: '2024', description: 'An advanced workshop on DevOps practices and MLOps for streamlined machine learning deployment and operations.', skills: ['DevOps', 'MLOps', 'CI/CD', 'Docker', 'Kubernetes'], logo: icons.devops },
    { id: 3, title: 'Android Development Webinar', provider: 'Tech Workshop', category: 'mobile', date: '2024', description: 'A comprehensive webinar covering modern Android app development, best practices, and mobile technologies.', skills: ['Android', 'Mobile Development', 'Java', 'Kotlin'], logo: icons.mobile },
    { id: 4, title: 'Professional Internship Program', provider: 'Edureka', category: 'professional', date: '2024', description: 'A hands-on internship program focusing on real-world project development and industry best practices.', skills: ['Project Management', 'Agile', 'Professional Development'], logo: icons.professional },
    { id: 5, title: 'Introduction to Neural Networks', provider: 'Academic Institution', category: 'ml', date: '2024', description: 'A deep dive into neural network architectures, deep learning concepts, and practical implementations with Python.', skills: ['Neural Networks', 'Deep Learning', 'AI', 'Python'], logo: icons.ml },
    { id: 6, title: 'Udemy Full-Stack Development', provider: 'Udemy', category: 'online', date: '2023', description: 'Completed an extensive course covering full-stack web development from front-end frameworks to back-end APIs.', skills: ['Web Development', 'React', 'Node.js', 'Full Stack'], logo: icons.online },
    { id: 7, title: 'Technology Workshop Series', provider: 'DevTown & Others', category: 'workshop', date: '2023', description: 'Active participation in multiple technology workshops and bootcamps focusing on emerging technologies.', skills: ['Workshop', 'Technology Trends', 'Networking'], logo: icons.workshop },
    { id: 8, title: 'Competitive Programming', provider: 'Various Platforms', category: 'programming', date: '2023', description: 'Achievements in competitive programming challenges and treasure hunt competitions, honing algorithmic skills.', skills: ['Problem Solving', 'Algorithms', 'Data Structures'], logo: icons.programming }
];

// --- Custom Hooks ---
const useIntersectionObserver = (options) => {
    const [elements, setElements] = useState([]);
    const observer = useRef(null);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.current.unobserve(entry.target);
                }
            });
        }, options);
        elements.forEach(el => {
            if (el) observer.current.observe(el);
        });
        return () => observer.current?.disconnect();
    }, [elements, options]);

    return setElements;
};

// --- Child Components ---

const CertificationCard = React.forwardRef(({ cert, onClick }, ref) => (
    <div className="cert-card" onClick={onClick} ref={ref}>
        <div className="card-header">
            <div className="card-icon">{cert.logo}</div>
            <div className="card-title-group">
                <h3>{cert.title}</h3>
                <p>{cert.provider}</p>
            </div>
        </div>
        <p className="card-description">
            {cert.description.length > 120 ? `${cert.description.substring(0, 120)}...` : cert.description}
        </p>
    </div>
));

const CertificationModal = ({ cert, onClose }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <div className="modal-header">
                    <div className="card-icon">{cert.logo}</div>
                    <h2>{cert.title}</h2>
                    <p>Issued by {cert.provider} &bull; {cert.date}</p>
                </div>
                <div className="modal-body">
                    <h4>About this certification</h4>
                    <p>{cert.description}</p>
                    <h4>Skills Covered</h4>
                    <div className="modal-tags">
                        {cert.skills.map(skill => <span key={skill} className="tag">{skill}</span>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Certifications Component ---

const Certifications = () => {
    const [selectedCert, setSelectedCert] = useState(null);
    const setObservedElements = useIntersectionObserver({ threshold: 0.1 });
    const cardRefs = useRef([]);

    useEffect(() => {
        cardRefs.current = cardRefs.current.slice(0, certificationsData.length);
        setObservedElements(cardRefs.current);
    }, []);

    return (
        <>
            <section id="certifications" className="certifications-section">
                <div className="certifications-container">
                    <div className="certifications-header">
                        <h2>My Certifications</h2>
                        <p>A collection of my professional certifications and completed courses, reflecting my commitment to continuous learning.</p>
                    </div>
                    <div className="certifications-grid">
                        {certificationsData.map((cert, index) => (
                            <CertificationCard
                                key={cert.id}
                                cert={cert}
                                onClick={() => setSelectedCert(cert)}
                                ref={el => cardRefs.current[index] = el}
                            />
                        ))}
                    </div>
                </div>
            </section>
            {selectedCert && <CertificationModal cert={selectedCert} onClose={() => setSelectedCert(null)} />}
        </>
    );
};

export default Certifications;
