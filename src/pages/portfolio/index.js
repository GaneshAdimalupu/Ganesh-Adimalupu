import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { dataportfolio, meta } from "../../content_option";
import ProjectsShowcase from "../../components/projectsshowcase";
import "./style.css";

export const Portfolio = () => {
  return (
    <HelmetProvider>
      <Container className="portfolio-page">
        // Make sure to update the Helmet component in each page
        // For example, in src/pages/home/index.js:

        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />

          {/* OpenGraph tags for better social sharing */}
          <meta property="og:title" content={meta.title} />
          <meta property="og:description" content={meta.description} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://yourusername.github.io/portfolio/" />
          <meta property="og:image" content="https://yourusername.github.io/portfolio/thumbnail.jpg" />

          {/* Twitter card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={meta.title} />
          <meta name="twitter:description" content={meta.description} />
          <meta name="twitter:image" content="https://yourusername.github.io/portfolio/thumbnail.jpg" />

          {/* Keywords */}
          <meta name="keywords" content="Ganesh Adimalupu, Machine Learning, AI, Python, Portfolio, Developer" />
        </Helmet>

        {/* Page Header */}
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="display-4 mb-4"
            >
              Projects & Work
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lead"
            >
              Showcasing my journey through AI/ML and development projects
            </motion.p>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        {/* Projects Showcase */}
        <Row>
          <Col lg="12">
            <ProjectsShowcase projects={dataportfolio} />
          </Col>
        </Row>
      </Container>
    </HelmetProvider>
  );
};
