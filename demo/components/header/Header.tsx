import React from "react";
import './header.css';
import { AnimateTraceBorder } from "../../../src/animate-trace-border";

const Header = () => {

  return (
    <header className="nav-header">
      <nav>
        <ol>
          <li>
            <AnimateTraceBorder animationDuration={500} reverseDuration={1000} borderWidth={2} borderColour="black" classNames="nav-item-bg" inset>
              <a href="https://github.com/seegg/trace-border-animation" className="nav-item">
                <img src="https://raw.githubusercontent.com/seegg/seegg.github.io/main/images/GitHub-Mark-Light-32px.png" alt="github logo" />
              </a>
            </AnimateTraceBorder>
          </li>
          <li>
            <AnimateTraceBorder animationDuration={500} reverseDuration={1000} borderWidth={2} borderColour="black" classNames="nav-item-bg" inset>
              <a href="#" className="nav-item"></a>
            </AnimateTraceBorder>
          </li>
        </ol>
      </nav>
    </header >
  )

};

export default Header;  