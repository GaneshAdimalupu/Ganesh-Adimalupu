

// FILE: src/pages/home/index.js

import React, { useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { introdata, meta } from '../../content_option';
import HeroSection from '../../components/hero-section/HeroSection';
import AiExperienceSection from '../../components/ai-experience/AiExperienceSection';
import ProjectsShowcase from '../../components/projectsshowcase';
import ProjectAnalytics from '../../components/analytics/ProjectAnalytics'; // Import the component
import BlogSection from '../../components/blog-section/BlogSection';
import SkillsBar from '../../components/skillsbar';
import { dataportfolio, skills } from '../../content_option';
import './style.css';

// Sample blog posts (these should be moved to content_option.js in production)
const blogPosts = [
  {
    title: "Understanding Neural Networks: A Beginner's Guide",
    excerpt: "Neural networks are the foundation of deep learning. Let's explore how they work and why they're so powerful for AI applications.",
    category: "Deep Learning",
    date: "May 15, 2023",
    image: "https://via.placeholder.com/600x400?text=Neural+Networks",
    link: "/blog/understanding-neural-networks"
  },
  {
    title: "5 Python Libraries Every Data Scientist Should Know",
    excerpt: "Python has become the dominant language for data science. Here are the essential libraries that will boost your productivity.",
    category: "Data Science",
    date: "Apr 22, 2023",
    image: "https://via.placeholder.com/600x400?text=Python+Libraries",
    link: "/blog/python-libraries-data-science"
  },
  {
    title: "Building a Recommendation System with TensorFlow",
    excerpt: "Learn how to create a personalized recommendation system using collaborative filtering techniques with TensorFlow.",
    category: "Machine Learning",
    date: "Mar 10, 2023",
    image: "https://via.placeholder.com/600x400?text=Recommendation+System",
    link: "/blog/recommendation-system-tensorflow"
  }
];

export const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Only show 3 projects on the home page
  const featuredProjects = dataportfolio.slice(0, 3);

  return (
    <HelmetProvider>
          <Helmet>
        <meta charSet="utf-8" />
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />

        {/* OpenGraph tags for better social sharing */}
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://GaneshAdimalupu.github.io/Ganesh-Adimalupu/" />
        <meta property="og:image" content="https://GaneshAdimalupu.github.io/Ganesh-Adimalupu/preview.phg" />

        {/* Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content="https://GaneshAdimalupu.github.io/Ganesh-Adimalupu/preview.png" />

        {/* Keywords */}
        <meta name="keywords" content="Ganesh Adimalupu, Machine Learning, AI, Python, Portfolio, Developer, Data Science, Neural Networks, Deep Learning" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://GaneshAdimalupu.github.io/Ganesh-Adimalupu/" />
      </Helmet>


      {/* Hero Section */}
      <HeroSection />
            {/* Project Analytics - Add this section */}
      <section className="analytics-section">
        <div className="container">
          <ProjectAnalytics />
        </div>
      </section>

      {/* AI Experience Section */}
      <AiExperienceSection />

      {/* Skills Section */}
      <section className="skills-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Technical Skills</h2>
            <p>Technologies and tools I work with to create intelligent solutions</p>
            <div className="section-underline"></div>
          </motion.div>

          <SkillsBar skills={skills} />
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="projects-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Featured Projects</h2>
            <p>Showcasing some of my recent work in AI and development</p>
            <div className="section-underline"></div>
          </motion.div>

          <ProjectsShowcase projects={featuredProjects} />

          <div className="view-more-container">
            <motion.a
              href="/portfolio"
              className="view-more-btn"
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              whileTap={{ y: 0, boxShadow: "0 5px 10px rgba(0,0,0,0.1)" }}
            >
              View All Projects
            </motion.a>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <BlogSection posts={blogPosts} />
    </HelmetProvider>
  );
};
