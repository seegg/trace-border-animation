import React, { useEffect, useState } from "react";
import { PropOptions } from "../option";
import { ITraceBorderProps } from "../../../src/animate-trace-border/AnimationTraceBorder";
import './demo.css';
import { AnimateTraceBorder } from "../../../src/animate-trace-border";
import { Header } from "../header";

const Demo = () => {

  const [animateBorderProps, setAnimateBorderProps] = useState<ITraceBorderProps | null>(null);
  const [componentString, setComponentString] = useState('');

  useEffect(() => {
    //string value for the AnimateTraceBorder component being used.
    if (animateBorderProps !== null) {
      const { borderWidth, borderColour, borderRadius, borderStyle, animationDuration, reverseDuration, speed, squareWindow, inset, trigger }: ITraceBorderProps = animateBorderProps;
      setComponentString(
        `<AnimateTraceBorder borderWidth={${borderWidth}} borderColour={"${borderColour}"} borderRadius={${borderRadius}} borderStyle={"${borderStyle}"} animationDuration={${animationDuration}} reverseDuration={${reverseDuration}} speed={${speed}} squareWindow={${squareWindow}} inset={${inset}} trigger={"${trigger}"} classNames=''></AnimateTraceBorder>`
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
    <div >
      <Header />
      <div className="Demo">
        <PropOptions optionCallBack={getOptions} />
        <div className="demo-area">
          <AnimateTraceBorder {...animateBorderProps}>
            Trace Borders
            <div className="demo-item" onClick={handleClick}>
              Click to resize
            </div>
          </AnimateTraceBorder>
          <article>
            <p className="demo-text">{componentString}</p>
          </article>
        </div>
      </div>
    </div >
  )

}

export default Demo;