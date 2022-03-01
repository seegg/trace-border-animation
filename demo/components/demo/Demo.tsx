import React, { useEffect, useState } from "react";
import { PropOptions } from "../option";
import { ITraceBorderProps } from "../../type";
import './demo.css';
import { AnimateTraceBorder } from "../../../src/animate-trace-border";

const Demo = () => {

  const [animateBorderProps, setAnimateBorderProps] = useState<ITraceBorderProps | null>(null);
  const [componentString, setComponentString] = useState('');

  useEffect(() => {
    if (animateBorderProps !== null) {
      const { borderWidth, borderColour, borderRadius, borderStyle, animationDuration, speed, squareWindow, inset, trigger }: ITraceBorderProps = animateBorderProps;
      setComponentString(
        `<AnimateTraceBorder borderWidth={${borderWidth}} borderColour={"${borderColour}"} borderRadius={${borderRadius}} borderStyle={"${borderStyle}"} animationDuration={${animationDuration}} speed={${speed}} squareWindow={${squareWindow}} inset={${inset}} trigger={"${trigger}"}></AnimationTraceBorder>`
      );
    }
  }, [animateBorderProps])
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
        <p className="demo-text">{componentString}</p>
      </div>
    </div>
  )

}

export default Demo;