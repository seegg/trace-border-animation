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
    elem.classList.toggle('demo-item-m');
  }

  return (
    <div className="demo-area">
      <AnimateTraceBorder trigger="focus" animationDuration={1000}>
        Trace Borders
        <div className="demo-item" onClick={handleClick}>
        </div>
      </AnimateTraceBorder>
    </div>
  )
}

export default DemoArea;