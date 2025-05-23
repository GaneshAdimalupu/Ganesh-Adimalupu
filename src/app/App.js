// FILE: src/app/App.js

import React, { useEffect, useState, useCallback, Suspense, lazy } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";

// Core components (always loaded)
import withRouter from "../hooks/withRouter";
import Headermain from "../header";
import AnimatedCursor from "../hooks/AnimatedCursor";
import PageLoader from "../components/loading/PageLoader";
import "./App.css";

// Lazy load heavy components for better performance
const AppRoutes = lazy(() => import("./routes"));
const ParticleGrid = lazy(() => import("../components/particlegrid/ParticleGrid"));

// Custom hooks for app-level optimizations
const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    isMobile: false,
    isLowPerformance: false,
    supportsWebGL: false,
    preferReducedMotion: false,
    connectionSpeed: 'unknown'
  });

  useEffect(() => {
    const detectCapabilities = () => {
      // Mobile detection
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
                       (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
                       window.innerWidth <= 768;

      // Performance detection
      const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 2;
      const hasLowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
      const hasSlowConnection = navigator.connection &&
        ['slow-2g', '2g', '3g'].includes(navigator.connection.effectiveType);

      const isLowPerformance = isMobile || hasLowMemory || hasLowCores || hasSlowConnection;

      // WebGL support
      const canvas = document.createElement('canvas');
      const supportsWebGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));

      // Motion preferences
      const preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Connection speed
      const connectionSpeed = navigator.connection ?
        navigator.connection.effectiveType : 'unknown';

      setCapabilities({
        isMobile,
        isLowPerformance,
        supportsWebGL,
        preferReducedMotion,
        connectionSpeed
      });
    };

    detectCapabilities();

    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => detectCapabilities();

    mediaQuery.addEventListener('change', handleChange);

    if (navigator.connection) {
      navigator.connection.addEventListener('change', handleChange);
    }

    window.addEventListener('resize', detectCapabilities);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', handleChange);
      }
      window.removeEventListener('resize', detectCapabilities);
    };
  }, []);

  return capabilities;
};

const usePerformanceMonitoring = () => {
  const [performanceData, setPerformanceData] = useState({
    loadTime: 0,
    renderTime: 0,
    isOptimal: true
  });

  useEffect(() => {
    // Monitor initial load time
    if ('performance' in window) {
      const handleLoad = () => {
        try {
          const perfData = performance.getEntriesByType('navigation')[0];
          if (perfData) {
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            setPerformanceData(prev => ({
              ...prev,
              loadTime,
              isOptimal: loadTime < 3000 // Under 3 seconds is optimal
            }));
          }
        } catch (e) {
          console.warn('Performance monitoring not available');
        }
      };

      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    }
  }, []);

  return performanceData;
};

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="error-boundary">
      <div className="error-content">
        <h2>Oops! Something went wrong</h2>
        <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
        <button
          onClick={resetErrorBoundary}
          className="error-retry-btn"
        >
          Try Again
        </button>
        {process.env.NODE_ENV === 'development' && (
          <details className="error-details">
            <summary>Error Details</summary>
            <pre>{error.message}</pre>
          </details>
        )}
      </div>
    </div>
  );
};

// Loading Fallback Component
const LoadingFallback = ({ isMobile }) => (
  <div className="loading-fallback">
    <div className="loading-spinner"></div>
    <p>{isMobile ? 'Loading...' : 'Loading Component...'}</p>
  </div>
);

// Scroll to Top Component (Enhanced)
function _ScrollToTop(props) {
  const { pathname } = useLocation();
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    setIsScrolling(true);

    // Smooth scroll to top with performance considerations
    const scrollToTop = () => {
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Fallback for browsers that don't support smooth scrolling
        window.scrollTo(0, 0);
      }

      setTimeout(() => setIsScrolling(false), 300);
    };

    // Small delay to ensure route transition is complete
    const timer = setTimeout(scrollToTop, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className={`scroll-container ${isScrolling ? 'scrolling' : ''}`}>
      {props.children}
    </div>
  );
}

const ScrollToTop = withRouter(_ScrollToTop);

// Main App Component
export default function App() {
  const [appLoaded, setAppLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const capabilities = useDeviceCapabilities();
  const performanceData = usePerformanceMonitoring();

  // Handle app initialization
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Wait for critical resources
        await new Promise(resolve => {
          if (document.readyState === 'complete') {
            resolve();
          } else {
            window.addEventListener('load', resolve, { once: true });
          }
        });

        // Additional initialization delay for smooth UX
        const minLoadTime = capabilities.isLowPerformance ? 800 : 1200;
        await new Promise(resolve => setTimeout(resolve, minLoadTime));

        setAppLoaded(true);
      } catch (error) {
        console.error('App initialization error:', error);
        setAppLoaded(true); // Still show the app even if there's an error
      }
    };

    initializeApp();
  }, [capabilities.isLowPerformance]);

  // Handle loader completion
  const handleLoadingComplete = useCallback(() => {
    setShowLoader(false);
  }, []);

  // App-level error handler
  const handleError = useCallback((error, errorInfo) => {
    console.error('App Error:', error, errorInfo);

    // Report to analytics in production (if available)
    if (typeof window !== 'undefined' && window.gtag && process.env.NODE_ENV === 'production') {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      });
    }
  }, []);

  // Performance warning (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !performanceData.isOptimal) {
      console.warn(`Performance Warning: Load time was ${performanceData.loadTime}ms`);
    }
  }, [performanceData]);

  // App container variants for smooth mounting
  const appVariants = {
    hidden: {
      opacity: 0,
      scale: 0.98
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: capabilities.preferReducedMotion ? 0.1 : 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => window.location.reload()}
    >
      <Router basename={process.env.PUBLIC_URL}>
        <div className={`app-container ${capabilities.isMobile ? 'mobile' : ''} ${capabilities.isLowPerformance ? 'low-performance' : ''}`}>

          {/* Page Loader */}
          <AnimatePresence mode="wait">
            {showLoader && (
              <PageLoader
                onLoadingComplete={handleLoadingComplete}
                showProgress={!capabilities.isLowPerformance}
              />
            )}
          </AnimatePresence>

          {/* Main App Content */}
          <AnimatePresence>
            {appLoaded && !showLoader && (
              <motion.div
                className="app-content"
                variants={appVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {/* Animated Cursor (Desktop only) */}
                {!capabilities.isMobile && !capabilities.preferReducedMotion && (
                  <div className="cursor__container">
                    <AnimatedCursor
                      innerSize={15}
                      outerSize={15}
                      color="0, 199, 255"
                      outerAlpha={0.4}
                      innerScale={0.7}
                      outerScale={capabilities.isLowPerformance ? 3 : 5}
                    />
                  </div>
                )}

                {/* Particle Grid Background (Performance-aware) */}
                {!capabilities.isLowPerformance && capabilities.supportsWebGL && (
                  <Suspense fallback={null}>
                    <ParticleGrid
                      enabled={!capabilities.preferReducedMotion}
                      density={capabilities.isMobile ? 'low' : 'medium'}
                    />
                  </Suspense>
                )}

                {/* Header */}
                <Headermain />

                {/* Main Content with Scroll Management */}
                <ScrollToTop>
                  <main className="main-content" role="main">
                    <Suspense fallback={<LoadingFallback isMobile={capabilities.isMobile} />}>
                      <AppRoutes
                        capabilities={capabilities}
                        performanceData={performanceData}
                      />
                    </Suspense>
                  </main>
                </ScrollToTop>

                {/* Performance Monitor (Development only) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="performance-monitor">
                    <small>
                      Load: {performanceData.loadTime}ms |
                      Mobile: {capabilities.isMobile ? 'Yes' : 'No'} |
                      Performance: {capabilities.isLowPerformance ? 'Low' : 'Normal'}
                    </small>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Global Loading States */}
          <div id="global-loading-portal" />
          <div id="global-modal-portal" />
        </div>
      </Router>
    </ErrorBoundary>
  );
}
