// FILE: src/components/blog-section/BlogSection.js

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./style.css";

const BlogSection = ({ posts }) => {
  return (
    <section className="blog-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Latest Insights</h2>
          <p>Thoughts and articles on AI, Machine Learning, and Technology</p>
          <div className="section-underline"></div>
        </motion.div>

        <div className="blog-grid">
          {posts.map((post, index) => (
            <motion.div
              key={index}
              className="blog-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="blog-image">
                <img src={post.image} alt={post.title} />
                <div className="blog-date">{post.date}</div>
              </div>
              <div className="blog-content">
                <div className="blog-category">{post.category}</div>
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <Link to={post.link} className="read-more">
                  Read More
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="blog-cta">
          <Link to="/blog" className="view-all-btn">
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
