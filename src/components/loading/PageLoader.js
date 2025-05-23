// FILE: src/components/loading/PageLoader.js

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './style.css';

// Custom hook for device detection
const useDeviceCapabilities = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isLowPerformance: false,
    connectionSpeed: 'unknown',
    preferReducedMotion: false
  });

  useEffect(() => {
    const detectDevice = () => {
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

      const isLowPerformance = hasLowMemory || hasLowCores || hasSlowConnection || isMobile;

      // Connection speed
      const connectionSpeed = navigator.connection ?
        navigator.connection.effectiveType : 'unknown';

      // Reduced motion preference
      const preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      setDeviceInfo({
        isMobile,
        isLowPerformance,
        connectionSpeed,
        preferReducedMotion
      });
    };

    detectDevice();

    // Listen for connection changes
    if (navigator.connection) {
      navigator.connection.addEventListener('change', detectDevice);
    }

    return () => {
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', detectDevice);
      }
    };
  }, []);

  return deviceInfo;
};

// Fixed progressive loading hook
const useProgressiveLoading = (deviceInfo) => {
  const [loadingStage, setLoadingStage] = useState('initial');
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Calculate loading duration based on device capabilities
  const loadingDuration = useMemo(() => {
    const { isMobile, isLowPerformance, connectionSpeed } = deviceInfo;

    let baseDuration = 2000; // 2 seconds default

    if (isLowPerformance) baseDuration = 1200; // Faster for low-end devices
    if (isMobile) baseDuration = Math.min(baseDuration, 1500); // Max 1.5s on mobile

    // Adjust for connection speed
    switch (connectionSpeed) {
      case 'slow-2g':
      case '2g':
        baseDuration = 800;
        break;
      case '3g':
        baseDuration = 1000;
        break;
      case '4g':
      default:
        break;
    }

    return baseDuration;
  }, [deviceInfo]);

  useEffect(() => {
    let mounted = true;
    let progressInterval;
    let stageTimeouts = [];

    const simulateLoading = async () => {
      try {
        if (!mounted) return;

        // Stage 1: Initial loading
        setLoadingStage('loading');

        // Progress simulation with guaranteed completion
        const totalSteps = 20;
        const stepDuration = loadingDuration / totalSteps;
        let currentStep = 0;

        progressInterval = setInterval(() => {
          if (!mounted) return;

          currentStep++;
          const newProgress = Math.min((currentStep / totalSteps) * 100, 100);

          setProgress(newProgress);

          // Stage transitions based on progress
          if (newProgress >= 30 && loadingStage === 'loading') {
            setLoadingStage('assets');
          } else if (newProgress >= 70 && loadingStage === 'assets') {
            setLoadingStage('finalizing');
          }

          // Complete when we reach 100%
          if (newProgress >= 100 || currentStep >= totalSteps) {
            clearInterval(progressInterval);

            // Ensure we complete the loading
            stageTimeouts.push(setTimeout(() => {
              if (mounted) {
                setProgress(100);
                setLoadingStage('complete');

                // Final delay before hiding
                stageTimeouts.push(setTimeout(() => {
                  if (mounted) {
                    setLoadingComplete(true);
                  }
                }, 300));
              }
            }, 100));
          }
        }, stepDuration);

        // Fallback: Force completion after max duration
        stageTimeouts.push(setTimeout(() => {
          if (mounted && !loadingComplete) {
            clearInterval(progressInterval);
            setProgress(100);
            setLoadingStage('complete');

            stageTimeouts.push(setTimeout(() => {
              if (mounted) {
                setLoadingComplete(true);
              }
            }, 300));
          }
        }, loadingDuration + 500)); // Extra 500ms buffer

      } catch (error) {
        console.error('Loading simulation error:', error);
        if (mounted) {
          setLoadingComplete(true);
        }
      }
    };

    // Start loading immediately
    simulateLoading();

    return () => {
      mounted = false;
      clearInterval(progressInterval);
      stageTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [loadingDuration, loadingComplete]); // Removed loadingStage dependency to prevent loops

  return { loadingStage, progress, loadingComplete };
};

// Performance-aware loading messages
const getLoadingMessage = (stage, isMobile) => {
  const messages = {
    initial: isMobile ? 'Starting...' : 'Initializing Portfolio...',
    loading: isMobile ? 'Loading...' : 'Loading Portfolio...',
    assets: isMobile ? 'Loading Assets...' : 'Loading Assets & Components...',
    finalizing: isMobile ? 'Almost Ready...' : 'Finalizing Experience...',
    complete: isMobile ? 'Ready!' : 'Welcome!'
  };

  return messages[stage] || messages.loading;
};

// Optimized progress bar component
const ProgressBar = React.memo(({ progress, isLowPerformance, preferReducedMotion }) => {
  const progressVariants = useMemo(() => {
    if (preferReducedMotion) {
      return {
        initial: { width: 0 },
        animate: { width: `${progress}%` },
        transition: { duration: 0.1 }
      };
    }

    return {
      initial: { width: 0 },
      animate: {
        width: `${progress}%`,
        transition: {
          duration: isLowPerformance ? 0.2 : 0.3,
          ease: 'easeOut'
        }
      }
    };
  }, [progress, isLowPerformance, preferReducedMotion]);

  return (
    <div className="progress-container">
      <div className="progress-track">
        <motion.div
          className="progress-fill"
          {...progressVariants}
        />
      </div>
      <motion.span
        className="progress-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {Math.round(progress)}%
      </motion.span>
    </div>
  );
});

// Optimized spinner component
const LoadingSpinner = React.memo(({ size = 'medium', isLowPerformance, preferReducedMotion }) => {
  const spinnerSize = useMemo(() => {
    const sizes = {
      small: 30,
      medium: 50,
      large: 70
    };
    return sizes[size] || sizes.medium;
  }, [size]);

  const spinnerStyle = useMemo(() => ({
    width: spinnerSize,
    height: spinnerSize,
    animation: preferReducedMotion ? 'none' : `spin ${isLowPerformance ? '1.5s' : '1s'} linear infinite`
  }), [spinnerSize, isLowPerformance, preferReducedMotion]);

  if (preferReducedMotion) {
    return (
      <div className="static-loader">
        <div className="pulse-dot" />
      </div>
    );
  }

  return (
    <div
      className="loader-spinner"
      style={spinnerStyle}
      aria-label="Loading"
      role="status"
    />
  );
});

// Main PageLoader component
const PageLoader = ({
  showProgress = true,
  logoText = "GANESH",
  subtitle = "Portfolio",
  onLoadingComplete
}) => {
  const deviceInfo = useDeviceCapabilities();
  const { loadingStage, progress, loadingComplete } = useProgressiveLoading(deviceInfo);
  const [shouldRender, setShouldRender] = useState(true);

  // Handle loading completion
  useEffect(() => {
    if (loadingComplete) {
      const hideDelay = deviceInfo.isLowPerformance ? 200 : 400;

      const hideTimer = setTimeout(() => {
        setShouldRender(false);
        onLoadingComplete?.();
      }, hideDelay);

      return () => clearTimeout(hideTimer);
    }
  }, [loadingComplete, deviceInfo.isLowPerformance, onLoadingComplete]);

  // Prevent scroll during loading
  useEffect(() => {
    if (shouldRender) {
      document.body.style.overflow = 'hidden';

      // Additional iOS fixes
      if (deviceInfo.isMobile) {
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [shouldRender, deviceInfo.isMobile]);

  // Force complete function for skip button
  const forceComplete = useCallback(() => {
    setShouldRender(false);
    onLoadingComplete?.();
  }, [onLoadingComplete]);

  // Animation variants based on device capabilities
  const containerVariants = useMemo(() => {
    const baseVariants = {
      initial: { opacity: 1 },
      exit: {
        opacity: 0,
        transition: {
          duration: deviceInfo.isLowPerformance ? 0.3 : 0.5,
          ease: 'easeInOut'
        }
      }
    };

    if (deviceInfo.preferReducedMotion) {
      return {
        initial: { opacity: 1 },
        exit: { opacity: 0, transition: { duration: 0.1 } }
      };
    }

    return baseVariants;
  }, [deviceInfo]);

  const contentVariants = useMemo(() => {
    if (deviceInfo.preferReducedMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 }
      };
    }

    return {
      initial: { opacity: 0, y: 20 },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          duration: deviceInfo.isLowPerformance ? 0.4 : 0.6,
          staggerChildren: 0.2
        }
      }
    };
  }, [deviceInfo]);

  const itemVariants = useMemo(() => {
    if (deviceInfo.preferReducedMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 }
      };
    }

    return {
      initial: { opacity: 0, y: 10 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 }
      }
    };
  }, [deviceInfo]);

  // Don't render if loading is complete and we've waited
  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`page-loader ${loadingStage} ${deviceInfo.isMobile ? 'mobile' : ''}`}
        variants={containerVariants}
        initial="initial"
        animate="initial"
        exit="exit"
        role="status"
        aria-live="polite"
        aria-label={`Loading: ${getLoadingMessage(loadingStage, deviceInfo.isMobile)}`}
      >
        <motion.div
          className="loader-content"
          variants={contentVariants}
          initial="initial"
          animate="animate"
        >
          {/* Logo/Brand */}
          <motion.div
            className="loader-logo"
            variants={itemVariants}
          >
            <h1 className="logo-text">{logoText}</h1>
            {subtitle && (
              <p className="logo-subtitle">{subtitle}</p>
            )}
          </motion.div>

          {/* Loading Spinner */}
          <motion.div
            className="loader-spinner-container"
            variants={itemVariants}
          >
            <LoadingSpinner
              size={deviceInfo.isMobile ? 'small' : 'medium'}
              isLowPerformance={deviceInfo.isLowPerformance}
              preferReducedMotion={deviceInfo.preferReducedMotion}
            />
          </motion.div>

          {/* Loading Message */}
          <motion.div
            className="loader-message"
            variants={itemVariants}
          >
            <p>{getLoadingMessage(loadingStage, deviceInfo.isMobile)}</p>
          </motion.div>

          {/* Progress Bar */}
          {showProgress && (
            <motion.div
              className="loader-progress"
              variants={itemVariants}
            >
              <ProgressBar
                progress={progress}
                isLowPerformance={deviceInfo.isLowPerformance}
                preferReducedMotion={deviceInfo.preferReducedMotion}
              />
            </motion.div>
          )}

          {/* Connection Status (for slow connections) */}
          {deviceInfo.connectionSpeed && ['slow-2g', '2g', '3g'].includes(deviceInfo.connectionSpeed) && (
            <motion.div
              className="connection-notice"
              variants={itemVariants}
            >
              <p className="connection-text">
                Optimizing for {deviceInfo.connectionSpeed.toUpperCase()} connection...
              </p>
            </motion.div>
          )}

          {/* Skip Button - Available after 2 seconds or for slow devices */}
          {(progress > 50 || deviceInfo.isLowPerformance) && (
            <motion.button
              className="skip-loading-btn"
              variants={itemVariants}
              onClick={forceComplete}
              whileTap={{ scale: 0.95 }}
              aria-label="Skip loading animation"
            >
              Skip
            </motion.button>
          )}
        </motion.div>

        {/* Background Pattern (desktop only) */}
        {!deviceInfo.isMobile && !deviceInfo.isLowPerformance && !deviceInfo.preferReducedMotion && (
          <div className="loader-background">
            <div className="floating-dots">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`dot dot-${i + 1}`}
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: `${2 + i * 0.3}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// Error boundary for loader
class LoaderErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('PageLoader error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback minimal loader
      return (
        <div className="page-loader-fallback">
          <div className="fallback-content">
            <h1>GANESH</h1>
            <p>Loading Portfolio...</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const PageLoaderWithErrorBoundary = (props) => (
  <LoaderErrorBoundary>
    <PageLoader {...props} />
  </LoaderErrorBoundary>
);

export default PageLoaderWithErrorBoundary;
