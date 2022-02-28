import React from "react";
import './demo-area.css'
import { AnimateTraceBorder } from "../../../src/animate-trace-border";
import { ITraceBorderProps } from "../../type";

interface IDemoAreaProps {
  animateBorderProp?: ITraceBorderProps,
}

const DemoArea = ({ animateBorderProp }: IDemoAreaProps) => {


  return (
    <div className="demo-area">
      <AnimateTraceBorder>
        <div className="demo-item">
          bob
        </div>
      </AnimateTraceBorder>
    </div>
  )
}

export default DemoArea;