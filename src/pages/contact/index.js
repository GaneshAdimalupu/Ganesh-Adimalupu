// FILE: src/pages/contact/index.js

import React, { useState, useRef } from "react";
import * as emailjs from "emailjs-com";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { motion } from "framer-motion";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { meta, contactConfig } from "../../content_option";
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheck } from "react-icons/fi";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export const ContactUs = () => {
  const formRef = useRef(null);
  const [formData, setFormdata] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    loading: false,
    show: false,
    alertmessage: "",
    variant: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
      isValid = false;
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setFormdata({ ...formData, loading: true });

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: contactConfig.YOUR_EMAIL,
      };

      emailjs
        .send(
          contactConfig.YOUR_SERVICE_ID,
          contactConfig.YOUR_TEMPLATE_ID,
          templateParams,
          contactConfig.YOUR_USER_ID
        )
        .then(
          (result) => {
            setFormdata({
              name: "",
              email: "",
              subject: "",
              message: "",
              loading: false,
              alertmessage: "Message sent successfully!",
              variant: "success",
              show: true,
            });
            setIsSubmitted(true);
            formRef.current.reset();
          },
          (error) => {
            console.log(error.text);
            setFormdata({
              ...formData,
              loading: false,
              alertmessage: `Failed to send message. Please try again.`,
              variant: "danger",
              show: true,
            });
          }
        );
    }
  };

  const handleChange = (e) => {
    setFormdata({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear error when typing
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: "",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <HelmetProvider>
      <Container className="contact-page">
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

        <motion.div
          className="contact-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Get In Touch</h1>
          <p>Have a project in mind or want to discuss potential opportunities? I'd love to hear from you!</p>
          <div className="header-underline"></div>
        </motion.div>

        <Row className="contact-content">
          <Col lg="5" className="contact-info-col">
            <motion.div
              className="contact-info-card"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="contact-intro">
                <h3>Let's Connect</h3>
                <p>{contactConfig.description}</p>
              </motion.div>

              <motion.div variants={itemVariants} className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">
                    <FiMail />
                  </div>
                  <div className="contact-text">
                    <h5>Email</h5>
                    <a href={`mailto:${contactConfig.YOUR_EMAIL}`}>
                      {contactConfig.YOUR_EMAIL}
                    </a>
                  </div>
                </div>

                {contactConfig.YOUR_FONE && (
                  <div className="contact-item">
                    <div className="contact-icon">
                      <FiPhone />
                    </div>
                    <div className="contact-text">
                      <h5>Phone</h5>
                      <a href={`tel:${contactConfig.YOUR_FONE}`}>
                        {contactConfig.YOUR_FONE}
                      </a>
                    </div>
                  </div>
                )}

                <div className="contact-item">
                  <div className="contact-icon">
                    <FiMapPin />
                  </div>
                  <div className="contact-text">
                    <h5>Location</h5>
                    <p>Thiruvananthapuram, Kerala, India</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="contact-social">
                <h5>Connect with me on</h5>
                <div className="social-links">
                  <a href="https://github.com/GaneshAdimalupu" target="_blank" rel="noreferrer" className="social-link">
                    <FaGithub />
                  </a>
                  <a href="https://linkedin.com/in/ganesh-adimalupu-62b407239" target="_blank" rel="noreferrer" className="social-link">
                    <FaLinkedin />
                  </a>
                  <a href="https://twitter.com/GaneshAdimalupu" target="_blank" rel="noreferrer" className="social-link">
                    <FaTwitter />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </Col>

          <Col lg="7" className="contact-form-col">
            {!isSubmitted ? (
              <motion.div
                className="contact-form-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3>Send Me a Message</h3>

                {formData.show && (
                  <Alert
                    variant={formData.variant}
                    className="alert-message"
                    onClose={() => setFormdata({...formData, show: false})}
                    dismissible
                  >
                    {formData.alertmessage}
                  </Alert>
                )}

                <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className={`form-control ${formErrors.subject ? 'is-invalid' : ''}`}
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                    {formErrors.subject && <div className="invalid-feedback">{formErrors.subject}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      className={`form-control ${formErrors.message ? 'is-invalid' : ''}`}
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                    {formErrors.message && <div className="invalid-feedback">{formErrors.message}</div>}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="submit-btn"
                    disabled={formData.loading}
                  >
                    {formData.loading ? "Sending..." : "Send Message"}
                    <FiSend />
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                className="message-success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="success-icon">
                  <FiCheck />
                </div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="reset-btn"
                  onClick={() => setIsSubmitted(false)}
                >
                  Send Another Message
                </motion.button>
              </motion.div>
            )}
          </Col>
        </Row>
      </Container>
    </HelmetProvider>
  );
};
