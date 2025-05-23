// FILE: src/app/routes.js

import React, { useRef, useState, useEffect, Suspense, lazy, useCallback, useMemo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import withRouter from "../hooks/withRouter";
import { Socialicons } from "../components/socialicons";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { motion, AnimatePresence } from "framer-motion";

// Lazy load pages for better performance
const Home = lazy(() => import("../pages/home").then(module => ({ default: module.Home })));
const Portfolio = lazy(() => import("../pages/portfolio").then(module => ({ default: module.Portfolio })));
const ContactUs = lazy(() => import("../pages/contact").then(module => ({ default: module.ContactUs })));
const About = lazy(() => import("../pages/about").then(module => ({ default: module.About })));

// Custom hook for route management
const useRouteManagement = (capabilities) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preloadedRoutes, setPreloadedRoutes] = useState(new Set());
  const location = useLocation();

  // Preload routes based on user behavior
  const preloadRoute = useCallback((routeName) => {
    if (preloadedRoutes.has(routeName)) return;

    const routeImports = {
      home: () => import("../pages/home"),
      portfolio: () => import("../pages/portfolio"),
      contact: () => import("../pages/contact"),
      about: () => import("../pages/about")
    };

    if (routeImports[routeName]) {
      routeImports[routeName]()
        .then(() => {
          setPreloadedRoutes(prev => new Set([...prev, routeName]));
        })
        .catch(err => console.warn(`Failed to preload ${routeName}:`, err));
    }
  }, [preloadedRoutes]);

  // Intelligent preloading based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const preloadDelay = capabilities.isLowPerformance ? 2000 : 1000;

    const timer = setTimeout(() => {
      switch (currentPath) {
        case '/':
          preloadRoute('portfolio');
          preloadRoute('about');
          break;
        case '/portfolio':
          preloadRoute('contact');
          break;
        case '/about':
          preloadRoute('portfolio');
          preloadRoute('contact');
          break;
        default:
          break;
      }
    }, preloadDelay);

    return () => clearTimeout(timer);
  }, [location.pathname, preloadRoute, capabilities.isLowPerformance]);

  return { isTransitioning, setIsTransitioning, preloadRoute };
};

// Enhanced Loading Component
const RouteLoadingFallback = React.memo(({ route, isMobile }) => {
  const [loadingText, setLoadingText] = useState('Loading...');

  useEffect(() => {
    const messages = {
      '/': isMobile ? 'Loading Home...' : 'Loading Portfolio Home...',
      '/portfolio': isMobile ? 'Loading Work...' : 'Loading Portfolio...',
      '/about': isMobile ? 'Loading About...' : 'Loading About Me...',
      '/contact': isMobile ? 'Loading Contact...' : 'Loading Contact Form...'
    };

    setLoadingText(messages[route] || 'Loading...');
  }, [route, isMobile]);

  return (
    <motion.div
      className="route-loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="route-loading-content">
        <div className="route-loading-spinner">
          <div className="spinner-ring"></div>
        </div>
        <p className="route-loading-text">{loadingText}</p>
      </div>
    </motion.div>
  );
});

// Error Boundary for Routes
class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Route Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="route-error">
          <div className="route-error-content">
            <h2>Page Error</h2>
            <p>Sorry, something went wrong loading this page.</p>
            <button
              onClick={() => window.location.reload()}
              className="route-error-btn"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced Route Component with prefetching
const EnhancedRoute = React.memo(({
  element,
  capabilities,
  onRouteChange,
  preloadRoute
}) => {
  const location = useLocation();

  useEffect(() => {
    onRouteChange?.(location.pathname);
  }, [location.pathname, onRouteChange]);

  // Handle link hover for preloading (desktop only)
  useEffect(() => {
    if (capabilities.isMobile) return;

    const handleLinkHover = (e) => {
      const link = e.target.closest('a[href]');
      if (link && link.href.includes(window.location.origin)) {
        const path = new URL(link.href).pathname;
        const routeMap = {
          '/': 'home',
          '/portfolio': 'portfolio',
          '/about': 'about',
          '/contact': 'contact'
        };

        if (routeMap[path]) {
          preloadRoute(routeMap[path]);
        }
      }
    };

    document.addEventListener('mouseover', handleLinkHover);
    return () => document.removeEventListener('mouseover', handleLinkHover);
  }, [capabilities.isMobile, preloadRoute]);

  return element;
});

// Main AnimatedRoutes Component
const AnimatedRoutes = withRouter(({ location, capabilities, performanceData }) => {
  const { isTransitioning, setIsTransitioning, preloadRoute } = useRouteManagement(capabilities);

  // Create refs for each route to avoid findDOMNode warnings
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const portfolioRef = useRef(null);
  const contactRef = useRef(null);
  const defaultRef = useRef(null);

  // Get appropriate ref for current route
  const getRouteRef = useCallback((pathname) => {
    switch (pathname) {
      case "/": return homeRef;
      case "/about": return aboutRef;
      case "/portfolio": return portfolioRef;
      case "/contact": return contactRef;
      default: return defaultRef;
    }
  }, []);

  // Handle route change
  const handleRouteChange = useCallback((path) => {
    setIsTransitioning(true);

    // Track route changes for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path
      });
    }

    setTimeout(() => setIsTransitioning(false), 300);
  }, [setIsTransitioning]);

  // Optimized transition settings based on device capabilities
  const transitionSettings = useMemo(() => {
    const baseSettings = {
      timeout: {
        enter: capabilities.isLowPerformance ? 200 : 400,
        exit: capabilities.isLowPerformance ? 200 : 400,
      },
      classNames: capabilities.isMobile ? "page-mobile" : "page"
    };

    if (capabilities.preferReducedMotion) {
      return {
        timeout: { enter: 50, exit: 50 },
        classNames: "page-reduced"
      };
    }

    return baseSettings;
  }, [capabilities]);

  const currentRef = getRouteRef(location.pathname);

  return (
    <div className="routes-container">
      {/* Route Loading Indicator */}
      <AnimatePresence>
        {isTransitioning && (
          <div className="route-transition-indicator" />
        )}
      </AnimatePresence>

      {/* Main Route Transitions */}
      <TransitionGroup component={null}>
        <CSSTransition
          key={location.key}
          nodeRef={currentRef}
          {...transitionSettings}
          unmountOnExit
        >
          <div ref={currentRef} className="route-wrapper">
            <RouteErrorBoundary>
              <Suspense
                fallback={
                  <RouteLoadingFallback
                    route={location.pathname}
                    isMobile={capabilities.isMobile}
                  />
                }
              >
                <Routes location={location}>
                  <Route
                    path="/"
                    element={
                      <EnhancedRoute
                        element={<Home />}
                        capabilities={capabilities}
                        onRouteChange={handleRouteChange}
                        preloadRoute={preloadRoute}
                      />
                    }
                  />
                  <Route
                    path="/about"
                    element={
                      <EnhancedRoute
                        element={<About />}
                        capabilities={capabilities}
                        onRouteChange={handleRouteChange}
                        preloadRoute={preloadRoute}
                      />
                    }
                  />
                  <Route
                    path="/portfolio"
                    element={
                      <EnhancedRoute
                        element={<Portfolio />}
                        capabilities={capabilities}
                        onRouteChange={handleRouteChange}
                        preloadRoute={preloadRoute}
                      />
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <EnhancedRoute
                        element={<ContactUs />}
                        capabilities={capabilities}
                        onRouteChange={handleRouteChange}
                        preloadRoute={preloadRoute}
                      />
                    }
                  />
                  {/* Fallback route */}
                  <Route
                    path="*"
                    element={
                      <EnhancedRoute
                        element={<Home />}
                        capabilities={capabilities}
                        onRouteChange={handleRouteChange}
                        preloadRoute={preloadRoute}
                      />
                    }
                  />
                </Routes>
              </Suspense>
            </RouteErrorBoundary>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
});

// Main AppRoutes Component
function AppRoutes({ capabilities, performanceData }) {
  const [socialIconsVisible, setSocialIconsVisible] = useState(true);
  const location = useLocation();

  // Hide social icons on contact page for mobile
  useEffect(() => {
    if (capabilities.isMobile && location.pathname === '/contact') {
      setSocialIconsVisible(false);
    } else {
      setSocialIconsVisible(true);
    }
  }, [capabilities.isMobile, location.pathname]);

  // Performance-aware container classes
  const containerClasses = useMemo(() => {
    const classes = ['app-routes'];

    if (capabilities.isMobile) classes.push('mobile');
    if (capabilities.isLowPerformance) classes.push('low-performance');
    if (capabilities.preferReducedMotion) classes.push('reduced-motion');

    return classes.join(' ');
  }, [capabilities]);

  return (
    <div className={containerClasses}>
      <AnimatedRoutes
        capabilities={capabilities}
        performanceData={performanceData}
      />

      {/* Social Icons with conditional rendering */}
      <AnimatePresence>
        {socialIconsVisible && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Socialicons />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AppRoutes;
