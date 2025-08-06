import React, { useState } from 'react';
import './contact.css';

// SVG Icons
const icons = {
  email: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
  phone: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ),
  location: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  linkedin: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  ),
};

// Contact information data
const contactInfo = [
  {
    icon: icons.email,
    title: 'Email',
    detail: 'ganeshadimalupu@disroot.org',
    link: 'mailto:ganeshadimalupu@disroot.org',
  },
  {
    icon: icons.phone,
    title: 'Phone',
    detail: '+91 63032 05936',
    link: 'tel:+916303205936',
  },
  {
    icon: icons.location,
    title: 'Location',
    detail: 'Thiruvananthapuram, Kerala, India',
    link: 'https://www.google.com/maps/search/?api=1&query=Thiruvananthapuram,Kerala,India',
  },
  {
    icon: icons.linkedin,
    title: 'LinkedIn',
    detail: 'linkedin.com/in/GaneshAdimalupu',
    link: 'https://www.linkedin.com/in/GaneshAdimalupu/',
  },
];

// Status Message Component
const StatusMessage = ({ status }) => {
  if (!status.message) return null;
  return (
    <div className={`status-message ${status.type}`}>{status.message}</div>
  );
};

// Main Contact Component
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
    company: '',
    messageType: 'general',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API base URL
  const API_BASE_URL =
    process.env.NODE_ENV === 'production'
      ? '' // Use relative URLs in production
      : 'http://localhost:5000'; // Use localhost in development

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (status.type === 'error') {
      setStatus({ type: '', message: '' });
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!formData.email.trim()) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.push('Please enter a valid email address');
      }
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({ type: '', message: '' });

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setStatus({
        type: 'error',
        message: validationErrors.join('. '),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim() || 'Contact Form Submission',
          message: formData.message.trim(),
          phone: formData.phone.trim() || null,
          company: formData.company.trim() || null,
          messageType: formData.messageType,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || result.error || `Server error: ${response.status}`
        );
      }

      let successMessage = '✅ Thank you for your message!\n\n';
      successMessage +=
        "I've received your inquiry and will get back to you soon.\n";

      if (result.services?.autoReply?.status === 'success') {
        successMessage += '📧 Check your email for a confirmation message.\n';
      }

      successMessage += `\nReference ID: ${result.contact?.id}`;

      setStatus({
        type: 'success',
        message: successMessage,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: '',
        company: '',
        messageType: 'general',
      });
    } catch (error) {
      let errorMessage = 'Failed to send message. ';

      if (error.message.includes('Rate limit')) {
        errorMessage +=
          'Please wait a few minutes before sending another message.';
      } else if (error.message.includes('fetch')) {
        errorMessage += 'Please check your internet connection and try again.';
      } else if (error.message.includes('Invalid email')) {
        errorMessage += 'Please check your email address format.';
      } else {
        errorMessage += error.message || 'Please try again later.';
      }

      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <h2>Get In Touch</h2>
          <p>
            Have a project in mind or just want to say hello? I'd love to hear
            from you and discuss how we can work together.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <h3>Contact Information</h3>
            <div className="contact-info-list">
              {contactInfo.map((item) => (
                <a
                  key={item.title}
                  href={item.link}
                  target={item.link.startsWith('http') ? '_blank' : '_self'}
                  rel={
                    item.link.startsWith('http') ? 'noopener noreferrer' : ''
                  }
                  className="contact-info-item"
                >
                  <div className="contact-icon">{item.icon}</div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.detail}</p>
                  </div>
                </a>
              ))}
            </div>

            <div
              className="additional-info"
              style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                border: '1px solid rgba(247, 37, 133, 0.2)',
              }}
            >
              <h4 style={{ color: 'var(--glow-cyan)', marginBottom: '1rem' }}>
                📧 What to Expect
              </h4>
              <ul
                style={{
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  paddingLeft: '1rem',
                }}
              >
                <li>Auto-reply confirmation within seconds</li>
                <li>Personal response within 24-48 hours</li>
                <li>Priority handling for project inquiries</li>
                <li>Direct contact for urgent matters</li>
              </ul>
            </div>
          </div>

          <div className="contact-form">
            <h3>Send Me a Message</h3>
            <form onSubmit={handleSubmit}>
              <div
                className="form-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email *"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div
                className="form-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                <div className="form-group">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="company"
                    placeholder="Company (Optional)"
                    value={formData.company}
                    onChange={handleChange}
                    className="form-input"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <select
                  name="messageType"
                  value={formData.messageType}
                  onChange={handleChange}
                  className="form-input"
                  disabled={isSubmitting}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="general">💬 General Inquiry</option>
                  <option value="project">🚀 Project Discussion</option>
                  <option value="collaboration">
                    🤝 Collaboration Opportunity
                  </option>
                  <option value="support">🛠️ Support Request</option>
                  <option value="other">📋 Other</option>
                </select>
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message *"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-input"
                  required
                  disabled={isSubmitting}
                  rows={5}
                  style={{ minHeight: '120px', resize: 'vertical' }}
                ></textarea>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <span>📧 Send Message</span>
                  </>
                )}
              </button>

              <StatusMessage status={status} />

              {/* Form submission summary */}
              {(formData.name || formData.email || formData.message) &&
                !isSubmitting && (
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      background: 'rgba(76, 201, 240, 0.05)',
                      border: '1px solid rgba(76, 201, 240, 0.2)',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <span>📝 Form Status:</span>
                      <span style={{ color: 'var(--glow-cyan)' }}>
                        {formData.name && formData.email && formData.message
                          ? '✅ Ready to send'
                          : '⚠️ Fill required fields'}
                      </span>
                    </div>
                    {formData.message && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>Message length:</span>
                        <span
                          style={{
                            color:
                              formData.message.length >= 10
                                ? 'var(--glow-cyan)'
                                : 'var(--glow-magenta)',
                          }}
                        >
                          {formData.message.length} characters{' '}
                          {formData.message.length < 10 ? '(minimum 10)' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                )}
            </form>

            {/* Privacy notice */}
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                textAlign: 'center',
              }}
            >
              🔒 Your information is secure and will only be used to respond to
              your inquiry. I respect your privacy and will never share your
              details with third parties.
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div
          style={{
            marginTop: '3rem',
            padding: '1rem 2rem',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '10px',
            border: '1px solid rgba(247, 37, 133, 0.2)',
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--glow-cyan)' }}>
              🚀
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Backend: Enhanced
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--glow-magenta)' }}>
              📧
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Auto-Reply: Enabled
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--glow-purple)' }}>
              🛡️
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Spam Protection: Active
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--glow-cyan)' }}>
              💾
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Database: MongoDB
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
