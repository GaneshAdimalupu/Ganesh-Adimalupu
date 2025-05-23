// FILE: src/header/index.js - FINAL WORKING VERSION

import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./style.css";
import { VscGrabber, VscClose } from "react-icons/vsc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logotext, socialprofils } from "../content_option";
import Themetoggle from "../components/themetoggle";

// Custom hooks for mobile optimization
const useMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const mobile = width <= breakpoint;
      setIsMobile(mobile);

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

const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [isAtTop, setIsAtTop] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDirection = () => {
      const currentScrollY = window.pageYOffset;
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';
      const atTop = currentScrollY < 10;

      if (direction !== scrollDirection && Math.abs(currentScrollY - lastScrollY) > 10) {
        setScrollDirection(direction);
      }

      if (atTop !== isAtTop) {
        setIsAtTop(atTop);
      }

      setScrollY(currentScrollY);
      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    return () => window.removeEventListener('scroll', requestTick);
  }, [scrollDirection, isAtTop]);

  return { scrollDirection, isAtTop, scrollY };
};

// Enhanced Menu Item Component
const MenuItem = React.memo(({
  to,
  children,
  onNavigate,
  isActive,
  index
}) => {
  const navigate = useNavigate();

  const handleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    // Close menu and navigate
    onNavigate(() => {
      navigate(to);
    });
  }, [navigate, to, onNavigate]);

  return (
    <motion.li
      className="menu_item"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: "easeOut"
      }}
    >
      <a
        href={to}
        onClick={handleClick}
        className={`menu_link ${isActive ? 'active' : ''}`}
        role="menuitem"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e);
          }
        }}
      >
        <span className="menu_text">{children}</span>
      </a>
    </motion.li>
  );
});

// Enhanced Social Links Component
const SocialLinks = React.memo(() => {
  const socialLinks = useMemo(() => [
    { key: 'github', url: socialprofils.github, label: 'GitHub' },
    { key: 'linkedin', url: socialprofils.linkedin, label: 'LinkedIn' },
    { key: 'twitter', url: socialprofils.twitter, label: 'Twitter' },
    { key: 'facebook', url: socialprofils.facebook, label: 'Facebook' }
  ].filter(link => link.url), []);

  return (
    <motion.div
      className="menu_social"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <h4>Connect With Me</h4>
      <div className="social_links">
        {socialLinks.map((link, index) => (
          <motion.a
            key={link.key}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social_link"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={link.label}
          >
            {link.label}
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
});

// Main Header Component
const Headermain = () => {
  const [isActive, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isMobile, screenSize } = useMobile();
  const { scrollDirection, isAtTop, scrollY } = useScrollDirection();
  const location = useLocation();
  const navigate = useNavigate();

  // Menu items configuration
  const menuItems = useMemo(() => [
    { to: "/", label: "Home", exact: true },
    { to: "/portfolio", label: "Portfolio", exact: false },
    { to: "/about", label: "About", exact: false },
    { to: "/contact", label: "Contact", exact: false }
  ], []);

  // Check if current path is active
  const isActiveRoute = useCallback((item) => {
    if (item.exact) {
      return location.pathname === item.to;
    }
    return location.pathname.startsWith(item.to);
  }, [location.pathname]);

  // Handle menu toggle
  const handleToggle = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setActive(prev => {
      const newState = !prev;

      // Prevent body scroll when menu is open
      if (newState) {
        document.body.classList.add("menu-open");
        document.body.style.overflow = "hidden";

        // Additional iOS fixes
        if (isMobile) {
          document.body.style.position = "fixed";
          document.body.style.width = "100%";
          document.body.style.top = `-${scrollY}px`;
        }
      } else {
        document.body.classList.remove("menu-open");
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";

        // Restore scroll position on iOS
        if (isMobile && scrollY) {
          document.body.style.top = "";
          window.scrollTo(0, scrollY);
        }
      }

      return newState;
    });
  }, [isMobile, scrollY]);

  // Handle menu navigation
  const handleNavigation = useCallback((navigationCallback) => {
    // Close menu first
    setActive(false);
    document.body.classList.remove("menu-open");
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.top = "";

    // Navigate after menu animation completes
    setTimeout(() => {
      navigationCallback();
    }, 300);
  }, []);

  // Close menu on route change
  useEffect(() => {
    if (isActive) {
      setActive(false);
      document.body.classList.remove("menu-open");
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    }
  }, [location.pathname]);

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isActive) {
        handleToggle();
      }
    };

    const handleOutsideClick = (e) => {
      if (isActive &&
          !e.target.closest('.site__navigation') &&
          !e.target.closest('.menu__button')) {
        handleToggle();
      }
    };

    if (isActive) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isActive, handleToggle]);

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove("menu-open");
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, []);

  if (!mounted) return null;

  // Calculate header state
  const shouldHideHeader = scrollDirection === 'down' && !isAtTop && !isActive && scrollY > 100;

  return (
    <>
      {/* Header */}
      <motion.header
        className={`site__header ${!isAtTop ? 'scrolled' : ''} ${screenSize}`}
        initial={{ y: -100 }}
        animate={{
          y: shouldHideHeader ? -100 : 0,
          opacity: shouldHideHeader ? 0.8 : 1
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="header__container">
          <motion.div
            className="header__left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link className="navbar-brand" to="/" aria-label="Home">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {logotext}
              </motion.span>
            </Link>
          </motion.div>

          <motion.div
            className="header__right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Themetoggle />

            <motion.button
              className={`menu__button ${isActive ? 'active' : ''}`}
              onClick={handleToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isActive ? 'Close menu' : 'Open menu'}
              aria-expanded={isActive}
              aria-controls="navigation-menu"
              type="button"
            >
              <motion.div
                animate={{ rotate: isActive ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isActive ? <VscClose /> : <VscGrabber />}
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            className="site__navigation"
            role="dialog"
            aria-modal="true"
            aria-labelledby="navigation-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background Overlay */}
            <div
              className="menu__backdrop"
              onClick={handleToggle}
            />

            {/* Menu Content */}
            <motion.div
              className="menu__container"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
                type: "tween"
              }}
            >
              <div className="menu__wrapper">
                <div className="menu__content" id="navigation-menu">
                  {/* Menu Header */}
                  <motion.div
                    className="menu__header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3>Navigation</h3>
                    <p>Explore my work and get in touch</p>
                  </motion.div>

                  {/* Menu Items */}
                  <nav
                    className="menu__nav"
                    role="navigation"
                    aria-label="Main navigation"
                  >
                    <ul className="menu__list" role="menubar">
                      {menuItems.map((item, index) => (
                        <MenuItem
                          key={item.to}
                          to={item.to}
                          onNavigate={handleNavigation}
                          isActive={isActiveRoute(item)}
                          index={index}
                        >
                          {item.label}
                        </MenuItem>
                      ))}
                    </ul>
                  </nav>

                  {/* Social Links */}
                  <SocialLinks />

                  {/* Menu Footer */}
                  <motion.div
                    className="menu__footer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="copyright">© 2024 {logotext}. All rights reserved.</p>
                    <p className="location">Thiruvananthapuram, Kerala, India</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Border Elements */}
      <div className="site__borders">
        <div className="br-top"></div>
        <div className="br-bottom"></div>
        <div className="br-left"></div>
        <div className="br-right"></div>
      </div>
    </>
  );
};

export default Headermain;
