import React, { useState } from "react";
import { DemoArea } from "../demo-area";
import { PropOptions } from "../option";
import { ITraceBorderProps } from "../../type";
import './demo.css';

const Demo = () => {

  const [animateBorderProps, setAnimateBorderProps] = useState<ITraceBorderProps>({
    borderWidth: 5,
    borderRadius: 5,
    borderColour: '#2a5766',
    animationDuration: 1000,
    speed: 0,
    borderStyle: 'solid',
    squareWindow: false,
    inset: true,
    trigger: 'hover'
  });

  /**
   * get the constructed options from PropOptions
   */
  const getOptions = (propsObj: ITraceBorderProps) => {
    setAnimateBorderProps(propsObj);
  }

  return (
    <div className="Demo">
      <PropOptions optionCallBack={getOptions} />
      <DemoArea animateBorderProps={animateBorderProps} />
    </div>
  )

}

export default Demo;