import React from "react";
import './demo-area.css'
import { AnimateTraceBorder } from "../../../src/animate-trace-border";
import { ITraceBorderProps } from "../../type";

interface IDemoAreaProps {
  animateBorderProp?: ITraceBorderProps,
}

const DemoArea = ({ animateBorderProp }: IDemoAreaProps) => {

  const handleClick = (evt: React.MouseEvent) => {
    const elem = evt.target as HTMLDivElement;
    elem.style.height = '300px';
    elem.style.width = '300px';
  }

  return (
    <div className="demo-area">
      <AnimateTraceBorder trigger="focus" animationDuration={3000}>
        <div className="demo-item" onClick={handleClick}>
        </div>
      </AnimateTraceBorder>
    </div>
  )
}

export default DemoArea;