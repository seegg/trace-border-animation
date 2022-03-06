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
  reverseDuration?: number,
  speed?: number,
  reverseSpeed?: number,
  borderStyle?: string,
  squareWindow?: boolean,
  inset?: boolean,
  trigger?: string,
  traceOnRerender?: boolean,
  classNames?: string,
  traceAllSidesSameTime?: boolean
}

interface Trigger {
  hover?: boolean,
  focus?: boolean
}

type TraceFn = (width: number, height: number, speed: number, resetCB?: () => void) => boolean;

const AnimationTraceBorder = ({ borderWidth = 2, borderRadius = 5, borderColour = 'black',
  animationDuration = 500, reverseDuration, children, borderStyle = 'solid',
  squareWindow = false, inset = false, speed, reverseSpeed, trigger = 'hover',
  classNames = '', traceOnRerender = false, traceAllSidesSameTime = false }: ITraceBorderProps) => {

  //HTML elements representing the 4 sides of the border and the container.
  const container = useRef<HTMLDivElement | null>(null);
  const borderTop = useRef<HTMLDivElement | null>(null);
  const borderLeft = useRef<HTMLDivElement | null>(null);
  const borderRight = useRef<HTMLDivElement | null>(null);
  const borderBot = useRef<HTMLDivElement | null>(null);

  //keeping track of the current tracing state, whether it's trace or retrace.
  const isTracing = useRef<boolean>(false);
  //height and width of the container use for drawing the borders.
  const containerHeight = useRef<number | null>(null);
  const containerWidth = useRef<number | null>(null);
  //tracing speed in px/ms
  const traceSpeed = useRef(0);
  const retraceSpeed = useRef(0);
  //speed and duration references
  const speedRef = useRef(0);
  const revSpeedRef = useRef(0);
  const animateDurationRef = useRef(0);
  const revanimateDurationRef = useRef(0);

  //reference to keep track of current animation frame for canceling during rerenders.
  const currentAnimationFrame = useRef(0);

  //references for the styles of the four borders and the container to keep it consistant.
  const styleContainer = useRef<React.CSSProperties | null>(null);
  const styleTop = useRef<React.CSSProperties | null>(null);
  const styleRight = useRef<React.CSSProperties | null>(null);
  const styleBot = useRef<React.CSSProperties | null>(null);
  const styleLeft = useRef<React.CSSProperties | null>(null);

  //the trace and retrace functions.
  const traceFn = useRef<TraceFn | null>(null);
  const retraceFn = useRef<TraceFn | null>(null);

  //keeps track of the triggers than has been triggered. 
  //retrace will only be call if this is empty.
  const currentTriggers = useRef<Set<keyof Trigger>>(new Set());

  const availableTriggers = ['hover', 'focus'];

  //weird animation artifacts withouth this on Chrome. does nothing on firefox.
  //value is added to initial order size.
  const borderRadiusBuffer = useRef(borderWidth);

  //extract border colours from input string
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

  useEffect(() => {
    //recalculate container width and height when container resizes.
    const resizeObserver = new ResizeObserver(() => {
      //canel any queued animation frame so they don't double up.
      cancelAnimationFrame(currentAnimationFrame.current);
      setContainerDimesion();
      reset();
      if (isTracing.current) {
        traceBorder();
      }
    });

    resizeObserver.observe(container.current);

    //clean up.
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  //update speed and duration settings when they change.
  useEffect(() => {
    animateDurationRef.current = animationDuration;
    revanimateDurationRef.current = reverseDuration;
    speedRef.current = speed;
    revSpeedRef.current = reverseSpeed;
    setSpeed();
  }, [animationDuration, reverseDuration, speed, reverseSpeed]);

  //update the references when any of the style props changes.
  useEffect(() => {
    borderRadiusBuffer.current = borderRadius - 1 <= borderWidth ? 0 : borderWidth;
    setContainerDimesion();
    initialiseStyles();
    const { trace, retrace } = buildTraceFunctions(
      borderTop.current!, borderRight.current!,
      borderBot.current!, borderLeft.current!, borderRadius, borderWidth, borderRadiusBuffer.current,
      traceAllSidesSameTime
    );
    traceFn.current = trace;
    retraceFn.current = retrace;
    if (triggers.focus) container.current.tabIndex = -1;
  },
    [
      borderWidth, borderRadius, borderColour, borderStyle,
      squareWindow, inset, trigger, traceAllSidesSameTime
    ]);

  //start the animation on rerender if it wasn't cancelled.
  useEffect(() => {
    if (isTracing.current && traceOnRerender) {
      //cancel current animation frame to prevent doubling up.
      reset();
      cancelAnimationFrame(currentAnimationFrame.current);
      traceBorder();
    }
  });

  /**
   * set the trace and retrace speeds.
   */
  const setSpeed = () => {
    const milliInSecond = 1000;
    try {
      //set trace speed
      if (revSpeedRef.current > 0) {
        traceSpeed.current = (revSpeedRef.current / milliInSecond);
      } else {
        if (animateDurationRef.current <= 0 || isNaN(animateDurationRef.current)) {
          traceSpeed.current = Number.MAX_SAFE_INTEGER;
        } else {
          const total = (containerHeight.current! * 2) + (containerWidth.current! * 2)
            - ((borderRadius + borderRadiusBuffer.current) * 4);
          traceSpeed.current = (total / (animateDurationRef.current));
        }
      }

      //set retrace speed
      if (revSpeedRef.current > 0) {
        retraceSpeed.current = (revSpeedRef.current / milliInSecond);
      } else if (revanimateDurationRef.current > 0) {
        const total = (containerHeight.current! * 2) + (containerWidth.current! * 2)
          - ((borderRadius + borderRadiusBuffer.current) * 4);
        retraceSpeed.current = (total / revanimateDurationRef.current);
      } else {
        //fall back if no reverse speed or duration is supply
        retraceSpeed.current = traceSpeed.current;
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * wrapper for initialise border styles.
   */
  const initialiseStyles = () => {

    const { container, borderTop, borderBot, borderLeft, borderRight } =
      initialiseBorderStyles({ borderRadius, borderStyle, borderWidth, inset, squareWindow },
        borderRadiusBuffer, borderColourArr);

    styleContainer.current = container;
    styleTop.current = borderTop;
    styleRight.current = borderRight;
    styleBot.current = borderBot;
    styleLeft.current = borderLeft;
    reset();
  };


  /**
   * Set the bounding rect height and width, these are the
   * final sizes of the borders.
   */
  const setContainerDimesion = () => {
    let boundingRect = container.current!.getBoundingClientRect();

    containerWidth.current = Number(boundingRect.width.toFixed(3));
    containerHeight.current = Number(boundingRect.height.toFixed(3));

    setSpeed();
  };

  //reset the borders stybles back to default.
  const reset = () => {
    resetBorderStyle(borderTop.current, styleTop.current);
    resetBorderStyle(borderBot.current, styleBot.current);
    resetBorderStyle(borderLeft.current, styleLeft.current);
    resetBorderStyle(borderRight.current, styleRight.current);
  }

  /**
   * Trace the border
   */
  const traceBorder = (previousTime: number = new Date().getTime()) => {
    try {
      // if (traceFn.current === null) return;
      //get ellapse time and multiply by traceSpeed to get border size delta.
      const currentTime = new Date().getTime();
      const speed = traceSpeed.current * (currentTime - previousTime);
      const isComplete = traceFn.current(containerWidth.current!, containerHeight.current!, speed);
      if (isTracing.current && !isComplete) {
        currentAnimationFrame.current = requestAnimationFrame(() => { traceBorder(currentTime) });
      }
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
      const speed = retraceSpeed.current * (currentTime - previousTime);
      if (!isTracing.current && !retraceFn.current(containerWidth.current!, containerHeight.current!, speed, reset)) {
        requestAnimationFrame(() => { retraceBorder(currentTime) });
      }
    } catch (err) {
      console.error(err);
    }
  }

  //initialise styles for use in render
  initialiseStyles();


  const handlePointerEnter = (evt: React.PointerEvent) => {
    evt.preventDefault();
    if (!triggers.hover) return;
    currentTriggers.current.add('hover');
    isTracing.current = true;
    traceBorder();
  };

  const handlePointerLeave = (evt: React.PointerEvent) => {
    evt.preventDefault();
    if (!triggers.hover) return;
    currentTriggers.current.delete('hover');
    isTracing.current = false;
    retraceBorder();
  };

  const handlePointerCancel = (evt: React.PointerEvent) => {
    evt.preventDefault();
    if (!triggers.hover) return;
    currentTriggers.current.delete('hover');
    currentTriggers.current.delete('focus');
    isTracing.current = false;
    retraceBorder();
  };

  const handleBlur = (evt: React.FocusEvent) => {
    evt.preventDefault();
    currentTriggers.current.delete('focus');
    isTracing.current = false;
    retraceBorder();
  }

  const handleFocus = (evt: React.FocusEvent) => {
    evt.preventDefault();
    if (!triggers.focus) return;
    currentTriggers.current.add('focus');
    isTracing.current = true;
    traceBorder();
  }

  return (

    <div
      className={classNames}
      ref={container}
      style={styleContainer.current}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >

      {/* Child elements */}
      {children}

      {/* Elements use to draw the borders on the four sides */}
      <div id='anim-trace-T' style={styleTop.current} ref={borderTop}></div>
      <div id='anim-trace-R' style={styleRight.current} ref={borderRight}></div>
      <div id='anim-trace-B' style={styleBot.current} ref={borderBot}></div>
      <div id='anim-trace-L' style={styleLeft.current} ref={borderLeft}></div>


    </div>
  )

}

export default AnimationTraceBorder;