import React from "react";
import './header.css';
import { AnimateTraceBorder } from "../../../src/animate-trace-border";

const Header = () => {

  return (
    <header className="nav-header">
      <nav>
        <AnimateTraceBorder animationDuration={500} reverseDuration={500} borderWidth={2} inset borderColour="black">
          <div className="nav-item">
            <a href="https://github.com/seegg/trace-border-animation"><img src="https://raw.githubusercontent.com/seegg/seegg.github.io/main/images/GitHub-Mark-Light-32px.png" alt="github logo" /></a>
          </div>
        </AnimateTraceBorder>
      </nav>
    </header>
  )

};

export default Header;  