import React, { useState } from 'react';
import './contact.css';

// --- SVG Icons ---
const icons = {
  email: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
  phone: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
  location: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  linkedin: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>,
};

// --- Data ---
const contactInfo = [
    { icon: icons.email, title: 'Email', detail: 'ganeshadimalupu@disroot.org', link: 'mailto:ganeshadimalupu@disroot.org' },
    { icon: icons.phone, title: 'Phone', detail: '+91 63032 05936', link: 'tel:+916303205936' },
    { icon: icons.location, title: 'Location', detail: 'Thiruvananthapuram, Kerala, India', link: 'https://www.google.com/maps/search/?api=1&query=Thiruvananthapuram,Kerala,India' },
    { icon: icons.linkedin, title: 'LinkedIn', detail: 'linkedin.com/in/GaneshAdimalupu', link: 'https://www.linkedin.com/in/GaneshAdimalupu/' }
];

// --- Child Components ---
const StatusMessage = ({ status }) => {
    if (!status.message) return null;
    return <div className={`status-message ${status.type}`}>{status.message}</div>;
};

// --- Main Contact Component ---
const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            setStatus({ type: 'error', message: 'Please fill out all fields.' });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        // Simulate API call
        setTimeout(() => {
            console.log('Form submitted:', formData);
            setStatus({ type: 'success', message: 'Thank you! Your message has been sent.' });
            setFormData({ name: '', email: '', message: '' });
            setIsSubmitting(false);
        }, 2000);
    };

    return (
        <section id="contact" className="contact-section">
            <div className="contact-container">
                <div className="contact-header">
                    <h2>Get In Touch</h2>
                    <p>Have a project in mind or just want to say hello? Feel free to reach out.</p>
                </div>
                <div className="contact-grid">
                    <div className="contact-info">
                        <div className="contact-info-list">
                            {contactInfo.map((item) => (
                                <a key={item.title} href={item.link} target="_blank" rel="noopener noreferrer" className="contact-info-item">
                                    <div className="contact-icon">{item.icon}</div>
                                    <div>
                                        <h4>{item.title}</h4>
                                        <p>{item.detail}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="contact-form">
                        <h3>Send Me a Message</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className="form-input" required />
                            </div>
                            <div className="form-group">
                                <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} className="form-input" required />
                            </div>
                            <div className="form-group">
                                <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} className="form-input" required></textarea>
                            </div>
                            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                {isSubmitting ? <><div className="spinner"></div><span>Sending...</span></> : 'Send Message'}
                            </button>
                            <StatusMessage status={status} />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
