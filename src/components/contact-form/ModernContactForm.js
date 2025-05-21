// FILE: src/components/contact-form/ModernContactForm.js

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiSend, FiCheck } from "react-icons/fi";
import "./style.css";

const ModernContactForm = ({ onSubmit, emailjsConfig }) => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formStatus, setFormStatus] = useState({
    show: false,
    type: "",
    message: "",
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        await onSubmit(formData);
        setIsSubmitted(true);
        setFormStatus({
          show: true,
          type: "success",
          message: "Message sent successfully! I'll get back to you soon.",
        });
        formRef.current.reset();
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } catch (error) {
        console.error("Error sending message:", error);
        setFormStatus({
          show: true,
          type: "error",
          message: "Failed to send message. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormStatus({
      show: false,
      type: "",
      message: "",
    });
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const inputVariants = {
    focus: { scale: 1.02, boxShadow: "0 0 0 3px rgba(var(--text-color-3-rgb), 0.2)" },
    blur: { scale: 1, boxShadow: "none" },
  };

  return (
    <div className="modern-contact-form">
      {!isSubmitted ? (
        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="form-title">Send Me a Message</h3>

          {formStatus.show && (
            <div className={`form-alert ${formStatus.type}`}>
              {formStatus.message}
            </div>
          )}

          <div className="form-floating">
            <motion.input
              type="text"
              id="name"
              name="name"
              placeholder=" "
              value={formData.name}
              onChange={handleChange}
              className={formErrors.name ? "error" : ""}
              variants={inputVariants}
              whileFocus="focus"
              whileBlur="blur"
            />
            <label htmlFor="name">Name</label>
            {formErrors.name && <div className="error-message">{formErrors.name}</div>}
          </div>

          <div className="form-floating">
            <motion.input
              type="email"
              id="email"
              name="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              className={formErrors.email ? "error" : ""}
              variants={inputVariants}
              whileFocus="focus"
              whileBlur="blur"
            />
            <label htmlFor="email">Email</label>
            {formErrors.email && <div className="error-message">{formErrors.email}</div>}
          </div>

          <div className="form-floating">
            <motion.input
              type="text"
              id="subject"
              name="subject"
              placeholder=" "
              value={formData.subject}
              onChange={handleChange}
              className={formErrors.subject ? "error" : ""}
              variants={inputVariants}
              whileFocus="focus"
              whileBlur="blur"
            />
            <label htmlFor="subject">Subject</label>
            {formErrors.subject && <div className="error-message">{formErrors.subject}</div>}
          </div>

          <div className="form-floating textarea-floating">
            <motion.textarea
              id="message"
              name="message"
              rows="5"
              placeholder=" "
              value={formData.message}
              onChange={handleChange}
              className={formErrors.message ? "error" : ""}
              variants={inputVariants}
              whileFocus="focus"
              whileBlur="blur"
            ></motion.textarea>
            <label htmlFor="message">Message</label>
            {formErrors.message && <div className="error-message">{formErrors.message}</div>}
          </div>

          <motion.button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isSubmitting ? (
              <span className="button-text">Sending...</span>
            ) : (
              <>
                <span className="button-text">Send Message</span>
                <FiSend className="button-icon" />
              </>
            )}
          </motion.button>
        </motion.form>
      ) : (
        <motion.div
          className="success-message"
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
            className="reset-button"
            onClick={resetForm}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Send Another Message
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ModernContactForm;
