import React, { useEffect, useState } from "react";
import { PropOptions } from "../option";
import { ITraceBorderProps } from "../../../src/animate-trace-border/AnimationTraceBorder";
import './demo.css';
import { AnimateTraceBorder } from "../../../src/animate-trace-border";

const Demo = () => {

  const [animateBorderProps, setAnimateBorderProps] = useState<ITraceBorderProps | null>(null);
  const [componentString, setComponentString] = useState('');

  useEffect(() => {
    //string display for the AnimateTraceBorder component being used.
    if (animateBorderProps !== null) {
      const { borderWidth, borderColour, borderRadius, borderStyle, animationDuration, reverseDuration, speed, squareWindow, inset, trigger }: ITraceBorderProps = animateBorderProps;

      setComponentString(
        `<AnimateTraceBorder borderWidth={${borderWidth}} borderColour={"${borderColour}"} borderRadius={${borderRadius}} borderStyle={"${borderStyle}"} animationDuration={${animationDuration}} reverseDuration={${reverseDuration}} speed={${speed}} reverSpeed={} squareWindow={${squareWindow}} inset={${inset}} trigger={"${trigger}"} classNames=''></AnimateTraceBorder>`
      );
    }
  }, [animateBorderProps])
  /**
   * get the constructed options from PropOptions
   */
  const getOptions = (propsObj: ITraceBorderProps) => {
    setAnimateBorderProps(propsObj);
  }

  return (
    <>
      <main className="Demo">
        <PropOptions optionCallBack={getOptions} />
        <section className="demo-area">
          <span></span>{/* use here for alignment reasons. space-between */}
          <AnimateTraceBorder {...animateBorderProps}>
            Trace Borders
            <div className="demo-item">
            </div>
          </AnimateTraceBorder>
          <article>
            <p className="demo-text"><code>{componentString}</code></p>
          </article>
        </section>
      </main>
    </>
  )

}

export default Demo;