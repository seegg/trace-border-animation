import React from "react";
import './header.css';
import { AnimateTraceBorder } from "../../../src/animate-trace-border";
import { HeaderNavItem } from ".";

const Header = () => {

  return (
    <header className="nav-header">
      <nav>
        <ol>
          <li>
            <HeaderNavItem
              link='https://github.com/seegg/trace-border-animation'
              image={
                {
                  src: "./images/github-32px.png",
                  alt: 'github logo'
                }
              }
            />
          </li>
          <li>
            <HeaderNavItem link="https://seegg.github.io" icon="home" />
          </li>
        </ol>
      </nav>

    </header >
  )

};

export default Header;  