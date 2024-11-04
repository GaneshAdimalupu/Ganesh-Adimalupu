import React, { useEffect, useState } from 'react';
import './style.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Typewriter from 'typewriter-effect';
import { introdata, meta } from '../../content_option';
import { Link } from 'react-router-dom';
import profileImage from '../../assets/images/profile.svg';
import backgroundImage from '../../assets/images/background.svg';

export const Home = () => {
  const [hoverEffect, setHoverEffect] = useState('');

  // Define possible hover effects
  const effects = [
    'scale-color',
    'text-glow',
    'letter-spacing',
    'rotate-gradient',
  ];
  // Function to randomly select an effect on hover
  const randomizeEffect = () => {
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    setHoverEffect(randomEffect);
  };
  // Reset effect on mouse leave
  const resetEffect = () => {
    setHoverEffect('');
  };

  const getRandomPosition = () => (Math.random() * 2 - 1).toFixed(2);

  // Split text into spans with random positioning
  const text = 'WELCOME TO MY PORTFOLIO';
  const letters = text.split('').map((letter, index) => (
    <span
      key={index}
      className="letter"
      style={{
        '--index': index,
        '--random-x': getRandomPosition(),
        '--random-y': getRandomPosition(),
      }}
    >
      {letter}
    </span>
  ));

  // Split words for the phrase and apply word spacing
  const words = 'WELCOME TO MY PORTFOLIO'.split(' ').map((word, wordIndex) =>
    word.split('').map((letter, letterIndex) => (
      <span
        key={`${wordIndex}-${letterIndex}`}
        className="letter"
        style={{
          '--index': letterIndex + wordIndex * 3, // Update delay based on both word and letter position
          '--random-x': getRandomPosition(),
          '--random-y': getRandomPosition(),
        }}
      >
        {letter}
      </span>
    )),
  );

  return (
    <HelmetProvider>
      <section id="home" className="home">
        <Helmet>
          <meta charSet="utf-8" />
          <title> {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <h1
            className={`display-4 text-center mb-4 animate-welcome ${hoverEffect}`}
            onMouseEnter={randomizeEffect}
            onMouseLeave={resetEffect}
          >
            {letters}{' '}
          </h1>
        </div>

        <div className="intro_sec d-block d-lg-flex align-items-center ">
          <div
            className="h_bg-image order-1 order-lg-2 h-100 "
            style={{
              backgroundImage: ` url(${profileImage}),url(${backgroundImage})`,
              backgroundSize: 'auto,contain,100%',
              backgroundPosition: 'center,center',
              backgroundRepeat: 'no-repeat,no-repeat',
              width: '600px',
              height: '600px',
            }}
          ></div>
          <div className="text order-2 order-lg-1 h-100 d-lg-flex justify-content-center">
            <div className="align-self-center ">
              <div className="intro mx-auto">
                <h2 className="mb-1x">{introdata.title}</h2>
                <h1 className="fluidz-48 mb-1x">
                  <Typewriter
                    options={{
                      strings: [
                        introdata.animated.first,
                        introdata.animated.second,
                        introdata.animated.third,
                      ],
                      autoStart: true,
                      loop: true,
                      deleteSpeed: 10,
                    }}
                  />
                </h1>
                <p className="mb-1x">{introdata.description}</p>
                <div className="intro_btn-action pb-5">
                  <Link to="/portfolio" className="text_2">
                    <div id="button_p" className="ac_btn btn ">
                      My Portfolio
                      <div className="ring one"></div>
                      <div className="ring two"></div>
                      <div className="ring three"></div>
                    </div>
                  </Link>
                  <Link to="/contact">
                    <div id="button_h" className="ac_btn btn">
                      Contact Me
                      <div className="ring one"></div>
                      <div className="ring two"></div>
                      <div className="ring three"></div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
};
