// FILE: src/pages/portfolio/index.js

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  memo
} from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { dataportfolio, meta } from "../../content_option";
import ProjectsShowcase from "../../components/projectsshowcase";
import "./style.css";

// Custom hooks for enhanced functionality
const useMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width <= breakpoint);

      if (width <= 576) setScreenSize('mobile-small');
      else if (width <= 768) setScreenSize('mobile');
      else if (width <= 991) setScreenSize('tablet');
      else setScreenSize('desktop');
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return { isMobile, screenSize };
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

// Enhanced Search Component
const ProjectSearch = memo(({ onSearch, searchTerm, isMobile }) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [isActive, setIsActive] = useState(false);
  const searchTimeoutRef = useRef(null);

  const handleSearch = useCallback((value) => {
    setLocalSearch(value);

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      onSearch(value);
    }, 300);
  }, [onSearch]);

  const clearSearch = useCallback(() => {
    setLocalSearch('');
    onSearch('');
    setIsActive(false);
  }, [onSearch]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      className={`search-container ${isActive ? 'active' : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="search-input-wrapper">
        <svg
          className="search-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
        </svg>

        <input
          type="text"
          placeholder={isMobile ? "Search projects..." : "Search projects by name, technology, or category..."}
          value={localSearch}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          className="search-input"
        />

        {localSearch && (
          <motion.button
            className="clear-search"
            onClick={clearSearch}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </motion.button>
        )}
      </div>

      {localSearch && (
        <motion.div
          className="search-results-count"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* This will be updated by parent component */}
        </motion.div>
      )}
    </motion.div>
  );
});

// Enhanced Filter Tags Component
const FilterTags = memo(({
  categories,
  activeFilter,
  onFilterChange,
  isMobile,
  projectCounts
}) => {
  const [filterRef, isVisible] = useIntersectionObserver();

  const filterVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  }), []);

  const tagVariants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  }), []);

  return (
    <motion.div
      ref={filterRef}
      className="filter-tags-container"
      variants={filterVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <div className="filter-tags">
        {categories.map((category) => (
          <motion.button
            key={category}
            className={`filter-tag ${activeFilter === category ? "active" : ""}`}
            onClick={() => onFilterChange(category)}
            variants={tagVariants}
            whileHover={!isMobile ? { scale: 1.05, y: -2 } : undefined}
            whileTap={{ scale: 0.95 }}
          >
            <span className="tag-text">{category}</span>
            {projectCounts[category] && (
              <span className="tag-count">{projectCounts[category]}</span>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
});

// Sort Options Component
const SortOptions = memo(({ sortBy, onSortChange, isMobile }) => {
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Alphabetical' },
    { value: 'category', label: 'By Category' }
  ];

  return (
    <motion.div
      className="sort-container"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <label htmlFor="sort-select" className="sort-label">
        {isMobile ? 'Sort:' : 'Sort by:'}
      </label>
      <select
        id="sort-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="sort-select"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </motion.div>
  );
});

// View Mode Toggle Component
const ViewModeToggle = memo(({ viewMode, onViewModeChange, isMobile }) => {
  const viewModes = [
    {
      mode: 'grid',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
          <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Grid View'
    },
    {
      mode: 'list',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/>
          <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2"/>
          <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2"/>
          <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'List View'
    }
  ];

  if (isMobile) return null; // Hide on mobile

  return (
    <motion.div
      className="view-mode-toggle"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {viewModes.map((mode) => (
        <motion.button
          key={mode.mode}
          className={`view-mode-btn ${viewMode === mode.mode ? 'active' : ''}`}
          onClick={() => onViewModeChange(mode.mode)}
          title={mode.label}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {mode.icon}
        </motion.button>
      ))}
    </motion.div>
  );
});

// Project Analytics Component
const ProjectAnalytics = memo(({ projects, filteredProjects }) => {
  const analytics = useMemo(() => {
    const totalProjects = projects.length;
    const filteredCount = filteredProjects.length;
    const categories = [...new Set(projects.flatMap(p => p.categories || []))];
    const technologies = [...new Set(projects.flatMap(p => p.technologies || []))];

    return {
      total: totalProjects,
      filtered: filteredCount,
      categories: categories.length,
      technologies: technologies.length
    };
  }, [projects, filteredProjects]);

  return (
    <motion.div
      className="project-analytics"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="analytics-grid">
        <div className="analytics-item">
          <span className="analytics-number">{analytics.filtered}</span>
          <span className="analytics-label">
            {analytics.filtered === analytics.total ? 'Total Projects' : 'Filtered Results'}
          </span>
        </div>
        <div className="analytics-item">
          <span className="analytics-number">{analytics.categories}</span>
          <span className="analytics-label">Categories</span>
        </div>
        <div className="analytics-item">
          <span className="analytics-number">{analytics.technologies}</span>
          <span className="analytics-label">Technologies</span>
        </div>
      </div>
    </motion.div>
  );
});

// Main Portfolio Component
export const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [filteredProjects, setFilteredProjects] = useState(dataportfolio);
  const [isLoading, setIsLoading] = useState(false);

  const { isMobile, screenSize } = useMobile();

  // Memoized categories with project counts
  const { categories, projectCounts } = useMemo(() => {
    const categorySet = new Set();
    const counts = { "All": dataportfolio.length };

    dataportfolio.forEach(project => {
      if (project.categories) {
        project.categories.forEach(cat => {
          categorySet.add(cat);
          counts[cat] = (counts[cat] || 0) + 1;
        });
      }
    });

    return {
      categories: ["All", ...Array.from(categorySet)],
      projectCounts: counts
    };
  }, []);

  // Advanced filtering and sorting
  const filterAndSortProjects = useCallback(() => {
    setIsLoading(true);

    // Add slight delay for better UX
    setTimeout(() => {
      let filtered = [...dataportfolio];

      // Apply category filter
      if (activeFilter !== "All") {
        filtered = filtered.filter(project =>
          project.categories && project.categories.includes(activeFilter)
        );
      }

      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(project => {
          const titleMatch = project.title.toLowerCase().includes(searchLower);
          const descMatch = project.description.toLowerCase().includes(searchLower);
          const categoryMatch = project.categories?.some(cat =>
            cat.toLowerCase().includes(searchLower)
          );
          const techMatch = project.technologies?.some(tech =>
            tech.toLowerCase().includes(searchLower)
          );

          return titleMatch || descMatch || categoryMatch || techMatch;
        });
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          // Assuming projects are already in newest-first order
          break;
        case 'oldest':
          filtered.reverse();
          break;
        case 'name':
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'category':
          filtered.sort((a, b) => {
            const catA = a.categories?.[0] || 'Z';
            const catB = b.categories?.[0] || 'Z';
            return catA.localeCompare(catB);
          });
          break;
        default:
          break;
      }

      setFilteredProjects(filtered);
      setIsLoading(false);
    }, isMobile ? 100 : 200);
  }, [activeFilter, searchTerm, sortBy, isMobile]);

  // Effect to trigger filtering
  useEffect(() => {
    filterAndSortProjects();
  }, [filterAndSortProjects]);

  // Handle filter change
  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);

  // Handle search
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((sort) => {
    setSortBy(sort);
  }, []);

  // Handle view mode change
  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }), []);

  return (
    <HelmetProvider>
      <Container className="portfolio-page">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} - Portfolio</title>
          <meta name="description" content={`Explore ${meta.title}'s portfolio of AI/ML projects, featuring machine learning applications, deep learning solutions, and innovative AI implementations.`} />

          {/* OpenGraph tags */}
          <meta property="og:title" content={`${meta.title} - Portfolio`} />
          <meta property="og:description" content="Explore my portfolio of AI/ML projects, featuring machine learning applications and innovative solutions." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://ganeshadimalupu.github.io/Ganesh-Adimalupu/portfolio" />

          {/* Keywords */}
          <meta name="keywords" content="Ganesh Adimalupu, Portfolio, Machine Learning Projects, AI Applications, Deep Learning, Python Projects, Data Science Portfolio" />
        </Helmet>

        {/* Page Header */}
        <motion.div
          className="portfolio-header"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="portfolio-title">My Portfolio</h1>
            <p className="portfolio-subtitle">
              Showcasing innovative AI/ML solutions and development projects that
              demonstrate my expertise in creating intelligent, scalable applications
            </p>
          </motion.div>

          <motion.div
            className="header-divider"
            variants={itemVariants}
          />
        </motion.div>

        {/* Project Analytics */}
        <ProjectAnalytics
          projects={dataportfolio}
          filteredProjects={filteredProjects}
        />

        {/* Controls Section */}
        <motion.div
          className="portfolio-controls"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="controls-row" variants={itemVariants}>
            <ProjectSearch
              onSearch={handleSearch}
              searchTerm={searchTerm}
              isMobile={isMobile}
            />

            <div className="controls-right">
              <SortOptions
                sortBy={sortBy}
                onSortChange={handleSortChange}
                isMobile={isMobile}
              />
              <ViewModeToggle
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                isMobile={isMobile}
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <FilterTags
              categories={categories}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              isMobile={isMobile}
              projectCounts={projectCounts}
            />
          </motion.div>
        </motion.div>

        {/* Results Info */}
        {(searchTerm || activeFilter !== "All") && (
          <motion.div
            className="results-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>
              {filteredProjects.length === 0 ? (
                <span className="no-results">
                  No projects found
                  {searchTerm && ` for "${searchTerm}"`}
                  {activeFilter !== "All" && ` in "${activeFilter}"`}
                </span>
              ) : (
                <span className="results-count">
                  Showing {filteredProjects.length} of {dataportfolio.length} projects
                  {searchTerm && ` for "${searchTerm}"`}
                  {activeFilter !== "All" && ` in "${activeFilter}"`}
                </span>
              )}
            </p>
          </motion.div>
        )}

        {/* Projects Showcase */}
        <motion.div
          className={`projects-container ${viewMode}-view`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {isLoading ? (
            <motion.div
              className="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="loading-spinner"></div>
              <p>Filtering projects...</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeFilter}-${searchTerm}-${sortBy}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <ProjectsShowcase
                  projects={filteredProjects}
                  viewMode={viewMode}
                  searchTerm={searchTerm}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && !isLoading && (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="empty-state-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3>No Projects Found</h3>
            <p>
              Try adjusting your search criteria or browse all projects by
              selecting "All" categories.
            </p>
            <motion.button
              className="reset-filters-btn"
              onClick={() => {
                setActiveFilter("All");
                setSearchTerm("");
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset Filters
            </motion.button>
          </motion.div>
        )}
      </Container>
    </HelmetProvider>
  );
};
