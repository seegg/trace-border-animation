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
              image=
              {{
                src: "https://raw.githubusercontent.com/seegg/seegg.github.io/main/images/GitHub-Mark-Light-32px.png",
                alt: 'github logo'
              }}
              animateColour="black"
            />
          </li>
          <li>
            <HeaderNavItem link="#" />
          </li>
        </ol>
      </nav>

    </header >
  )

};

export default Header;  