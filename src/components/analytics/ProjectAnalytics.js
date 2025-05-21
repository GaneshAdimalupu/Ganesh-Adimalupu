// FILE: src/components/analytics/ProjectAnalytics.js

import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaGithub, FaEye, FaStar } from 'react-icons/fa';
import './style.css';

const ProjectAnalytics = ({ stats }) => {
  const defaultStats = {
    projectsCompleted: 6,
    codeCommits: "250+",
    profileViews: "500+",
    starsEarned: "25+"
  };

  const finalStats = stats || defaultStats;

  return (
    <div className="project-analytics">
      <motion.div
        className="analytics-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="analytics-item"
          whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="analytics-icon">
            <FaCode />
          </div>
          <div className="analytics-content">
            <h3>{finalStats.projectsCompleted}</h3>
            <p>Projects Completed</p>
          </div>
        </motion.div>

        <motion.div
          className="analytics-item"
          whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="analytics-icon">
            <FaGithub />
          </div>
          <div className="analytics-content">
            <h3>{finalStats.codeCommits}</h3>
            <p>Code Commits</p>
          </div>
        </motion.div>

        <motion.div
          className="analytics-item"
          whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="analytics-icon">
            <FaEye />
          </div>
          <div className="analytics-content">
            <h3>{finalStats.profileViews}</h3>
            <p>Profile Views</p>
          </div>
        </motion.div>

        <motion.div
          className="analytics-item"
          whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="analytics-icon">
            <FaStar />
          </div>
          <div className="analytics-content">
            <h3>{finalStats.starsEarned}</h3>
            <p>GitHub Stars</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProjectAnalytics;
