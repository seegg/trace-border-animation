import { ITraceBorderProps } from "./AnimationTraceBorder";

export const initialiseBorderStyles = ({ borderRadius, borderWidth, borderStyle, inset, squareWindow, }: ITraceBorderProps, borderRadiusBuffer: React.MutableRefObject<number>, borderColourArr: string[],) => {

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
    borderTopStyle: borderStyle as any,
    borderLeftStyle: borderStyle as any,
    borderRightStyle: borderStyle as any,
    borderBottomStyle: borderStyle as any,

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
    ...(squareWindow && { borderBottomColor: `${borderColourArr[0]}` }),
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
    ...(!squareWindow && { borderRightStyle: 'none', width: `${borderRadius}px` }),
    ...(squareWindow && { borderRightColor: `${borderColourArr[1]}` }),
    borderLeftWidth: '0px',
    borderLeftStyle: `${borderStyle}` as any,
    borderLeftColor: `${borderColourArr[1]}`,
    borderBottomLeftRadius: `${borderRadius}px`,
    left: '0',
    bottom: '0',
  };

  const borderBot: React.CSSProperties = {
    ...borderTopBot,
    ...(!squareWindow && { borderTopStyle: 'none', height: `${borderRadius}px` }),
    ...(squareWindow && { borderTopColor: `${borderColourArr[2]}` }),
    borderBottomWidth: '0px',
    borderBottomStyle: `${borderStyle}` as any,
    borderBottomColor: `${borderColourArr[2]}`,
    borderBottomRightRadius: `${borderRadius}px`,
    right: '0',
    bottom: '0',
  };

  const borderRight: React.CSSProperties = {
    ...borderLeftRight,
    ...(!squareWindow && { borderLeftStyle: 'none', width: `${borderRadius}px` }),
    ...(squareWindow && { borderLeftColor: `${borderColourArr[3]}` }),
    borderRightWidth: '0px',
    borderRightStyle: `${borderStyle}` as any,
    borderRightColor: `${borderColourArr[3]}`,
    borderTopRightRadius: `${borderRadius}px`,
    right: '0',
    top: '0',
    margin: '0'
  };


  return {
    container,
    borderTop,
    borderBot,
    borderLeft,
    borderRight
  }
};