// App.js
import React from 'react';
import Header from './components/header/header';
import Hero from './components/hero/hero';
import About from './components/about/about';
// import Schedule from './components/schedule/schedule'; // not needed for now
import Contact from './components/contact/contact';
import Footer from './components/footer/footer';
import Projects from './components/projects/projects';
import Certifications from './components/certifications/certifications';
import FossExplorer from './components/foss_explorer/foss-explorer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <About />
      <Projects />
      <Certifications />
      <FossExplorer />
      {/* <Schedule /> - not needed for now */}
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
