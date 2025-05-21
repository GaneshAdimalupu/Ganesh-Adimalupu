import React, { useEffect, useState } from "react";
import "./style.css";
import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";

const Themetoggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const themetoggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const spring = {
    type: "spring",
    stiffness: 300,
    damping: 20
  };

  return (
    <motion.div
      className="theme-toggle-wrapper"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="theme-toggle" onClick={themetoggle}>
        <motion.div
          className="theme-toggle-track"
          animate={{
            backgroundColor: theme === "dark" ? "#3f3f3f" : "#ffcc66"
          }}
        >
          <div className="theme-icons">
            <span className="sun-icon"><FiSun /></span>
            <span className="moon-icon"><FiMoon /></span>
          </div>
          <motion.div
            className="theme-toggle-thumb"
            animate={{
              x: theme === "dark" ? 0 : 24,
              backgroundColor: theme === "dark" ? "#eeeeee" : "#ffffff"
            }}
            transition={spring}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Themetoggle;
