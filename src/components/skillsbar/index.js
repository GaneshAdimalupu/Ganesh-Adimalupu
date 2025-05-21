// FILE: src/components/skillsbar/index.js

import React from "react";
import { motion } from "framer-motion";
import "./style.css";
import {
  FaPython, FaJava, FaGit,
  FaDatabase, FaBrain, FaChartLine,
  FaCode, FaServer, FaLaptopCode,
  FaRobot, FaNetworkWired,
  FaCogs, FaChartBar
} from "react-icons/fa";
import {
  SiTensorflow, SiScikitlearn, SiKeras,
  SiJupyter, SiPandas, SiNumpy,
  SiFlask, SiDocker
} from "react-icons/si";

const getSkillIcon = (skillName) => {
  // Map skills to corresponding icons
  const iconMap = {
    "Python": <FaPython />,
    "TensorFlow & Keras": <SiTensorflow />,
    "Scikit-learn": <SiScikitlearn />,
    "Data Preprocessing": <FaChartLine />,
    "NLP": <FaCode />,
    "Deep Learning": <FaBrain />,
    "SQL": <FaDatabase />,
    "Java": <FaJava />,
    "Git": <FaGit />,
    "Keras": <SiKeras />,
    "Jupyter": <SiJupyter />,
    "Pandas": <SiPandas />,
    "NumPy": <SiNumpy />,
    "Docker": <SiDocker />,
    "Flask/FastAPI": <SiFlask />,
    "Data Visualization": <FaChartBar />
  };

  // Return the matching icon or a default icon
  return iconMap[skillName] || <FaCogs />;
};

const SkillsBar = ({ skills }) => {
  return (
    <div className="skills-wrapper">
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            className="skill-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="skill-icon">
              {getSkillIcon(skill.name)}
            </div>
            <div className="skill-content">
              <h3 className="skill-name">{skill.name}</h3>
              <div className="skill-bar-container">
                <motion.div
                  className="skill-progress-bar"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                >
                  <div className="skill-percentage">{skill.value}%</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsBar;
