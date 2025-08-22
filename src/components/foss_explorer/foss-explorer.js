// src/components/foss-explorer/FossExplorer.js
import React, { useState, useEffect, useMemo } from 'react';
import './foss-explorer.css';

const FossExplorer = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSoftware, setSelectedSoftware] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false); // NEW: Compact view for mobile

  const softwareData = [
    {
      category: 'Email Services',
      name: 'Proton Mail',
      description:
        "A secure email service from Switzerland with end-to-end encryption and a strong focus on privacy. It's an excellent choice for those who want their emails to be private and secure by default.",
      url: 'https://proton.me/mail',
      logo: 'https://proton.me/favicons/apple-touch-icon.png',
      tags: ['Privacy', 'Encryption', 'Security'],
    },
    {
      category: 'Email Services',
      name: 'Tutanota',
      description:
        "Another secure email service that features end-to-end encryption. It's known for its clean interface and strong commitment to open-source principles.",
      url: 'https://tutanota.com/',
      logo: 'https://tutanota.com/images/favicon/favicon-96x96.png',
      tags: ['Privacy', 'Encryption', 'Open Source'],
    },
    {
      category: 'Document and Office Suites',
      name: 'LibreOffice',
      description:
        'A comprehensive, free, and open-source office suite that is a fantastic replacement for Microsoft Office. It includes a word processor (Writer), spreadsheet (Calc), presentation software (Impress), and more.',
      url: 'https://www.libreoffice.org/',
      logo: 'https://www.libreoffice.org/assets/Uploads/LibreOffice-Initial-Artwork-Logo-ColorLogoBasic-500px.png',
      tags: ['Office', 'Documents', 'Productivity'],
    },
    {
      category: 'Document and Office Suites',
      name: 'Nextcloud',
      description:
        "A self-hosted collaboration platform that offers file hosting, calendar, contacts, and collaborative document editing. It's a powerful and versatile alternative to services like Google Drive or Dropbox.",
      url: 'https://nextcloud.com/',
      logo: 'https://nextcloud.com/media/nextcloud-square-logo.png',
      tags: ['Cloud', 'Collaboration', 'Self-hosted'],
    },
    {
      category: 'Creative Tools',
      name: 'GIMP',
      description:
        'A powerful raster graphics editor and a popular alternative to Adobe Photoshop.',
      url: 'https://www.gimp.org/',
      logo: 'https://www.gimp.org/images/frontpage/wilber-big.png',
      tags: ['Graphics', 'Photo Editing', 'Design'],
    },
    {
      category: 'Creative Tools',
      name: 'Blender',
      description:
        'A complete 3D creation suite that is a powerful alternative to programs like Autodesk Maya or Adobe After Effects for 3D modeling, animation, and rendering.',
      url: 'https://www.blender.org/',
      logo: 'https://www.blender.org/favicon.ico',
      tags: ['3D', 'Animation', 'Modeling'],
    },
    {
      category: 'Creative Tools',
      name: 'Kdenlive',
      description:
        'A free and user-friendly video editor that offers great functionality for editing video clips and creating professional-looking projects.',
      url: 'https://kdenlive.org/',
      logo: 'https://kdenlive.org/wp-content/uploads/2016/09/kdenlive-logo.png',
      tags: ['Video Editing', 'Media', 'Content Creation'],
    },
    {
      category: 'Web Browsers & Utilities',
      name: 'Mozilla Firefox',
      description:
        'A great open-source web browser that prioritizes user privacy and security.',
      url: 'https://www.mozilla.org/firefox/',
      logo: 'https://www.mozilla.org/media/img/favicons/firefox/browser/favicon-196x196.png',
      tags: ['Browser', 'Privacy', 'Security'],
    },
    {
      category: 'Web Browsers & Utilities',
      name: 'Bitwarden',
      description:
        'An open-source password manager that allows you to securely store and manage your passwords across all your devices.',
      url: 'https://bitwarden.com/',
      logo: 'https://bitwarden.com/images/icons/favicon-96x96.png',
      tags: ['Password Manager', 'Security', 'Cross-platform'],
    },
    {
      category: 'Operating Systems',
      name: 'Ubuntu Linux',
      description:
        'A user-friendly Linux distribution known for its stability, security, and flexibility. Perfect for both beginners and advanced users.',
      url: 'https://ubuntu.com/',
      logo: 'https://ubuntu.com/favicon.ico',
      tags: ['OS', 'Linux', 'Open Source'],
    },
    {
      category: 'Development Tools',
      name: 'VSCodium',
      description:
        "A community-driven, fully open-source distribution of Microsoft's VS Code, without the proprietary telemetry.",
      url: 'https://vscodium.com/',
      logo: 'https://vscodium.com/img/codium_cnl.svg',
      tags: ['Code Editor', 'Development', 'Programming'],
    },
    {
      category: 'Development Tools',
      name: 'Git',
      description:
        'The most popular version control system, essential for any development workflow.',
      url: 'https://git-scm.com/',
      logo: 'https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png',
      tags: ['Version Control', 'Development', 'Collaboration'],
    },
  ];

  const categories = useMemo(() => {
    return ['all', ...new Set(softwareData.map((item) => item.category))];
  }, []);

  const filteredSoftware = useMemo(() => {
    let filtered =
      selectedCategory === 'all'
        ? softwareData
        : softwareData.filter((item) => item.category === selectedCategory);

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    return filtered;
  }, [selectedCategory, searchTerm]);

  const categoryStats = useMemo(() => {
    const stats = {};
    categories.forEach((category) => {
      if (category === 'all') {
        stats[category] = softwareData.length;
      } else {
        stats[category] = softwareData.filter(
          (item) => item.category === category
        ).length;
      }
    });
    return stats;
  }, [categories]);

  const openModal = (software) => {
    setSelectedSoftware(software);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSoftware(null);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeModal();
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isModalOpen]);

  return (
    <section id="foss-explorer" className="foss-section">
      <div className="foss-container">
        {/* Header */}
        <div className="foss-header">
          <h2>FOSS Explorer</h2>
          <p>
            Discover free and open-source alternatives to popular software.
            Embrace privacy, security, and freedom in your digital life.
          </p>
        </div>

        {/* Controls */}
        <div className="foss-controls">
          <div className="search-container">
            <div className="search-box">
              <svg
                className="search-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search software, tags, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="clear-search"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Mobile View Toggle */}
          <div className="mobile-controls">
            <button
              onClick={() => setIsCompactView(!isCompactView)}
              className="view-toggle"
              aria-label={
                isCompactView ? 'Show detailed view' : 'Show compact view'
              }
            >
              {isCompactView ? '📋 Detailed View' : '📱 Compact View'}
            </button>
          </div>

          {/* Category Filter - Only show if not compact or if desktop */}
          {(!isCompactView || window.innerWidth > 768) && (
            <div className="category-filter">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`category-btn ${
                    selectedCategory === category ? 'active' : ''
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                  <span className="category-count">
                    ({categoryStats[category]})
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="results-info">
          <p>
            Showing {filteredSoftware.length} software
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Software Grid */}
        <div className={`software-grid ${isCompactView ? 'compact-view' : ''}`}>
          {filteredSoftware.length > 0 ? (
            filteredSoftware.map((software, index) => (
              <div
                key={`${software.name}-${index}`}
                className={`software-card ${
                  isCompactView ? 'compact-card' : ''
                }`}
                onClick={() => openModal(software)}
              >
                <div className="card-header">
                  <div className="software-header-content">
                    <div className="software-logo">
                      <img
                        src={software.logo}
                        alt={`${software.name} logo`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div
                        className="logo-fallback"
                        style={{ display: 'none' }}
                      >
                        {software.name.charAt(0)}
                      </div>
                    </div>
                    <div className="software-info">
                      <h3 className="software-name">{software.name}</h3>
                      <span className="software-category">
                        {software.category}
                      </span>
                    </div>
                  </div>
                </div>
                {!isCompactView && (
                  <>
                    <p className="software-description">
                      {software.description.length > 100
                        ? `${software.description.substring(0, 100)}...`
                        : software.description}
                    </p>
                    <div className="software-tags">
                      {software.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
                <div className="card-footer">
                  <span className="explore-more">Explore →</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <h3>No software found</h3>
              <p>
                Try adjusting your search terms or selecting a different
                category.
              </p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="foss-stats">
          <div className="stat-item">
            <span className="stat-number">{softwareData.length}</span>
            <span className="stat-label">FOSS Alternatives</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{categories.length - 1}</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Free & Open Source</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedSoftware && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ×
            </button>

            <div className="modal-header">
              <div className="modal-header-content">
                <div className="modal-software-logo">
                  <img
                    src={selectedSoftware.logo}
                    alt={`${selectedSoftware.name} logo`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div
                    className="modal-logo-fallback"
                    style={{ display: 'none' }}
                  >
                    {selectedSoftware.name.charAt(0)}
                  </div>
                </div>
                <div className="modal-title-section">
                  <h3 className="modal-title">{selectedSoftware.name}</h3>
                  <span className="modal-category">
                    {selectedSoftware.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-body">
              <p className="modal-description">
                {selectedSoftware.description}
              </p>

              <div className="modal-tags">
                <strong>Tags:</strong>
                <div className="tags-list">
                  {selectedSoftware.tags.map((tag) => (
                    <span key={tag} className="modal-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <a
                href={selectedSoftware.url}
                target="_blank"
                rel="noopener noreferrer"
                className="visit-btn"
              >
                Visit Website →
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FossExplorer;
