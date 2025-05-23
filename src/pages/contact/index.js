// FILE: src/pages/contact/index.js

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import * as emailjs from "emailjs-com";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Row, Col } from "react-bootstrap";
import { meta, contactConfig } from "../../content_option";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiCheck,
  FiClock,
  FiMessageCircle,
  FiUser,
  FiAlertCircle
} from "react-icons/fi";
import { FaGithub, FaLinkedin, FaTwitter, FaWhatsapp, FaTelegram } from "react-icons/fa";

// Custom hooks for mobile optimization
const useMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width <= breakpoint);

      if (width <= 576) setScreenSize('mobile-small');
      else if (width <= 768) setScreenSize('mobile');
      else if (width <= 991) setScreenSize('tablet');
      else setScreenSize('desktop');
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return { isMobile, screenSize };
};

const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isIntersecting];
};

// Form validation hook
const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateField = useCallback((name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;

      case 'subject':
        if (!value.trim()) {
          newErrors.subject = 'Subject is required';
        } else if (value.trim().length < 5) {
          newErrors.subject = 'Subject must be at least 5 characters';
        } else {
          delete newErrors.subject;
        }
        break;

      case 'message':
        if (!value.trim()) {
          newErrors.message = 'Message is required';
        } else if (value.trim().length < 10) {
          newErrors.message = 'Message must be at least 10 characters';
        } else {
          delete newErrors.message;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [errors]);

  const validateForm = useCallback((formData) => {
    const fields = ['name', 'email', 'subject', 'message'];
    let isValid = true;

    fields.forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    return isValid;
  }, [validateField]);

  return { errors, validateField, validateForm, setErrors };
};

// Enhanced Contact Info Component
const ContactInfoCard = React.memo(({ isMobile }) => {
  const [cardRef, isVisible] = useIntersectionObserver();

  const contactMethods = useMemo(() => [
    {
      icon: <FiMail />,
      title: "Email",
      value: contactConfig.YOUR_EMAIL,
      link: `mailto:${contactConfig.YOUR_EMAIL}`,
      description: "Send me an email anytime"
    },
    {
      icon: <FiPhone />,
      title: "Phone",
      value: contactConfig.YOUR_FONE,
      link: `tel:${contactConfig.YOUR_FONE}`,
      description: "Call for urgent matters"
    },
    {
      icon: <FiMapPin />,
      title: "Location",
      value: "Thiruvananthapuram, Kerala, India",
      description: "Available for remote work globally"
    },
    {
      icon: <FiClock />,
      title: "Response Time",
      value: "Within 24 hours",
      description: "Typically respond within a few hours"
    }
  ], []);

  const socialLinks = useMemo(() => [
    {
      icon: <FaGithub />,
      name: "GitHub",
      url: "https://github.com/GaneshAdimalupu",
      color: "#333"
    },
    {
      icon: <FaLinkedin />,
      name: "LinkedIn",
      url: "https://linkedin.com/in/ganesh-adimalupu-62b407239",
      color: "#0077B5"
    },
    {
      icon: <FaTwitter />,
      name: "Twitter",
      url: "https://twitter.com/GaneshAdimalupu",
      color: "#1DA1F2"
    },
    {
      icon: <FaWhatsapp />,
      name: "WhatsApp",
      url: `https://wa.me/${contactConfig.YOUR_FONE?.replace(/[^0-9]/g, '')}`,
      color: "#25D366"
    },
    {
      icon: <FaTelegram />,
      name: "Telegram",
      url: "https://t.me/GaneshAdimalupu",
      color: "#0088CC"
    }
  ], []);

  const cardVariants = useMemo(() => ({
    hidden: { opacity: 0, x: isMobile ? 0 : -30, y: isMobile ? 30 : 0 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }), [isMobile]);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  }), []);

  return (
    <motion.div
      ref={cardRef}
      className="contact-info-card"
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <motion.div className="contact-intro" variants={itemVariants}>
        <h3>Let's Connect</h3>
        <p>{contactConfig.description}</p>
      </motion.div>

      <motion.div className="contact-methods" variants={itemVariants}>
        {contactMethods.map((method, index) => (
          <motion.div
            key={index}
            className="contact-method"
            variants={itemVariants}
            whileHover={!isMobile ? { x: 5 } : undefined}
          >
            <div className="method-icon">
              {method.icon}
            </div>
            <div className="method-content">
              <h5>{method.title}</h5>
              {method.link ? (
                <a href={method.link} className="method-value">
                  {method.value}
                </a>
              ) : (
                <span className="method-value">{method.value}</span>
              )}
              <p className="method-description">{method.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="social-connect" variants={itemVariants}>
        <h5>Connect on Social Media</h5>
        <div className="social-links">
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              style={{ '--social-color': social.color }}
              whileHover={!isMobile ? {
                scale: 1.1,
                y: -3,
                backgroundColor: social.color,
                color: '#fff'
              } : undefined}
              whileTap={{ scale: 0.95 }}
              title={social.name}
            >
              {social.icon}
            </motion.a>
          ))}
        </div>
      </motion.div>

      <motion.div className="quick-actions" variants={itemVariants}>
        <h5>Quick Actions</h5>
        <div className="action-buttons">
          <motion.a
            href={`mailto:${contactConfig.YOUR_EMAIL}?subject=Quick Inquiry`}
            className="action-btn email-btn"
            whileHover={!isMobile ? { scale: 1.05 } : undefined}
            whileTap={{ scale: 0.95 }}
          >
            <FiMail />
            Quick Email
          </motion.a>
          <motion.a
            href={`https://wa.me/${contactConfig.YOUR_FONE?.replace(/[^0-9]/g, '')}?text=Hi! I'd like to discuss a project.`}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn whatsapp-btn"
            whileHover={!isMobile ? { scale: 1.05 } : undefined}
            whileTap={{ scale: 0.95 }}
          >
            <FaWhatsapp />
            WhatsApp
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
});

// Enhanced Contact Form Component
const ContactForm = React.memo(({ isMobile, onSuccess }) => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formState, setFormState] = useState({
    isSubmitting: false,
    submitCount: 0,
    lastSubmitTime: null
  });

  const { errors, validateField, validateForm, setErrors } = useFormValidation();
  const [formRef2, isVisible] = useIntersectionObserver();

  // Rate limiting
  const canSubmit = useMemo(() => {
    const now = Date.now();
    const timeSinceLastSubmit = formState.lastSubmitTime ? now - formState.lastSubmitTime : Infinity;
    return formState.submitCount < 3 && timeSinceLastSubmit > 60000; // 1 minute cooldown
  }, [formState.submitCount, formState.lastSubmitTime]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time validation with debounce
    const timeoutId = setTimeout(() => {
      validateField(name, value);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [validateField]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!canSubmit) {
      setErrors({ submit: 'Please wait before submitting again.' });
      return;
    }

    if (!validateForm(formData)) {
      setErrors({ submit: 'Please fix the errors above.' });
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true }));
    setErrors({});

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: contactConfig.YOUR_EMAIL,
        timestamp: new Date().toLocaleString()
      };

      await emailjs.send(
        contactConfig.YOUR_SERVICE_ID,
        contactConfig.YOUR_TEMPLATE_ID,
        templateParams,
        contactConfig.YOUR_USER_ID
      );

      // Reset form and show success
      setFormData({ name: "", email: "", subject: "", message: "" });
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        submitCount: prev.submitCount + 1,
        lastSubmitTime: Date.now()
      }));

      if (formRef.current) {
        formRef.current.reset();
      }

      onSuccess?.();

    } catch (error) {
      console.error('Email send error:', error);
      setErrors({
        submit: 'Failed to send message. Please try again or contact me directly.'
      });
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [formData, validateForm, canSubmit, onSuccess, setErrors]);

  const formVariants = useMemo(() => ({
    hidden: { opacity: 0, x: isMobile ? 0 : 30, y: isMobile ? 30 : 0 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2
      }
    }
  }), [isMobile]);

  return (
    <motion.div
      ref={formRef2}
      className="contact-form-container"
      variants={formVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <div className="form-header">
        <h3>Send a Message</h3>
        <p>Fill out the form below and I'll get back to you as soon as possible.</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="contact-form" noValidate>
        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            <FiUser className="label-icon" />
            Name *
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              id="name"
              name="name"
              className={`form-control ${errors.name ? 'error' : ''}`}
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              disabled={formState.isSubmitting}
              autoComplete="name"
            />
            {errors.name && (
              <div className="error-message">
                <FiAlertCircle />
                {errors.name}
              </div>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            <FiMail className="label-icon" />
            Email *
          </label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errors.email ? 'error' : ''}`}
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={formState.isSubmitting}
              autoComplete="email"
            />
            {errors.email && (
              <div className="error-message">
                <FiAlertCircle />
                {errors.email}
              </div>
            )}
          </div>
        </div>

        {/* Subject Field */}
        <div className="form-group">
          <label htmlFor="subject" className="form-label">
            <FiMessageCircle className="label-icon" />
            Subject *
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              id="subject"
              name="subject"
              className={`form-control ${errors.subject ? 'error' : ''}`}
              placeholder="What's this about?"
              value={formData.subject}
              onChange={handleChange}
              disabled={formState.isSubmitting}
            />
            {errors.subject && (
              <div className="error-message">
                <FiAlertCircle />
                {errors.subject}
              </div>
            )}
          </div>
        </div>

        {/* Message Field */}
        <div className="form-group">
          <label htmlFor="message" className="form-label">
            <FiMessageCircle className="label-icon" />
            Message *
          </label>
          <div className="input-wrapper">
            <textarea
              id="message"
              name="message"
              rows={isMobile ? "4" : "6"}
              className={`form-control ${errors.message ? 'error' : ''}`}
              placeholder="Tell me about your project or inquiry..."
              value={formData.message}
              onChange={handleChange}
              disabled={formState.isSubmitting}
            />
            <div className="character-count">
              {formData.message.length}/1000
            </div>
            {errors.message && (
              <div className="error-message">
                <FiAlertCircle />
                {errors.message}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-group">
          <motion.button
            type="submit"
            className={`submit-btn ${!canSubmit ? 'disabled' : ''}`}
            disabled={formState.isSubmitting || !canSubmit}
            whileHover={!isMobile && canSubmit ? { scale: 1.02 } : undefined}
            whileTap={canSubmit ? { scale: 0.98 } : undefined}
          >
            {formState.isSubmitting ? (
              <>
                <div className="spinner" />
                Sending...
              </>
            ) : (
              <>
                <FiSend />
                Send Message
              </>
            )}
          </motion.button>

          {errors.submit && (
            <div className="error-message submit-error">
              <FiAlertCircle />
              {errors.submit}
            </div>
          )}

          {!canSubmit && formState.submitCount >= 3 && (
            <div className="rate-limit-message">
              <FiClock />
              Rate limited. Please wait before sending another message.
            </div>
          )}
        </div>
      </form>
    </motion.div>
  );
});

// Success Message Component
const SuccessMessage = React.memo(({ onReset, isMobile }) => {
  return (
    <motion.div
      className="success-message"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="success-icon"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <FiCheck />
      </motion.div>
      <h3>Message Sent Successfully!</h3>
      <p>
        Thank you for reaching out! I've received your message and will get back to you
        as soon as possible, typically within 24 hours.
      </p>
      <div className="success-actions">
        <motion.button
          className="reset-btn"
          onClick={onReset}
          whileHover={!isMobile ? { scale: 1.05 } : undefined}
          whileTap={{ scale: 0.95 }}
        >
          Send Another Message
        </motion.button>
        <motion.a
          href={`mailto:${contactConfig.YOUR_EMAIL}`}
          className="direct-email-btn"
          whileHover={!isMobile ? { scale: 1.05 } : undefined}
          whileTap={{ scale: 0.95 }}
        >
          <FiMail />
          Email Directly
        </motion.a>
      </div>
    </motion.div>
  );
});

// Main Contact Component
export const ContactUs = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const { isMobile, screenSize } = useMobile();

  const handleFormSuccess = useCallback(() => {
    setShowSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleReset = useCallback(() => {
    setShowSuccess(false);
  }, []);

  const pageVariants = useMemo(() => ({
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  }), []);

  return (
    <HelmetProvider>
      <Container className="contact-page">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} - Contact</title>
          <meta name="description" content={`Get in touch with ${meta.title}. ${contactConfig.description}`} />

          <meta property="og:title" content={`${meta.title} - Contact`} />
          <meta property="og:description" content={`Get in touch with ${meta.title} for AI/ML projects and collaborations.`} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://ganeshadimalupu.github.io/Ganesh-Adimalupu/contact" />

          <meta name="keywords" content="Ganesh Adimalupu, Contact, Machine Learning, AI Projects, Collaboration, Hire" />
        </Helmet>

        <motion.div
          className="contact-content"
          variants={pageVariants}
          initial="initial"
          animate="animate"
        >
          {/* Page Header */}
          <motion.div
            className="contact-header"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Get In Touch</h1>
            <p>
              Ready to bring your AI/ML ideas to life? Let's discuss how we can
              collaborate to create innovative solutions.
            </p>
            <div className="header-underline" />
          </motion.div>

          {/* Main Content */}
          <Row className="contact-main">
            <Col lg={showSuccess ? "12" : "5"} className="contact-info-col">
              <ContactInfoCard isMobile={isMobile} />
            </Col>

            {!showSuccess && (
              <Col lg="7" className="contact-form-col">
                <ContactForm
                  isMobile={isMobile}
                  onSuccess={handleFormSuccess}
                />
              </Col>
            )}

            {showSuccess && (
              <Col lg="7" className="success-col">
                <SuccessMessage
                  onReset={handleReset}
                  isMobile={isMobile}
                />
              </Col>
            )}
          </Row>
        </motion.div>
      </Container>
    </HelmetProvider>
  );
};
