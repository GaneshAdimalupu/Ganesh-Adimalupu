import { createContext, useContext, useState, useEffect } from 'react';

const MobileContext = createContext();

export const MobileProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 767);

      if (width <= 480) setScreenSize('mobile-small');
      else if (width <= 767) setScreenSize('mobile');
      else if (width <= 991) setScreenSize('tablet');
      else setScreenSize('desktop');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <MobileContext.Provider value={{ isMobile, screenSize }}>
      {children}
    </MobileContext.Provider>
  );
};

export const useMobileContext = () => useContext(MobileContext);
