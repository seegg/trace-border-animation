import React from "react";
import './demo-area.css'
import { AnimateTraceBorder } from "../../../src/animate-trace-border";
import { ITraceBorderProps } from "../../type";

interface IDemoAreaProps {
  animateBorderProps?: ITraceBorderProps,
}

const DemoArea = ({ animateBorderProps }: IDemoAreaProps) => {

  const handleClick = (evt: React.MouseEvent) => {
    const elem = evt.target as HTMLDivElement;
    elem.classList.toggle('demo-item-m');
  }

  return (
    <div className="demo-area">
      <AnimateTraceBorder {...animateBorderProps}>
        Trace Borders
        <div className="demo-item" onClick={handleClick}>
          Click to resize
        </div>
      </AnimateTraceBorder>
    </div>
  )
}

export default DemoArea;