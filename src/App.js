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

function PortfolioPage() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Projects />
      <Certifications />
      <Contact />
      <Footer />
    </>
  );
}

function FossExplorerPage() {
  return (
    <>
      <Header />
      <FossExplorer />
      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/foss-explorer" element={<FossExplorerPage />} />
      </Routes>
    </div>
  );
}

export default App;
