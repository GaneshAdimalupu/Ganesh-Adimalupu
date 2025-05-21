import React, { useRef } from "react";
import { Route, Routes } from "react-router-dom";
import withRouter from "../hooks/withRouter";
import { Home } from "../pages/home";
import { Portfolio } from "../pages/portfolio";
import { ContactUs } from "../pages/contact";
import { About } from "../pages/about";
import { Socialicons } from "../components/socialicons";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const AnimatedRoutes = withRouter(({ location }) => {
  // Create refs for each route to avoid findDOMNode warnings
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const portfolioRef = useRef(null);
  const contactRef = useRef(null);
  const defaultRef = useRef(null);

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        timeout={{
          enter: 400,
          exit: 400,
        }}
        classNames="page"
        nodeRef={
          location.pathname === "/" ? homeRef :
          location.pathname === "/about" ? aboutRef :
          location.pathname === "/portfolio" ? portfolioRef :
          location.pathname === "/contact" ? contactRef :
          defaultRef
        }
        unmountOnExit
      >
        <div ref={
          location.pathname === "/" ? homeRef :
          location.pathname === "/about" ? aboutRef :
          location.pathname === "/portfolio" ? portfolioRef :
          location.pathname === "/contact" ? contactRef :
          defaultRef
        }>
          <Routes location={location}>
            <Route exact path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
});

function AppRoutes() {
  return (
    <div className="s_c">
      <AnimatedRoutes />
      <Socialicons />
    </div>
  );
}

export default AppRoutes;
