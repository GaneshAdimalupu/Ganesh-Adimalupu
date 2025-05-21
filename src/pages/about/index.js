import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  dataabout,
  meta,
  worktimeline,
  skills,
  services,
} from "../../content_option";
import SkillsBar from "../../components/skillsbar";

export const About = () => {
  return (
    <HelmetProvider>
      <Container className="About-header">
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
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <motion.h1
              className="display-4 mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              About me
            </motion.h1>
            <motion.hr
              className="t_border my-4 ml-0 text-left"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1 }}
            />
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="5">
            <motion.h3
              className="color_sec py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {dataabout.title}
            </motion.h3>
          </Col>
          <Col lg="7" className="d-flex align-items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p>{dataabout.aboutme}</p>
            </motion.div>
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="5">
            <motion.h3
              className="color_sec py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Work Experience
            </motion.h3>
          </Col>
          <Col lg="7">
            <motion.table
              className="table caption-top"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <tbody>
                {worktimeline.map((data, i) => {
                  return (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + (i * 0.1) }}
                    >
                      <th scope="row">{data.jobtitle}</th>
                      <td>{data.where}</td>
                      <td>{data.date}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </motion.table>
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="5">
            <motion.h3
              className="color_sec py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              Skills & Expertise
            </motion.h3>
          </Col>
          <Col lg="7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <SkillsBar skills={skills} />
            </motion.div>
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="5">
            <motion.h3
              className="color_sec py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              Services
            </motion.h3>
          </Col>
          <Col lg="7">
            {services.map((data, i) => {
              return (
                <motion.div
                  className="service_ py-4"
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 1 + (i * 0.1) }}
                >
                  <h5 className="service__title">{data.title}</h5>
                  <p className="service_desc">{data.description}</p>
                </motion.div>
              );
            })}
          </Col>
        </Row>

        <Row className="sec_sp">
          <Col lg="5">
            <motion.h3
              className="color_sec py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              Education
            </motion.h3>
          </Col>
          <Col lg="7">
            <motion.div
              className="education-timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <div className="education-item">
                <h4>Bachelor of Technology - BTech, Computer Science</h4>
                <p className="institution">St Thomas Institution of Science and Technology</p>
                <p className="edu-date">Graduated: April 2025</p>
              </div>

              <div className="education-item">
                <h4>Higher Secondary School, Mathematics</h4>
                <p className="institution">Narayana Junior College - India</p>
                <p className="edu-date">September 2021</p>
              </div>

              <div className="education-item">
                <h4>Secondary School Certificate</h4>
                <p className="institution">Christu Jyothi High School</p>
                <p className="edu-date">March 2019</p>
              </div>
            </motion.div>
          </Col>
        </Row>

        <Row className="sec_sp">
          <Col lg="5">
            <motion.h3
              className="color_sec py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
            >
              Certifications
            </motion.h3>
          </Col>
          <Col lg="7">
            <motion.div
              className="certifications-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              <div className="certification-item">
                <h5>AI & ML Internship</h5>
                <p>HDLC Info Technologies</p>
              </div>
              <div className="certification-item">
                <h5>Data Science & ML Internship</h5>
                <p>Devtown</p>
              </div>
              <div className="certification-item">
                <h5>Artificial Intelligence Program</h5>
                <p>TIITG</p>
              </div>
              <div className="certification-item">
                <h5>Android App Development</h5>
                <p>STIST</p>
              </div>
              <div className="certification-item">
                <h5>Machine Learning in Python & R</h5>
                <p>Udemy</p>
              </div>
              <div className="certification-item">
                <h5>Automated ML with Google AutoML & Apple CreateML</h5>
                <p>Udemy</p>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </HelmetProvider>
  );
};
