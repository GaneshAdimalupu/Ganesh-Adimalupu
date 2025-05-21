// FILE: src/components/hero-section/HeroSection.js

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { introdata } from '../../content_option';
import './style.css';
import Typewriter from 'typewriter-effect';
// Update the import path to the correct location
import ProfileImage from '../../assets/images/profile.svg';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span
                className="hero-greeting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Hello, I'm
              </motion.span>

              <motion.h1
                className="hero-name"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {introdata.title}
              </motion.h1>

              <motion.div
                className="hero-roles"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Typewriter
                  options={{
                    strings: [
                      introdata.animated.first,
                      introdata.animated.second,
                      introdata.animated.third,
                    ],
                    autoStart: true,
                    loop: true,
                    deleteSpeed: 20,
                  }}
                />
              </motion.div>

              <motion.p
                className="hero-description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {introdata.description}
              </motion.p>

              <motion.div
                className="hero-buttons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Link to="/portfolio">
                  <motion.button
                    className="btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Portfolio
                  </motion.button>
                </Link>
                <Link to="/contact">
                  <motion.button
                    className="btn-outline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contact Me
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <div className="col-lg-6">
            <motion.div
              className="hero-image-container"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="hero-background-shape"></div>
              <div className="hero-image">
                {/* Use the imported ProfileImage variable here instead of a hardcoded path */}
                <img src={ProfileImage} alt="Ganesh Adimalupu" />
              </div>
              <div className="hero-particles"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
