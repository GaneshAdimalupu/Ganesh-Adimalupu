// components/contact/contact.js
import React, { useState } from 'react';
import './contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! I will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      detail: 'ganeshadimalupu@disroot.org',
      link: 'mailto:ganeshadimalupu@disroot.org'
    },
    {
      icon: '📱',
      title: 'Phone',
      detail: '+91 63032 05936',
      link: 'tel:+916303205936'
    },
    {
      icon: '📍',
      title: 'Location',
      detail: 'Thiruvananthapuram, Kerala, India',
      link: 'https://www.openstreetmap.org/directions?from=&to=8.514562%2C76.948313#map=18/8.515989/76.948250'
    },
    {
      icon: '💼',
      title: 'LinkedIn',
      detail: 'linkedin.com/in/GaneshAdimalupu',
      link: 'https://www.linkedin.com/in/GaneshAdimalupu/'
    }
  ];

  return (
    <section id="contact" className="section">
      <div className="container">
        <h2>Get In Touch</h2>
        <p className="section-text">
          Ready to start your next project? I'd love to hear from you.
          Let's discuss how we can work together to bring your ideas to life.
        </p>

        <div className="contact-content">
          <div className="contact-info">
            <h3>Contact Information</h3>
            <div className="contact-items">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className="contact-item"
                  target={item.link.startsWith('http') ? '_blank' : '_self'}
                  rel={item.link.startsWith('http') ? 'noopener noreferrer' : ''}
                >
                  <div className="contact-icon">{item.icon}</div>
                  <div className="contact-details">
                    <h4>{item.title}</h4>
                    <p>{item.detail}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="contact-form">
            <h3>Send Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
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
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="cta-button">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
