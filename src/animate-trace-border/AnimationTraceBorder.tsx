import React, { useEffect, useMemo, useRef } from 'react';
import buildTraceFunctions from './traceBorder';
import { initialiseBorderStyles } from './initialise-styles';
import { assignStyling as resetBorderStyle } from './util';


export interface ITraceBorderProps {
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
    let colourArr = borderColour.trim().split(/\s+/);
    if (colourArr.length < 4) {
      const index = colourArr.length - 1;
      while (colourArr.length < 4) {
        colourArr.push(colourArr[index]);
      }
    } else if (colourArr.length > 4) {
      colourArr = colourArr.slice(0, 4);
    }
    return colourArr;
  }, [borderColour.trim()]);

  //events that'll trigger the animation
  const triggers: Trigger = useMemo(() => {
    const triggers = {};

    const propTriggers = trigger.trim().split(/\s+/);
    availableTriggers.forEach(trigger => {
      triggers[trigger] = false;
      propTriggers.forEach(k => {
        if (trigger === k) triggers[trigger] = true;
      })
    })
    return triggers;
  }, [trigger.trim()]);

  //weird animation artifacts withouth this on Chrome. does nothing on firefox.
  //value is added to initial order size.
  const borderRadiusBuffer = useRef(borderWidth);

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
    const { trace, retrace } = buildTraceFunctions(borderTopRef.current!, borderRightRef.current!, borderBotRef.current!, borderLeftRef.current!, borderRadius, borderWidth, borderRadiusBuffer.current);
    traceFnRef.current = trace;
    retraceFnRef.current = retrace;
    borderRadiusBuffer.current = borderRadius - 1 <= borderWidth ? 0 : borderWidth;
    if (triggers.focus) containerRef.current.tabIndex = -1;
    initialiseStyles();
  }, [animationDuration, borderWidth, borderRadius, borderColour, speed, borderStyle, squareWindow, inset, trigger]);

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
   * wrapper for initialise border styles.
   */
  const initialiseStyles = () => {
    const { container, borderTop, borderBot, borderLeft, borderRight } = initialiseBorderStyles({ borderRadius, borderStyle, borderWidth, inset, squareWindow }, borderRadiusBuffer, borderColourArr);
    containerStyleRef.current = container;
    topStyleRef.current = borderTop;
    rightStyleRef.current = borderRight;
    botStyleRef.current = borderBot;
    leftStyleRef.current = borderLeft;
    reset();
  };


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

  //recalculate borderdimensions if element resizes.
  const resizeObserver = new ResizeObserver(() => {
    setContainerDimesion();
    reset();
    if (completeTrace.current) {
      traceBorder();
    }
  });

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

  initialiseStyles();

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
    currentTriggers.current.delete('focus');
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

      {borderTopRef.current || <div id='anim-trace-bT' style={topStyleRef.current} ref={borderTopRef}></div>}
      <div id='anim-trace-bR' style={rightStyleRef.current} ref={borderRightRef}></div>
      <div id='anim-trace-bB' style={botStyleRef.current} ref={borderBotRef}></div>
      <div id='anim-trace-bL' style={leftStyleRef.current} ref={borderLeftRef}></div>

    </div>
  )

}

export default AnimationTraceBorder;