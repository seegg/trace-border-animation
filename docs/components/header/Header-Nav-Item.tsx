import React, { useEffect, useRef, useState } from "react";
import { AnimateTraceBorder } from "../../../src/animate-trace-border";
import './header.css';

interface INavItemProps {
  link: string,
  animateDuration?: number,
  animateRevDuration?: number,
  animateWidth?: number,
  animateColour?: string,
  image?: { src: string, alt?: string | null } | null,
  icon?: string | null
}

const HeaderNavItem =
  ({ link, animateDuration = 500, animateRevDuration = 100,
    animateWidth = 2, animateColour = 'black', image = null, icon = null }: INavItemProps) => {

    const [imageIcon, setImageIcon] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
      const imageElem = new Image();

      const handler = () => {
        setImageIcon(imageElem);
      }

      if (image?.src && !imageIcon) {
        imageElem.src = image.src;
        imageElem.alt = image.alt || 'navigation Icon';
        imageElem.addEventListener('load', handler);
        //clean up
        return () => {
          imageElem.removeEventListener('load', handler);
        }
      }

    }, []);

    return (
      <AnimateTraceBorder
        animationDuration={animateDuration}
        reverseDuration={animateRevDuration}
        borderWidth={animateWidth}
        inset
        trigger="hover focus"
        borderColour={animateColour}
        classNames="nav-item-bg">
        <a href={link} className="nav-item">
          {imageIcon && <img src={imageIcon.src} alt={imageIcon.alt} className={imageIcon.classList.toString()}></img>}
          {(!imageIcon && icon) && <span className="material-icons" style={{ color: "white", fontSize: "36px" }}>{icon}</span>}
        </a>
      </AnimateTraceBorder>
    );

  };

export default HeaderNavItem;