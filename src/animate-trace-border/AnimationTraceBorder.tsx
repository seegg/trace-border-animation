import React, { useEffect, useMemo, useRef, useState } from 'react';
import { build } from './traceBorderHelper';
import * as CSS from 'csstype';


interface ITraceBorderProps {
  children?: React.ReactNode,
  borderWidth?: number,
  borderRadius?: number,
  borderColour?: string,
  animationDuration?: number,
  speed?: number,
  borderStyle?: string,
  squareWindow?: boolean,
  inset?: boolean,
  trigger?: string

}

interface Trigger {
  hover?: boolean,
  focus?: boolean
}

type TraceFn = (width: number, height: number, speed: number, resetCB?: () => void) => boolean;

const AnimationTraceBorder = ({ borderWidth = 2, borderRadius = 5, borderColour = 'black', animationDuration = 1000, children, borderStyle = 'solid', squareWindow = false, inset = false, speed, trigger = 'hover' }: ITraceBorderProps) => {
  //Avoid useState in this component when possible to avoid undesirable effects.
  //use useRef to keep values consistant across rerenders.

  //HTML elements representing the 4 sides of the border and the container.
  const containerRef = useRef<HTMLDivElement | null>(null);
  const borderTopRef = useRef<HTMLDivElement | null>(null);
  const borderLeftRef = useRef<HTMLDivElement | null>(null);
  const borderRightRef = useRef<HTMLDivElement | null>(null);
  const borderBotRef = useRef<HTMLDivElement | null>(null);

  //keeping track of the current tracing state, whether it's trace or retrace.
  const traceRef = useRef<boolean>(false);
  //height and width of the container use for drawing the borders.
  const heightRef = useRef<number | null>(null);
  const widthRef = useRef<number | null>(null);
  //tracing speed in px/ms
  const traceSpeed = useRef(0);
  //true when the border is fully drawn.
  const completeTrace = useRef(false);

  //references for the styles of the four borders and the container to keep it consistant.
  const containerStyleRef = useRef<React.CSSProperties | null>(null);
  const topStyleRef = useRef<React.CSSProperties | null>(null);
  const rightStyleRef = useRef<React.CSSProperties | null>(null);
  const botStyleRef = useRef<React.CSSProperties | null>(null);
  const leftStyleRef = useRef<React.CSSProperties | null>(null);

  //the trace and retrace functions.
  const traceFnRef = useRef<TraceFn | null>(null);
  const retraceFnRef = useRef<TraceFn | null>(null);

  //keeps track of the triggers than has been triggered. 
  //retrace will only be call if this is empty.
  const currentTriggers = useRef<Set<keyof Trigger>>(new Set());

  const availableTriggers = ['hover', 'focus'];

  //extract border colours
  const borderColourArr = useMemo(() => {
    let colourArr = borderColour.split(' ');
    if (colourArr.length < 4) {
      while (colourArr.length < 4) {
        colourArr.push(colourArr[colourArr.length - 1]);
      }
    } else if (colourArr.length > 4) {
      colourArr = colourArr.slice(0, 4);
    }
    return colourArr;
  }, [borderColour]);

  //events that'll trigger the animation
  const triggers: Trigger = useMemo(() => {
    const triggers = {};

    const propTriggers = trigger.split(' ');
    availableTriggers.forEach(trigger => {
      triggers[trigger] = false;
      propTriggers.forEach(k => {
        if (trigger === k) triggers[trigger] = true;
      })
    })
    return triggers;
  }, [trigger]);

  //weird animation artifacts withouth this on Chrome. does nothing on firefox.
  //value is added to initial order size.
  const borderRadiusBuffer = useRef(0);

  useEffect(() => {
    //recalculate the borderdimensions on element resize.
    window.addEventListener('resize', () => { setContainerDimesion(); reset(); });
    resizeObserver.observe(containerRef.current);

    //if the triggers include focus, add tab index to container.
    if (triggers.focus) containerRef.current.tabIndex = -1;
  }, []);

  //update the references if any of the style props changes.
  useEffect(() => {
    setContainerDimesion();
    const traceFuncs = build(borderTopRef.current!, borderRightRef.current!, borderBotRef.current!, borderLeftRef.current!, borderRadius, borderWidth, borderRadiusBuffer.current);
    traceFnRef.current = traceFuncs[0];
    retraceFnRef.current = traceFuncs[1];
    borderRadiusBuffer.current = borderRadius - 1 <= borderWidth ? 0 : Math.max(borderWidth - 1, 1);
    initialiseBorderStyles();
  }, [animationDuration, borderWidth, borderRadius, borderColour, speed, borderStyle, squareWindow, inset, trigger])

  /**
   * set the value to increase the border by each millisecond.
   */
  const setSpeed = () => {
    try {
      if (speed && speed > 0) {
        traceSpeed.current = (speed / 1000);
      } else {
        const total = (heightRef.current! * 2) + (widthRef.current! * 2) - ((borderRadius + borderRadiusBuffer.current) * 4);
        traceSpeed.current = (total / animationDuration);
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Set the bounding rect height and width, these are the
   * final sizes of the borders.
   */
  const setContainerDimesion = () => {
    let boundingRect = containerRef.current!.getBoundingClientRect();

    widthRef.current = Number(boundingRect.width.toFixed(3));
    heightRef.current = Number(boundingRect.height.toFixed(3));

    setSpeed();
  };

  //reset the borders stybles back to default.
  const reset = () => {
    resetBorderStyle(borderTopRef.current, topStyleRef.current);
    resetBorderStyle(borderBotRef.current, botStyleRef.current);
    resetBorderStyle(borderLeftRef.current, leftStyleRef.current);
    resetBorderStyle(borderRightRef.current, rightStyleRef.current);
  }
  /**
   * 
   * @param border one of the four html elements use to draw the border.
   * @param styleProperties style object corresponding to that element.
   */
  const resetBorderStyle = (border: HTMLElement | null, styleProperties: React.CSSProperties) => {
    if (border instanceof HTMLElement) {
      try {

        for (const prop in styleProperties) {
          //@ts-ignore
          border.style[prop] = styleProperties[prop];
        }

      } catch (err) {
        console.error(err);
      };
    }
  };

  //recalculate borderdimensions if element resizes.
  const resizeObserver = new ResizeObserver(() => {
    setContainerDimesion();
    reset();
    if (completeTrace.current) {
      traceBorder();
    }
  });

  //initialise the styles for the various elements and 
  const initialiseBorderStyles = () => {

    //the container to hold the 4 borders
    const container: React.CSSProperties = {
      position: 'relative',
      boxSizing: 'border-box',
      outline: 'none',
      borderRadius,
      //borders on the outside instead of inside
      ...(!inset && { padding: borderWidth })
    };

    //base border styling
    const border: React.CSSProperties = {
      boxSizing: 'border-box',
      position: 'absolute',
      // borderWidth
      borderTopWidth: borderWidth,
      borderBottomWidth: borderWidth,
      borderRightWidth: borderWidth,
      borderLeftWidth: borderWidth,
      borderTopStyle: borderStyle as CSS.Property.BorderTopStyle,
      borderLeftStyle: borderStyle as CSS.Property.BorderTopStyle,
      borderRightStyle: borderStyle as CSS.Property.BorderTopStyle,
      borderBottomStyle: borderStyle as CSS.Property.BorderTopStyle,

      // borderStyle,
      width: '0',
      height: '0',
      pointerEvents: 'none',
    };

    //top and bottom shared styling
    const borderTopBot: React.CSSProperties = {
      ...border,
      ...(squareWindow && { borderLeftStyle: 'none', borderRightStyle: 'none' }),
      borderRightColor: 'transparent',
      borderLeftColor: 'transparent',
      width: (squareWindow ? 0 : borderRadius + borderRadiusBuffer.current) + 'px',
    }

    //left and right shared styling
    const borderLeftRight: React.CSSProperties = {
      ...border,
      ...(squareWindow && { borderTopStyle: 'none', borderBottomStyle: 'none' }),
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      height: (squareWindow ? 0 : borderRadius + borderRadiusBuffer.current) + 'px',
    }

    //styling for individual borders, borderwith set to 0 initially to stop it showing
    const borderTop: React.CSSProperties = {
      ...borderTopBot,
      ...(!squareWindow && { borderBottomStyle: 'none', height: `${borderRadius}px` }),
      borderTopWidth: '0px',
      borderTopStyle: `${borderStyle}` as CSS.Property.BorderTopStyle,
      borderTopColor: `${borderColourArr[0]}`,
      borderTopLeftRadius: `${borderRadius}px`,
      left: '0',
      top: '0',
      margin: '0px'
    };

    const borderLeft: React.CSSProperties = {
      ...borderLeftRight,
      ...(!squareWindow && { borderRightStyle: 'none', width: `${borderRadius}px` }),
      borderLeftWidth: '0px',
      borderLeftStyle: `${borderStyle}` as CSS.Property.BorderTopStyle,
      borderLeftColor: `${borderColourArr[1]}`,
      borderBottomLeftRadius: `${borderRadius}px`,
      left: '0',
      bottom: '0',
    };

    const borderBot: React.CSSProperties = {
      ...borderTopBot,
      ...(!squareWindow && { borderTopStyle: 'none', height: `${borderRadius}px` }),
      borderBottomWidth: '0px',
      borderBottomStyle: `${borderStyle}` as CSS.Property.BorderTopStyle,
      borderBottomColor: `${borderColourArr[2]}`,
      borderBottomRightRadius: `${borderRadius}px`,
      right: '0',
      bottom: '0',
    };

    const borderRight: React.CSSProperties = {
      ...borderLeftRight,
      ...(!squareWindow && { borderLeftStyle: 'none', width: `${borderRadius}px` }),
      borderRightWidth: '0px',
      borderRightStyle: `${borderStyle}` as CSS.Property.BorderTopStyle,
      borderRightColor: `${borderColourArr[3]}`,
      borderTopRightRadius: `${borderRadius}px`,
      right: '0',
      top: '0',
      margin: '0'
    };

    containerStyleRef.current = container;
    topStyleRef.current = borderTop;
    rightStyleRef.current = borderRight;
    botStyleRef.current = borderBot;
    leftStyleRef.current = borderLeft;
    reset();
  };

  initialiseBorderStyles();

  const handlePointerEnter = (evt: React.PointerEvent) => {
    evt.preventDefault();
    if (!triggers.hover) return;
    currentTriggers.current.add('hover');
    traceRef.current = true;
    traceBorder();
  };

  const handlePointerLeave = (evt: React.PointerEvent) => {
    evt.preventDefault();
    if (!triggers.hover) return;
    currentTriggers.current.delete('hover');
    traceRef.current = false;
    retraceBorder();
  };

  const handlePointerCancel = (evt: React.PointerEvent) => {
    evt.preventDefault();
    if (!triggers.hover) return;
    currentTriggers.current.delete('hover');
    traceRef.current = false;
    retraceBorder();
  };

  const handleBlur = (evt: React.FocusEvent) => {
    evt.preventDefault();
    currentTriggers.current.delete('focus');
    traceRef.current = false;
    retraceBorder();
  }

  const handleFocus = (evt: React.FocusEvent) => {
    evt.preventDefault();
    if (!triggers.focus) return;
    currentTriggers.current.add('focus');
    traceRef.current = true;
    traceBorder();
  }

  /**
   * Trace the border
   */
  const traceBorder = (previousTime: number = new Date().getTime()) => {
    try {

      //get ellapse time and multiply by traceSpeed to get border size delta.
      const currentTime = new Date().getTime();
      const speed = traceSpeed.current * (currentTime - previousTime);
      if (traceFnRef.current === null) return;
      const isComplete = traceFnRef.current(widthRef.current!, heightRef.current!, speed);

      if (traceRef.current && !isComplete) {
        requestAnimationFrame(() => { traceBorder(currentTime) });
      }
      completeTrace.current = isComplete;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Backtrace from tracing the border
   */
  const retraceBorder = (previousTime: number = new Date().getTime()) => {
    try {
      if (currentTriggers.current.size > 0) return;
      //get ellapse time and multiply by traceSpeed to get border size delta.
      const currentTime = new Date().getTime();
      const speed = traceSpeed.current * (currentTime - previousTime);
      if (!traceRef.current && !retraceFnRef.current(widthRef.current!, heightRef.current!, speed, reset)) {
        requestAnimationFrame(() => { retraceBorder(currentTime) });
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (

    <div
      ref={containerRef}
      style={containerStyleRef.current}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >

      {/* Child elements */}
      {children}
      {/* Elements use to draw the borders on the four sides */}

      <div id='anim-trace-bT' style={topStyleRef.current} ref={borderTopRef}></div>
      <div id='anim-trace-bR' style={rightStyleRef.current} ref={borderRightRef}></div>
      <div id='anim-trace-bB' style={botStyleRef.current} ref={borderBotRef}></div>
      <div id='anim-trace-bL' style={leftStyleRef.current} ref={borderLeftRef}></div>

    </div>
  )

}

export default AnimationTraceBorder;