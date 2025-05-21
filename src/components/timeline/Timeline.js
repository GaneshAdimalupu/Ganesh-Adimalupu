// FILE: src/components/timeline/Timeline.js

import React from "react";
import { motion } from "framer-motion";
import "./style.css";

const Timeline = ({ data }) => {
  return (
    <div className="timeline-container">
      {data.map((item, index) => (
        <motion.div
          key={index}
          className="timeline-item"
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="timeline-content">
            <div className="timeline-date">{item.date}</div>
            <h3 className="timeline-title">{item.jobtitle}</h3>
            <div className="timeline-company">{item.where}</div>
            {item.description && (
              <p className="timeline-description">{item.description}</p>
            )}
            {item.achievements && (
              <div className="timeline-achievements">
                <h4>Key Achievements:</h4>
                <ul>
                  {item.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Timeline;
