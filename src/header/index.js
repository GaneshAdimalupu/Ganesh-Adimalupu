// FILE: src/header/index.js

import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./style.css";
import { VscGrabber, VscClose } from "react-icons/vsc";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logotext, socialprofils } from "../content_option";
import Themetoggle from "../components/themetoggle";

// Custom hooks
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

const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      const atTop = scrollY < 10;

      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > 10) {
        setScrollDirection(direction);
      }

      if (atTop !== isAtTop) {
        setIsAtTop(atTop);
      }

      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick);
    return () => window.removeEventListener('scroll', requestTick);
  }, [scrollDirection, isAtTop]);

  return { scrollDirection, isAtTop };
};

// Enhanced Menu Item Component
const MenuItem = React.memo(({
  to,
  children,
  onClick,
  isActive,
  index,
  isMobile
}) => {
  const itemVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      x: isMobile ? -50 : -30,
      y: isMobile ? 0 : 10
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      x: isMobile ? -30 : -20,
      transition: {
        duration: 0.3,
        delay: (4 - index) * 0.05
      }
    }
  }), [index, isMobile]);

  return (
    <motion.li
      className="menu_item"
      variants={itemVariants}
    >
      <Link
        onClick={onClick}
        to={to}
        className={`menu_link ${isActive ? 'active' : ''}`}
      >
        <span className="menu_text">{children}</span>
        <motion.div
          className="menu_indicator"
          initial={false}
          animate={{
            scaleX: isActive ? 1 : 0,
            opacity: isActive ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        />
      </Link>
    </motion.li>
  );
});

// Enhanced Social Links Component
const SocialLinks = React.memo(({ isMobile }) => {
  const socialVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 }
    }
  }), []);

  const linkVariants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  }), []);

  const socialLinks = useMemo(() => [
    { key: 'github', url: socialprofils.github, label: 'GitHub' },
    { key: 'linkedin', url: socialprofils.linkedin, label: 'LinkedIn' },
    { key: 'twitter', url: socialprofils.twitter, label: 'Twitter' },
    { key: 'facebook', url: socialprofils.facebook, label: 'Facebook' }
  ].filter(link => link.url), []);

  return (
    <motion.div
      className="menu_social"
      variants={socialVariants}
    >
      <motion.h4 variants={linkVariants}>Connect With Me</motion.h4>
      <div className="social_links">
        {socialLinks.map((link) => (
          <motion.a
            key={link.key}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social_link"
            variants={linkVariants}
            whileHover={!isMobile ? {
              scale: 1.1,
              y: -2,
              transition: { duration: 0.2 }
            } : undefined}
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
  const { scrollDirection, isAtTop } = useScrollDirection();
  const location = useLocation();

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
  const handleToggle = useCallback(() => {
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
        }
      } else {
        document.body.classList.remove("menu-open");
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
      }

      return newState;
    });
  }, [isMobile]);

  // Close menu on route change
  useEffect(() => {
    if (isActive) {
      setActive(false);
      document.body.classList.remove("menu-open");
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
  }, [location.pathname, isActive]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isActive) {
        handleToggle();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isActive, handleToggle]);

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Header animation variants
  const headerVariants = useMemo(() => ({
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    hidden: {
      y: -100,
      opacity: 0.8,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }), []);

  // Menu overlay variants
  const overlayVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren"
      }
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren"
      }
    }
  }), []);

  // Menu container variants
  const menuVariants = useMemo(() => ({
    hidden: {
      x: "100%",
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        when: "afterChildren"
      }
    },
    visible: {
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }), []);

  const menuContentVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }), []);

  if (!mounted) return null;

  return (
    <>
      {/* Header */}
      <motion.header
        className={`site__header ${!isAtTop ? 'scrolled' : ''} ${screenSize}`}
        variants={headerVariants}
        initial="visible"
        animate={scrollDirection === 'down' && !isAtTop && !isActive ? "hidden" : "visible"}
      >
        <div className="header__container">
          <motion.div
            className="header__left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link className="navbar-brand" to="/">
              <motion.span
                whileHover={!isMobile ? {
                  scale: 1.05,
                  transition: { duration: 0.2 }
                } : undefined}
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
              whileHover={!isMobile ? { scale: 1.1 } : undefined}
              whileTap={{ scale: 0.9 }}
              aria-label={isActive ? 'Close menu' : 'Open menu'}
              aria-expanded={isActive}
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
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="site__navigation"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Background Overlay */}
            <motion.div
              className="menu__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleToggle}
            />

            {/* Menu Content */}
            <motion.div
              className="menu__container"
              variants={menuVariants}
            >
              <div className="menu__wrapper">
                <motion.div
                  className="menu__content"
                  variants={menuContentVariants}
                >
                  {/* Menu Header */}
                  <motion.div
                    className="menu__header"
                    variants={{
                      hidden: { opacity: 0, y: -20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <h3>Navigation</h3>
                    <p>Explore my work and get in touch</p>
                  </motion.div>

                  {/* Menu Items */}
                  <motion.nav
                    className="menu__nav"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 }
                    }}
                  >
                    <ul className="menu__list">
                      {menuItems.map((item, index) => (
                        <MenuItem
                          key={item.to}
                          to={item.to}
                          onClick={handleToggle}
                          isActive={isActiveRoute(item)}
                          index={index}
                          isMobile={isMobile}
                        >
                          {item.label}
                        </MenuItem>
                      ))}
                    </ul>
                  </motion.nav>

                  {/* Social Links */}
                  <SocialLinks isMobile={isMobile} />

                  {/* Menu Footer */}
                  <motion.div
                    className="menu__footer"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.6 }
                      }
                    }}
                  >
                    <p className="copyright">© 2024 {logotext}. All rights reserved.</p>
                    <p className="location">Thiruvananthapuram, Kerala, India</p>
                  </motion.div>
                </motion.div>
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
