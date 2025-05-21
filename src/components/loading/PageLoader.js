// FILE: src/components/loading/PageLoader.js

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './style.css';

const PageLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or wait for resources
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds for demo, adjust as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && (
        <motion.div
          className="page-loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: loading ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="loader-content">
            <div className="loader-circle"></div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Ganesh Adimalupu
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Loading Portfolio...
            </motion.p>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default PageLoader;
