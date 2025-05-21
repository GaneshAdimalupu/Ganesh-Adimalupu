// FILE: src/components/ai-experience/AiExperienceSection.js (continued)

import React from "react";
import { motion } from "framer-motion";
import "./style.css";
import { FaMicrochip, FaBrain, FaCode, FaChartLine, FaDatabase, FaRobot } from "react-icons/fa";

const AiExperienceSection = () => {
  const experiences = [
    {
      icon: <FaMicrochip />,
      title: "Machine Learning",
      description: "Building custom machine learning models using scikit-learn, TensorFlow, and Keras for classification, regression, and clustering tasks.",
    },
    {
      icon: <FaBrain />,
      title: "Deep Learning",
      description: "Implementing neural networks for image recognition, natural language processing, and sequence prediction.",
    },
    {
      icon: <FaCode />,
      title: "AI Development",
      description: "Developing end-to-end AI solutions from data collection to deployment, creating APIs and integrations for production environments.",
    },
    {
      icon: <FaChartLine />,
      title: "Data Analysis",
      description: "Analyzing large datasets to extract meaningful insights, creating visualizations and reports to communicate findings.",
    },
    {
      icon: <FaDatabase />,
      title: "Data Engineering",
      description: "Building data pipelines for efficient processing, cleaning, and transformation of data for AI applications.",
    },
    {
      icon: <FaRobot />,
      title: "AI Research",
      description: "Staying updated with the latest research papers and implementing cutting-edge techniques in AI projects.",
    }
  ];

  return (
    <section className="ai-experience-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>AI & Machine Learning Expertise</h2>
          <p>Leveraging cutting-edge technologies to build intelligent solutions</p>
          <div className="section-underline"></div>
        </motion.div>

        <div className="experience-grid">
          {experiences.map((item, index) => (
            <motion.div
              key={index}
              className="experience-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" }}
            >
              <div className="experience-icon">
                {item.icon}
              </div>
              <h3 className="experience-title">{item.title}</h3>
              <p className="experience-description">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AiExperienceSection;
