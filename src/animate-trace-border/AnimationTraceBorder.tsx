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

type TraceFn = (width: number, height: number, speed: number) => boolean;

const AnimationTraceBorder = ({ borderWidth = 2, borderRadius = 5, borderColour = 'black', animationDuration = 1000, children, borderStyle = 'solid', squareWindow = false, inset = false, speed, trigger = 'hover' }: ITraceBorderProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const borderTopRef = useRef<HTMLDivElement | null>(null);
  const borderLeftRef = useRef<HTMLDivElement | null>(null);
  const borderRightRef = useRef<HTMLDivElement | null>(null);
  const borderBotRef = useRef<HTMLDivElement | null>(null);
  const traceRef = useRef<boolean>(false);
  const heightRef = useRef<number | null>(null);
  const widthRef = useRef<number | null>(null);

  const traceFnRef = useRef<TraceFn | null>(null);
  const retraceFnRef = useRef<TraceFn | null>(null);
  // const [traceSpeed, setTraceSpeed] = useState(0);
  const traceSpeed = useRef(0);
  const completeTrace = useRef(false);

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
  }, [trigger])


  //weird animation artifacts withouth this on Chrome. does nothing on firefox.
  //value is added to initial order size.
  const borderRadiusBuffer = borderRadius - 1 <= borderWidth ? 0 : Math.max(borderWidth - 1, 1);

  useEffect(() => {
    //recalculate the borderdimensions on element resize.
    resizeObserver.observe(containerRef.current!);
    setContainerDimesion();
    //set refrences for trace and retrace functions
    if (traceFnRef.current === null || retraceFnRef.current === null) {
      const traceFuncs = build(borderTopRef.current!, borderRightRef.current!, borderBotRef.current!, borderLeftRef.current!, borderRadius, borderWidth, borderRadiusBuffer);
      traceFnRef.current = traceFuncs[0];
      retraceFnRef.current = traceFuncs[1];
    }

    console.log(containerRef.current.tabIndex);
    //if trigger is focus, make container focusable if it's not already.
    if (triggers.focus) containerRef.current.tabIndex = -1;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * set the value to increase the border by each millisecond.
   */
  const setSpeed = () => {
    try {
      if (speed && speed > 0) {
        traceSpeed.current = (speed / 1000);
      } else {
        const total = (heightRef.current! * 2) + (widthRef.current! * 2) - ((borderRadius + borderRadiusBuffer) * 4);
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
    resetBorderStyle(borderTopRef.current, borderTop);
    resetBorderStyle(borderBotRef.current, borderBot);
    resetBorderStyle(borderLeftRef.current, borderLeft);
    resetBorderStyle(borderRightRef.current, borderRight);
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

  const resizeObserver = new ResizeObserver(() => {
    setContainerDimesion();
    reset();
    if (completeTrace.current) {
      traceBorder();
    }
  });

  //the container to hold the 4 borders
  const container: React.CSSProperties = {
    position: 'relative',
    boxSizing: 'border-box',
    outline: 'none',
    borderRadius,
    //borders on the outside instead of inside
    ...(!inset && { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: borderWidth })
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
    borderStyle,
    width: '0',
    height: '0',
    pointerEvents: 'none',
  };

  //top and bottom shared styling
  const borderTopBot: React.CSSProperties = {
    ...border,
    ...(squareWindow && { borderLeft: 'none', borderRight: 'none' }),
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    width: (squareWindow ? 0 : borderRadius + borderRadiusBuffer) + 'px',
  }

  //left and right shared styling
  const borderLeftRight: React.CSSProperties = {
    ...border,
    ...(squareWindow && { borderTop: 'none', borderBottom: 'none' }),
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    height: (squareWindow ? 0 : borderRadius + borderRadiusBuffer) + 'px',
  }

  //styling for individual borders, borderwith set to 0 initially to stop it showing
  const borderTop: React.CSSProperties = {
    ...borderTopBot,
    ...(!squareWindow && { borderBottom: 'none', height: `${borderRadius}px` }),
    // borderTop: `0px ${borderStyle} ${borderColourArr[0]}`,
    borderTopWidth: '0px',
    borderTopStyle: `${borderStyle}` as any,
    borderTopColor: `${borderColourArr[0]}`,
    borderTopLeftRadius: `${borderRadius}px`,
    left: '0',
    top: '0',
    margin: '0px'
  };

  const borderLeft: React.CSSProperties = {
    ...borderLeftRight,
    ...(!squareWindow && { borderRight: 'none', width: `${borderRadius}px` }),
    borderLeft: `0px ${borderStyle} ${borderColourArr[1]}`,
    borderBottomLeftRadius: `${borderRadius}px`,
    left: '0',
    bottom: '0',
  };

  const borderBot: React.CSSProperties = {
    ...borderTopBot,
    ...(!squareWindow && { borderTop: 'none', height: `${borderRadius}px` }),
    // borderBottom: `0px ${borderStyle} ${borderColourArr[2]}`,
    borderBottomWidth: '0px',
    borderBottomStyle: `${borderStyle}` as any,
    borderBottomColor: `${borderColourArr[2]}`,
    borderBottomRightRadius: `${borderRadius} px`,
    right: '0',
    bottom: '0',
  };

  const borderRight: React.CSSProperties = {
    ...borderLeftRight,
    ...(!squareWindow && { borderLeft: 'none', width: `${borderRadius} px` }),
    borderRight: `0px ${borderStyle} ${borderColourArr[3]} `,
    borderTopRightRadius: `${borderRadius} px`,
    right: '0',
    top: '0',
    margin: '0'
  };

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
    console.log('focused');
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
      // console.log('got here', isComplete);
      if (traceRef.current && !isComplete) {
        requestAnimationFrame(() => { traceBorder(currentTime) });
      }
      completeTrace.current = isComplete as boolean;
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
      if (!traceRef.current && !retraceFnRef.current(widthRef.current!, heightRef.current!, speed)) {
        requestAnimationFrame(() => { retraceBorder(currentTime) });
      }
      //refresh the border styles at the end of retracing.
      if (Number((borderTopRef.current! as HTMLElement).style.width.slice(0, -2)) <= borderRadius + borderRadiusBuffer) {
        reset();
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (

    <div
      ref={containerRef}
      style={container}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >

      {/* Child elements */}
      {inset ? children : (<div>{children}</div>)}
      {/* Elements use to draw the borders on the four sides */}

      <div id='anim-trace-bT' style={borderTop} ref={borderTopRef}></div>
      <div id='anim-trace-bR' style={borderRight} ref={borderRightRef}></div>
      <div id='anim-trace-bB' style={borderBot} ref={borderBotRef}></div>
      <div id='anim-trace-bL' style={borderLeft} ref={borderLeftRef}></div>

    </div>
  )

}

export default AnimationTraceBorder;