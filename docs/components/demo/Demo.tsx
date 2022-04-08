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

      const bWidth = formatComponentString('borderWidth', borderWidth, borderWidth > 0);
      const bRadius = formatComponentString('borderRadius', borderRadius, borderRadius > 0);
      const duration = formatComponentString('animationDuration', animationDuration, animationDuration > 0);
      const revDuration = formatComponentString('reverseDuration', reverseDuration, reverseDuration > 0);
      const speedStr = formatComponentString('speed', speed, speed > 0);
      const revSpeed = formatComponentString('reverseSpeed', '', false);
      const sqWindow = formatComponentString('squareWindow', squareWindow, true);
      const insetStr = formatComponentString('inset', inset, true);
      const bColour = `borderColour='${borderColour}'`;
      const triggerStr = `trigger='${trigger}'`
      const bStyle = `borderStyle='${borderStyle}'`;
      const classNames = "classNames=''";

      setComponentString(
        `<AnimateTraceBorder ${bWidth} ${bStyle} ${bColour} ${bRadius} ${bColour} ${duration} ${revDuration}${speedStr} ${revSpeed} ${sqWindow} ${insetStr} ${triggerStr} ${classNames}></AnimateTraceBorder>`
      );
    }
  }, [animateBorderProps])

  const formatComponentString = (name: string, value: any, condition: boolean) => {
    return condition ? `${name}={${value}}` : '';
  }

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
          <div></div>{/* use here for alignment reasons. space-between */}
          <AnimateTraceBorder {...animateBorderProps}>
            <div className="demo-item">
              <h5 className="demo-trace-heading">Trace Borders</h5>
              resizable
            </div>
          </AnimateTraceBorder>
          <article>
            <p className="demo-text">Customisable border tracing animation. Each component is completely independent from one another so you can have multiple different animations on the same page without having to touch any additonal CSS or JS.</p>
            <p className="demo-text"><code>{componentString}</code></p>
          </article>
        </section>
      </main>
    </>
  )

}

export default Demo;