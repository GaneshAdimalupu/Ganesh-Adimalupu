// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Hero from './components/hero/hero';
import About from './components/about/about';
import Contact from './components/contact/contact';
import Footer from './components/footer/footer';
import Projects from './components/projects/projects';
import Certifications from './components/certifications/certifications';
import FossExplorer from './components/foss_explorer/foss-explorer';
import './App.css';

function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="page-content">{children}</main>
      <Footer />
    </>
  );
}

function HomePage() {
  return <Hero />;
}

function AboutPage() {
  return (
    <section id="about" className="section-page">
      <About />
    </section>
  );
}

function ProjectsPage() {
  return (
    <section id="projects" className="section-page">
      <Projects />
    </section>
  );
}

function CertificationsPage() {
  return (
    <section id="certifications" className="section-page">
      <Certifications />
    </section>
  );
}

function ContactPage() {
  return (
    <section id="contact" className="section-page">
      <Contact />
    </section>
  );
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/projects" element={<Layout><ProjectsPage /></Layout>} />
        <Route path="/certifications" element={<Layout><CertificationsPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/foss-explorer" element={<Layout><FossExplorer /></Layout>} />
      </Routes>
    </div>
  );
}

export default App;
