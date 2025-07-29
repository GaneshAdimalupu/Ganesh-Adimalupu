// components/certifications/certifications.js
import React, { useState } from 'react';
import './certifications.css';

const Certifications = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCert, setSelectedCert] = useState(null);

  // Your certifications data organized by category
  const certifications = [
    {
      id: 1,
      title: 'Google Machine Learning Crash Course',
      provider: 'Google',
      category: 'ml',
      date: '2025',
      description: 'Comprehensive course covering machine learning fundamentals, TensorFlow, and practical ML applications.',
      skills: ['Machine Learning', 'TensorFlow', 'Python', 'Data Science'],
      certificateNumber: 'Recent Completion',
      featured: true,
      logo: '🎯'
    },
    {
      id: 2,
      title: 'DevOps & MLOps Participation',
      provider: 'Professional Workshop',
      category: 'devops',
      date: '2024',
      description: 'Advanced workshop on DevOps practices and MLOps for machine learning deployment.',
      skills: ['DevOps', 'MLOps', 'CI/CD', 'Docker', 'Kubernetes'],
      certificateNumber: 'DevOps & MLOps participaton.jpg',
      featured: true,
      logo: '⚙️'
    },
    {
      id: 3,
      title: 'Android Development Webinar',
      provider: 'Tech Workshop',
      category: 'mobile',
      date: '2024',
      description: 'Comprehensive webinar on Android app development and mobile technologies.',
      skills: ['Android', 'Mobile Development', 'Java', 'Kotlin'],
      certificateNumber: 'Adimalupu Ganesh_Android_Webinar.pdf',
      featured: true,
      logo: '📱'
    },
    {
      id: 4,
      title: 'Professional Internship Program',
      provider: 'Edureka',
      category: 'professional',
      date: '2024',
      description: 'Hands-on internship program focusing on real-world project development and industry practices.',
      skills: ['Project Management', 'Industry Practices', 'Professional Development'],
      certificateNumber: 'Edureka - Internship Certificate.pdf',
      featured: true,
      logo: '💼'
    },
    {
      id: 5,
      title: 'Introduction to Neural Networks',
      provider: 'Academic Institution',
      category: 'ml',
      date: '2024',
      description: 'Deep dive into neural network architectures, deep learning concepts, and practical implementations.',
      skills: ['Neural Networks', 'Deep Learning', 'AI', 'Python'],
      certificateNumber: 'Introduction to Neural networks.pdf',
      featured: true,
      logo: '🧠'
    },
    {
      id: 6,
      title: 'Udemy Course Collection',
      provider: 'Udemy',
      category: 'online',
      date: '2023-2024',
      description: 'Extensive collection of 25+ completed courses covering web development, programming, and technology.',
      skills: ['Web Development', 'Programming', 'Full Stack', 'Various Technologies'],
      certificateNumber: 'UC-xxxxx (25+ certificates)',
      featured: true,
      logo: '📚',
      count: 25
    },
    {
      id: 7,
      title: 'Technology Workshop Series',
      provider: 'DevTown & Others',
      category: 'workshop',
      date: '2023-2024',
      description: 'Participation in multiple technology workshops and bootcamps focusing on emerging technologies.',
      skills: ['Workshop Participation', 'Technology Trends', 'Networking'],
      certificateNumber: 'Devtown.pdf & Others',
      featured: false,
      logo: '🎓'
    },
    {
      id: 8,
      title: 'Competitive Programming',
      provider: 'Various Platforms',
      category: 'programming',
      date: '2023-2024',
      description: 'Achievements in competitive programming challenges and treasure hunt competitions.',
      skills: ['Problem Solving', 'Algorithms', 'Competitive Programming'],
      certificateNumber: 'treasure hunt & Competition certificates',
      featured: false,
      logo: '🏆'
    }
  ];

  const categories = [
    { key: 'all', label: 'All Certifications', icon: '🎯', count: certifications.length },
    { key: 'ml', label: 'Machine Learning', icon: '🤖', count: certifications.filter(cert => cert.category === 'ml').length },
    { key: 'devops', label: 'DevOps & Cloud', icon: '☁️', count: certifications.filter(cert => cert.category === 'devops').length },
    { key: 'mobile', label: 'Mobile Development', icon: '📱', count: certifications.filter(cert => cert.category === 'mobile').length },
    { key: 'online', label: 'Online Courses', icon: '📚', count: certifications.filter(cert => cert.category === 'online').length },
    { key: 'professional', label: 'Professional', icon: '💼', count: certifications.filter(cert => cert.category === 'professional').length },
    { key: 'workshop', label: 'Workshops', icon: '🎓', count: certifications.filter(cert => cert.category === 'workshop').length },
    { key: 'programming', label: 'Programming', icon: '💻', count: certifications.filter(cert => cert.category === 'programming').length }
  ];

  const filteredCertifications = activeCategory === 'all'
    ? certifications
    : certifications.filter(cert => cert.category === activeCategory);

  const openModal = (cert) => {
    setSelectedCert(cert);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedCert(null);
    document.body.style.overflow = 'unset';
  };

  // Calculate total certificates including Udemy collection
  const totalCertificates = certifications.reduce((total, cert) => {
    return total + (cert.count || 1);
  }, 0);

  return (
    <section id="certifications" className="section">
      <div className="container">
        <div className="section-header">
          <h2>Professional Certifications</h2>
          <div className="cert-stats">
            <div className="stat-item">
              <span className="stat-number">{totalCertificates}+</span>
              <span className="stat-label">Certificates Earned</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{categories.length - 1}</span>
              <span className="stat-label">Skill Categories</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">2023-2025</span>
              <span className="stat-label">Learning Journey</span>
            </div>
          </div>
          <p className="section-text">
            Continuous learning and professional development through various certification programs,
            workshops, and specialized courses. Always staying current with industry trends and emerging technologies.
          </p>
        </div>

        {/* Category Filter */}
        <div className="cert-filter-container">
          {categories.map(category => (
            <button
              key={category.key}
              className={`cert-filter-btn ${activeCategory === category.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.key)}
            >
              <span className="filter-icon">{category.icon}</span>
              <span className="filter-text">
                {category.label}
                <span className="filter-count">({category.count})</span>
              </span>
            </button>
          ))}
        </div>

        {/* Recent Achievement Highlight */}
        <div className="recent-achievement">
          <div className="achievement-content">
            <span className="achievement-badge">🎉 Latest Achievement</span>
            <h3>Google Machine Learning Crash Course</h3>
            <p>Just completed Google's comprehensive ML course - expanding expertise in machine learning and TensorFlow!</p>
          </div>
        </div>

        {/* Certifications Grid */}
        <div className="certifications-grid">
          {filteredCertifications.map(cert => (
            <div
              key={cert.id}
              className={`cert-card ${cert.featured ? 'featured' : ''}`}
              onClick={() => openModal(cert)}
            >
              <div className="cert-header">
                <div className="cert-logo">{cert.logo}</div>
                {cert.featured && <span className="featured-badge">⭐ Featured</span>}
                {cert.count && <span className="count-badge">{cert.count}+ Courses</span>}
              </div>

              <div className="cert-content">
                <h3>{cert.title}</h3>
                <p className="cert-provider">{cert.provider}</p>
                <p className="cert-description">{cert.description.substring(0, 120)}...</p>

                <div className="cert-skills">
                  {cert.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                  {cert.skills.length > 3 && (
                    <span className="skill-tag more">+{cert.skills.length - 3}</span>
                  )}
                </div>

                <div className="cert-footer">
                  <span className="cert-date">📅 {cert.date}</span>
                  <button className="view-cert-btn">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skills Summary */}
        <div className="skills-summary">
          <h3>Skills Acquired Through Certifications</h3>
          <div className="skills-cloud">
            {[
              'Machine Learning', 'DevOps', 'Android Development', 'Neural Networks',
              'TensorFlow', 'Python', 'MLOps', 'CI/CD', 'Docker', 'Kubernetes',
              'Web Development', 'Full Stack', 'Problem Solving', 'Data Science',
              'Deep Learning', 'Mobile Apps', 'Project Management', 'Algorithms'
            ].map((skill, index) => (
              <span key={index} className="skill-bubble">{skill}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Certification Modal */}
      {selectedCert && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="cert-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>×</button>

            <div className="modal-header">
              <div className="modal-logo">{selectedCert.logo}</div>
              <div className="modal-title-section">
                <h2>{selectedCert.title}</h2>
                <p className="modal-provider">{selectedCert.provider}</p>
                <span className="modal-date">Completed: {selectedCert.date}</span>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-description">
                <h4>About This Certification:</h4>
                <p>{selectedCert.description}</p>
              </div>

              <div className="modal-skills">
                <h4>Skills & Technologies:</h4>
                <div className="modal-skill-tags">
                  {selectedCert.skills.map((skill, index) => (
                    <span key={index} className="modal-skill-tag">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="modal-certificate-info">
                <h4>Certificate Information:</h4>
                <div className="cert-info-item">
                  <span className="info-label">Certificate ID:</span>
                  <span className="info-value">{selectedCert.certificateNumber}</span>
                </div>
                <div className="cert-info-item">
                  <span className="info-label">Category:</span>
                  <span className="info-value">{categories.find(cat => cat.key === selectedCert.category)?.label}</span>
                </div>
                {selectedCert.count && (
                  <div className="cert-info-item">
                    <span className="info-label">Courses Included:</span>
                    <span className="info-value">{selectedCert.count}+ individual certificates</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Certifications;
