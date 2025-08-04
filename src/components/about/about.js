// components/about/about.js - COMPACT ENHANCED VERSION
import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import './about.css';

const About = () => {
  const [animatedStats, setAnimatedStats] = useState({});
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  // Compact stats data
  const stats = [
    { number: '15+', label: 'Projects', icon: '🚀' },
    { number: '32+', label: 'Certificates', icon: '🏆' },
    { number: '2+', label: 'Years Exp', icon: '⏳' },
    { number: '8+', label: 'Tech Stack', icon: '💻' }
  ];

  // Compact skills list
  const skills = [
    'Machine Learning', 'Python', 'React.js', 'Node.js',
    'TensorFlow', 'MongoDB', 'Docker', 'AWS',
    'Deep Learning', 'FastAPI', 'PostgreSQL', 'Git'
  ];

  // Key achievements
  const achievements = [
    { emoji: '🏅', text: 'IEEE Best Paper Award for ML Research' },
    { emoji: '🌟', text: 'Active Open Source Contributor' },
    { emoji: '🎯', text: 'Led AI-powered Solution Development' },
    { emoji: '📚', text: 'Published Research in Food Recommendation Systems' }
  ];

  // Animate stats on scroll
  useEffect(() => {
    if (isInView) {
      controls.start('visible');

      // Initialize with 0 values first
      const initialStats = {};
      stats.forEach((stat, index) => {
        initialStats[index] = '0' + (stat.number.includes('+') ? '+' : '');
      });
      setAnimatedStats(initialStats);

      // Animate numbers with shorter duration and smoother transitions
      stats.forEach((stat, index) => {
        const finalNumber = parseInt(stat.number);
        let current = 0;
        const increment = finalNumber / 25; // Smoother animation
        const hasPlus = stat.number.includes('+');

        const timer = setInterval(() => {
          current += increment;
          if (current >= finalNumber) {
            setAnimatedStats(prev => ({
              ...prev,
              [index]: stat.number
            }));
            clearInterval(timer);
          } else {
            const displayNumber = Math.floor(current);
            setAnimatedStats(prev => ({
              ...prev,
              [index]: displayNumber + (hasPlus ? '+' : '')
            }));
          }
        }, 50);

        // Cleanup function
        return () => clearInterval(timer);
      });
    }
  }, [isInView, controls]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="about" className="section" ref={ref}>
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={controls}
          variants={itemVariants}
        >
          About Me
        </motion.h2>

        <motion.div
          className="about-main"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Left Side - Text & Skills */}
          <div className="about-text-side">
            <motion.div variants={itemVariants}>
              <p className="section-text highlight">
                Machine Learning Engineer & AI Solutions Developer passionate about creating
                intelligent systems that solve real-world problems.
              </p>
              <p className="section-text">
                I specialize in building scalable AI applications, from recommendation systems
                to predictive analytics, combining deep technical knowledge with practical
                business solutions.
              </p>
              <p className="section-text">
                My journey spans full-stack development and machine learning, with a focus
                on delivering innovative solutions that drive meaningful impact and enhance
                user experiences.
              </p>
            </motion.div>

            <motion.div className="skills-compact" variants={itemVariants}>
              <h3>🛠️ Technical Arsenal</h3>
              <div className="skills-cloud">
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    className="skill-tag"
                    variants={cardVariants}
                    whileHover={{
                      y: -3,
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Side - Stats & Achievements */}
          <div className="stats-overview">
            <motion.div className="stats-cards" variants={itemVariants}>
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="stat-card"
                  variants={cardVariants}
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="stat-icon">{stat.icon}</span>
                  <motion.div
                    className="stat-number"
                    initial={{ scale: 1 }}
                    animate={{ scale: animatedStats[index] !== stats[index].number ? [1, 1.05, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {animatedStats[index] || '0+'}
                  </motion.div>
                  <p className="stat-label">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div className="achievements-highlight" variants={itemVariants}>
              <h3>🏆 Key Achievements</h3>
              <div className="achievement-list">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    className="achievement-item"
                    variants={cardVariants}
                    whileHover={{
                      x: 10,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <span className="achievement-emoji">{achievement.emoji}</span>
                    <span className="achievement-text">{achievement.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Philosophy Section */}
        <motion.div className="philosophy-section" variants={itemVariants}>
          <p className="philosophy-text">
            "Innovation distinguishes between a leader and a follower. I strive to push
            the boundaries of what's possible with AI, creating solutions that anticipate
            tomorrow's challenges."
          </p>
          <p className="philosophy-author">- Adimalupu Ganesh</p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
