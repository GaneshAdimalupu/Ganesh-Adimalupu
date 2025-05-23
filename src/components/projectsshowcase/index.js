// FILE: src/components/projectsshowcase/index.js

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  memo
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaTimes, FaSpinner } from "react-icons/fa";
import "./style.css";

// Custom hooks for mobile optimization
const useMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);
  const [touchDevice, setTouchDevice] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth <= breakpoint;
      const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(mobile);
      setTouchDevice(touch);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, [breakpoint]);

  return { isMobile, touchDevice };
};

const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isIntersecting];
};

// Touch gesture hook for mobile interactions
const useTouchGestures = (onSwipeLeft, onSwipeRight) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(false);
  }, []);

  const onTouchMove = useCallback((e) => {
    if (!touchStart) return;

    const currentTouch = e.targetTouches[0].clientX;
    const distance = Math.abs(currentTouch - touchStart);

    if (distance > 10) {
      setIsDragging(true);
    }

    setTouchEnd(currentTouch);
  }, [touchStart]);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd || !isDragging) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsDragging(false);
  }, [touchStart, touchEnd, isDragging, onSwipeLeft, onSwipeRight]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isDragging
  };
};

// Performance monitoring hook
const usePerformanceMode = () => {
  const [performanceMode, setPerformanceMode] = useState('normal');

  useEffect(() => {
    const checkPerformance = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 2;
      const hasSlowConnection = navigator.connection &&
        ['slow-2g', '2g', '3g'].includes(navigator.connection.effectiveType);

      if (isMobile || hasLowMemory || hasSlowConnection) {
        setPerformanceMode('low');
      } else if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
        setPerformanceMode('medium');
      } else {
        setPerformanceMode('high');
      }
    };

    checkPerformance();
  }, []);

  return performanceMode;
};

// Optimized Project Card Component
const ProjectCard = memo(({
  project,
  onClick,
  isMobile,
  touchDevice,
  performanceMode,
  index
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [cardRef, isVisible] = useIntersectionObserver({ threshold: 0.3 });

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const handleCardClick = useCallback((e) => {
    e.preventDefault();
    onClick(project);
  }, [project, onClick]);

  // Optimized animation variants based on performance
  const cardVariants = useMemo(() => {
    const baseVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: performanceMode === 'low' ? 0.2 : 0.5,
          delay: performanceMode === 'low' ? 0 : index * 0.1
        }
      }
    };

    if (performanceMode === 'low' || touchDevice) {
      return baseVariants;
    }

    return {
      ...baseVariants,
      hover: {
        y: -10,
        transition: { duration: 0.3 }
      }
    };
  }, [performanceMode, touchDevice, index]);

  return (
    <motion.div
      ref={cardRef}
      className="project-card"
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover={!touchDevice ? "hover" : undefined}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      layout={performanceMode !== 'low'}
    >
      <div className="project-image">
        {!imageLoaded && !imageError && (
          <div className="image-skeleton">
            <div className="skeleton-shimmer"></div>
          </div>
        )}

        {!imageError ? (
          <img
            src={project.img}
            alt={project.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            decoding="async"
            style={{
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
        ) : (
          <div className="image-fallback">
            <span>{project.title.charAt(0)}</span>
          </div>
        )}

        {/* Overlay only on non-touch devices for performance */}
        {!touchDevice && performanceMode !== 'low' && (
          <div className="project-overlay">
            <div className="overlay-content">
              <h3>{project.title}</h3>
              <button
                className="view-project-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(project);
                }}
              >
                View Details
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="project-info">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <div className="project-tags">
          {project.categories?.slice(0, isMobile ? 2 : 3).map((category, idx) => (
            <span key={idx} className="project-tag">
              {category}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

// Optimized Modal Component with mobile enhancements
const ProjectModal = memo(({ project, isOpen, onClose, isMobile, touchDevice }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef(null);

  // Touch gestures for modal navigation
  const swipeHandlers = useTouchGestures(
    () => {
      // Swipe left - close modal or next image
      if (project?.gallery?.length > 1) {
        setCurrentImageIndex(prev =>
          prev < project.gallery.length - 1 ? prev + 1 : 0
        );
      }
    },
    () => {
      // Swipe right - previous image
      if (project?.gallery?.length > 1) {
        setCurrentImageIndex(prev =>
          prev > 0 ? prev - 1 : project.gallery.length - 1
        );
      }
    }
  );

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (project?.gallery?.length > 1) {
            setCurrentImageIndex(prev =>
              prev > 0 ? prev - 1 : project.gallery.length - 1
            );
          }
          break;
        case 'ArrowRight':
          if (project?.gallery?.length > 1) {
            setCurrentImageIndex(prev =>
              prev < project.gallery.length - 1 ? prev + 1 : 0
            );
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, project]);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Reset image index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen, project]);

  if (!project) return null;

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: isMobile ? 0.95 : 0.9,
      y: isMobile ? 20 : 0
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: isMobile ? 25 : 20,
        stiffness: isMobile ? 300 : 200
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: isMobile ? 20 : 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            ref={modalRef}
            className="project-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            {...(touchDevice ? swipeHandlers : {})}
          >
            <button
              className="close-modal"
              onClick={onClose}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>

            <div className="modal-content">
              <div
                className="modal-image"
                {...(touchDevice ? swipeHandlers : {})}
              >
                <img
                  src={project.gallery?.[currentImageIndex] || project.img}
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                  loading="lazy"
                />

                {/* Image navigation indicators for galleries */}
                {project.gallery?.length > 1 && (
                  <div className="image-indicators">
                    {project.gallery.map((_, idx) => (
                      <button
                        key={idx}
                        className={`indicator ${idx === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(idx)}
                        aria-label={`View image ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-details">
                <h2 id="modal-title" className="modal-title">
                  {project.title}
                </h2>

                <div className="modal-categories">
                  {project.categories?.map((category, index) => (
                    <span key={index} className="modal-category">
                      {category}
                    </span>
                  ))}
                </div>

                <div id="modal-description" className="modal-description">
                  <p>{project.fullDescription || project.description}</p>
                </div>

                {project.technologies && (
                  <div className="modal-tech">
                    <h4>Technologies</h4>
                    <div className="tech-stack">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="tech-item">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="modal-links">
                  {project.githubLink && (
                    <motion.a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-link github-link"
                      whileHover={!touchDevice ? { scale: 1.05 } : undefined}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaGithub /> GitHub
                    </motion.a>
                  )}
                  {project.link && (
                    <motion.a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-link demo-link"
                      whileHover={!touchDevice ? { scale: 1.05 } : undefined}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaExternalLinkAlt /> Live Demo
                    </motion.a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

// Optimized Filter Component
const ProjectFilter = memo(({
  categories,
  activeFilter,
  onFilterChange,
  isMobile,
  touchDevice
}) => {
  const [filterRef, isVisible] = useIntersectionObserver();

  const filterVariants = useMemo(() => ({
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  const buttonVariants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    tap: { scale: 0.95 }
  }), []);

  return (
    <motion.div
      ref={filterRef}
      className="filter-container"
      variants={filterVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {categories.map((category) => (
        <motion.button
          key={category}
          className={`filter-btn ${activeFilter === category ? "active" : ""}`}
          onClick={() => onFilterChange(category)}
          variants={buttonVariants}
          whileTap="tap"
          whileHover={!touchDevice ? { scale: 1.05 } : undefined}
        >
          {category}
        </motion.button>
      ))}
    </motion.div>
  );
});

// Main ProjectsShowcase Component
const ProjectsShowcase = ({ projects = [] }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [loading, setLoading] = useState(false);

  const { isMobile, touchDevice } = useMobile();
  const performanceMode = usePerformanceMode();

  // Memoized categories calculation
  const categories = useMemo(() => {
    const uniqueCategories = new Set();
    projects.forEach(project => {
      if (project.categories) {
        project.categories.forEach(cat => uniqueCategories.add(cat));
      }
    });
    return ["All", ...Array.from(uniqueCategories)];
  }, [projects]);

  // Optimized filtering with loading state
  const handleFilterChange = useCallback((newFilter) => {
    if (newFilter === filter) return;

    setLoading(true);
    setFilter(newFilter);

    // Add small delay on mobile for better UX
    const delay = isMobile ? 100 : 0;

    setTimeout(() => {
      const filtered = newFilter === "All"
        ? projects
        : projects.filter(project =>
            project.categories && project.categories.includes(newFilter)
          );

      setFilteredProjects(filtered);
      setLoading(false);
    }, delay);
  }, [filter, projects, isMobile]);

  // Modal handlers with body scroll management
  const openModal = useCallback((project) => {
    setSelectedProject(project);
    setModalOpen(true);
    document.body.style.overflow = "hidden";

    // Prevent background scroll on iOS
    if (isMobile) {
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    }
  }, [isMobile]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedProject(null);
    document.body.style.overflow = "auto";

    if (isMobile) {
      document.body.style.position = "";
      document.body.style.width = "";
    }
  }, [isMobile]);

  // Initialize filtered projects
  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, closeModal]);

  // Grid animation variants based on performance
  const gridVariants = useMemo(() => {
    if (performanceMode === 'low') {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      };
    }

    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: isMobile ? 0.1 : 0.15
        }
      }
    };
  }, [performanceMode, isMobile]);

  return (
    <section className="projects-section" role="main" aria-label="Projects showcase">
      <ProjectFilter
        categories={categories}
        activeFilter={filter}
        onFilterChange={handleFilterChange}
        isMobile={isMobile}
        touchDevice={touchDevice}
      />

      {loading && (
        <div className="loading-state" aria-live="polite">
          <FaSpinner className="loading-spinner" />
          <span>Filtering projects...</span>
        </div>
      )}

      <motion.div
        className="projects-grid"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        layout={performanceMode !== 'low'}
      >
        <AnimatePresence mode="wait">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={`${project.title}-${filter}`}
              project={project}
              onClick={openModal}
              isMobile={isMobile}
              touchDevice={touchDevice}
              performanceMode={performanceMode}
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProjects.length === 0 && !loading && (
        <motion.div
          className="no-projects"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          role="status"
          aria-live="polite"
        >
          <p>No projects found for "{filter}" category.</p>
        </motion.div>
      )}

      <ProjectModal
        project={selectedProject}
        isOpen={modalOpen}
        onClose={closeModal}
        isMobile={isMobile}
        touchDevice={touchDevice}
      />
    </section>
  );
};

export default memo(ProjectsShowcase);
