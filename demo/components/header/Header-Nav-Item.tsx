import React from "react";
import { AnimateTraceBorder } from "../../../src/animate-trace-border";
import './header.css';

interface INavItemProps {
  link: string,
  animateDuration?: number,
  animateRevDuration?: number,
  animateWidth?: number,
  animateColour?: string,
  image?: { src: string, alt?: string | null } | null
}

const HeaderNavItem =
  ({ link, animateDuration = 500, animateRevDuration = 1000, animateWidth = 2, animateColour = 'black', image = null }: INavItemProps) => {


    return (
      <AnimateTraceBorder
        animationDuration={animateDuration}
        reverseDuration={animateRevDuration}
        borderWidth={animateWidth}
        inset
        borderColour={animateColour}
        classNames="nav-item-bg">
        <a href={link} className="nav-item">
          {image && <img src="https://raw.githubusercontent.com/seegg/seegg.github.io/main/images/GitHub-Mark-Light-32px.png"
            className="nav-item-img" alt={image.alt || 'navigation icon'} />}
        </a>
      </AnimateTraceBorder>
    )

  };

export default HeaderNavItem;