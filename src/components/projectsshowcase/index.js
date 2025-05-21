// FILE: src/components/projectsshowcase/index.js

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaTimes } from "react-icons/fa";
import "./style.css";

const ProjectCard = ({ project, onClick }) => {
  return (
    <motion.div
      className="project-card"
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      layout
      onClick={() => onClick(project)}
    >
      <div className="project-image">
        <img src={project.img} alt={project.title} />
        <div className="project-overlay">
          <div className="overlay-content">
            <h3>{project.title}</h3>
            <button className="view-project-btn">View Details</button>
          </div>
        </div>
      </div>
      <div className="project-info">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <div className="project-tags">
          {project.categories?.slice(0, 3).map((category, index) => (
            <span key={index} className="project-tag">
              {category}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectModal = ({ project, isOpen, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="project-modal"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <button className="close-modal" onClick={onClose}>
              <FaTimes />
            </button>

            <div className="modal-content">
              <div className="modal-image">
                <img src={project.img} alt={project.title} />
              </div>

              <div className="modal-details">
                <h2 className="modal-title">{project.title}</h2>

                <div className="modal-categories">
                  {project.categories?.map((category, index) => (
                    <span key={index} className="modal-category">
                      {category}
                    </span>
                  ))}
                </div>

                <div className="modal-description">
                  <p>{project.fullDescription}</p>
                </div>

                <div className="modal-tech">
                  <h4>Technologies</h4>
                  <div className="tech-stack">
                    {project.technologies?.map((tech, index) => (
                      <span key={index} className="tech-item">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="modal-links">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-link github-link"
                    >
                      <FaGithub /> GitHub
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-link demo-link"
                    >
                      <FaExternalLinkAlt /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ProjectsShowcase = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState([]);

  // Get unique categories
  const categories = ["All", ...new Set(projects.flatMap(project => project.categories || []))];

  useEffect(() => {
    setFilteredProjects(
      filter === "All"
        ? projects
        : projects.filter(project => project.categories && project.categories.includes(filter))
    );
  }, [filter, projects]);

  const openModal = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <section className="projects-section">
      <div className="filter-container">
        {categories.map((category) => (
          <motion.button
            key={category}
            className={`filter-btn ${filter === category ? "active" : ""}`}
            onClick={() => setFilter(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </div>

      <motion.div
        className="projects-grid"
        layout
      >
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              onClick={openModal}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <ProjectModal
        project={selectedProject}
        isOpen={modalOpen}
        onClose={closeModal}
      />
    </section>
  );
};

export default ProjectsShowcase;
