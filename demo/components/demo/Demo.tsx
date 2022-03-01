import React, { useState } from "react";
import { DemoArea } from "../demo-area";
import { PropOptions } from "../option";
import { ITraceBorderProps } from "../../type";
import './demo.css';
import { AnimateTraceBorder } from "../../../src/animate-trace-border";

const Demo = () => {

  const [animateBorderProps, setAnimateBorderProps] = useState<ITraceBorderProps | null>(null);

  /**
   * get the constructed options from PropOptions
   */
  const getOptions = (propsObj: ITraceBorderProps) => {
    setAnimateBorderProps(propsObj);
  }

  const handleClick = (evt: React.MouseEvent) => {
    const elem = evt.target as HTMLDivElement;
    elem.classList.toggle('demo-item-m');
  }

  return (
    <div className="Demo">
      <PropOptions optionCallBack={getOptions} />
      <div className="demo-area">
        <AnimateTraceBorder {...animateBorderProps}>
          Trace Borders
          <div className="demo-item" onClick={handleClick}>
            Click to resize
          </div>
        </AnimateTraceBorder>
      </div>
    </div>
  )

}

export default Demo;