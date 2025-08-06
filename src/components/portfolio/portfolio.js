import React, { useState, useEffect, useRef } from 'react';
import './portfolio.css';

// --- Custom Hooks ---
// Import your images
import bestPaperCert from '../../assets/images/best pap cer.jpg';
import portfolioImage from '../../assets/images/portfolio.png';
import digit from '../../assets/images/digit.png';
import snehaDeepaImage from '../../assets/images/sneha deepa.png';
import faceRecognitionImage from '../../assets/images/face recog.jpeg';

// Hook to track element visibility for animations
const useIntersectionObserver = (options) => {
    const [elements, setElements] = useState([]);
    const observer = useRef(null);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: unobserve after first intersection
                    observer.current.unobserve(entry.target);
                }
            });
        }, options);

        elements.forEach(el => {
            if (el) observer.current.observe(el);
        });

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [elements, options]);

    return setElements;
};

// --- Data ---
// Replaced local image imports with placeholder URLs.
// To use your local images, you can import them at the top of the file like so:
// import bestPaperCert from './assets/images/best_pap_cer.jpg';
// And then use the variable, e.g., image: bestPaperCert,
const portfolioData = [
  {
    id: 1,
    title: 'Smart Food Recommendation System',
    description: 'An award-winning intelligent system using ML to recommend food. Presented at an IEEE conference and won Best Paper.',
    image: bestPaperCert,
    category: 'AI/ML',
    tags: ['Machine Learning', 'Python', 'IEEE'],
    liveDemo: '#',
    githubRepo: 'https://github.com/GaneshAdimalupu/be-my-chef',
  },
  {
    id: 2,
    title: 'Handwritten Digit Recognition',
    description: 'A Deep Learning model using TensorFlow and Keras to classify handwritten digits from the MNIST dataset with high accuracy.',
    image: digit ,
    category: 'AI/ML',
    tags: ['TensorFlow', 'Keras', 'CNN'],
    liveDemo: '#',
    githubRepo: 'https://github.com/GaneshAdimalupu/CNN-Tensorflow',
  },
  {
    id: 3,
    title: 'Hospital Management System',
    description: 'A full-stack hospital management web app for patient registration, appointments, and secure digital record keeping.',
    image: snehaDeepaImage,
    category: 'Web Dev',
    tags: ['React', 'Node.js', 'MongoDB'],
    liveDemo: '#',
    githubRepo: 'https://github.com/GaneshAdimalupu/sneha-deepa-hospital',
  },
  {
    id: 4,
    title: 'Modern React Portfolio',
    description: 'This personal portfolio, built with React. Features a clean UI, dark theme, responsive design, and interactive components.',
    image: portfolioImage,
    category: 'Web Dev',
    tags: ['React', 'CSS3', 'UI/UX'],
    liveDemo: '#',
    githubRepo: 'https://github.com/GaneshAdimalupu/portfolio',
  },
  {
    id: 5,
    title: 'Face Recognition Evaluation',
    description: 'A robust platform for benchmarking face recognition models, providing tools for dataset management and performance analytics.',
    image: faceRecognitionImage,
    category: 'AI/ML',
    tags: ['Python', 'OpenCV', 'scikit-learn'],
    liveDemo: '#',
    githubRepo: 'https://github.com/GaneshAdimalupu/face-recognition-evaluation',
  },
];

const filterCategories = ['All', 'AI/ML', 'Web Dev'];

// --- Child Components ---

const PortfolioCard = React.forwardRef(({ project }, ref) => {
    const handleImageError = (e) => {
        e.target.src = `https://placehold.co/600x400/1a0f23/f0e6f0?text=Project`;
    };

    return (
        <div className="portfolio-card" ref={ref}>
            <div className="card-image-wrapper">
                <img src={project.image} alt={project.title} className="card-image" onError={handleImageError} loading="lazy" />
            </div>
            <div className="card-content">
                <h3>{project.title}</h3>
                <p className="card-description">{project.description}</p>
                <div className="card-tags">
                    {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>
                <div className="card-links">
                    {project.liveDemo !== '#' && (
                        <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="card-link">
                            Live Demo <span>&rarr;</span>
                        </a>
                    )}
                    <a href={project.githubRepo} target="_blank" rel="noopener noreferrer" className="card-link">
                        GitHub <span>&rarr;</span>
                    </a>
                </div>
            </div>
        </div>
    );
});

// --- Main Portfolio Component ---

const Portfolio = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const setObservedElements = useIntersectionObserver({ threshold: 0.1 });

    // This state will hold the projects to be rendered
    const [displayedProjects, setDisplayedProjects] = useState(portfolioData);
    const gridRef = useRef(null);

    // Update displayed projects when the filter changes
    useEffect(() => {
        if (activeFilter === 'All') {
            setDisplayedProjects(portfolioData);
        } else {
            setDisplayedProjects(portfolioData.filter(p => p.category === activeFilter));
        }
    }, [activeFilter]);

    // Observe new cards when the displayed projects change
    useEffect(() => {
        if (gridRef.current) {
            const elements = Array.from(gridRef.current.children);
            setObservedElements(elements);
        }
    }, [displayedProjects, setObservedElements]);

    return (
        <section id="portfolio" className="portfolio-section">
            <div className="portfolio-container">
                <div className="portfolio-header">
                    <h2>My Portfolio</h2>
                    <p>A showcase of my projects in AI, Machine Learning, and Web Development.</p>
                </div>

                <div className="filter-buttons">
                    {filterCategories.map(category => (
                        <button
                            key={category}
                            className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                            onClick={() => setActiveFilter(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="portfolio-grid" ref={gridRef}>
                    {displayedProjects.map((project) => (
                        <PortfolioCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
