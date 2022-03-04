import { Borders, borderRadiusDict, BorderSide } from "./traceBorder";
import { getElementHeight, getElementWidth } from "./util";

/**
 * 'back track' the drawn border.
 * @param param0 Elements corrensponding to each side of the border.
 * @param radius height of parent element
 * @param width width of parent element
 * @param speed how much to subtract current border by.
 * @param radiusBuffer value added to stop 
 */
export const retraceBorders = ({ top, right, bot, left }: Borders, height: number, width: number, borderRadius: number, borderWidth: number, speed: number, radiusBuffer: number, resetCB: () => void) => {
  const currentLeftHeight = getElementHeight(left);
  const currentBotWidth = getElementWidth(bot)
  const currentRightHeight = getElementHeight(right);
  const currentTopWidth = getElementWidth(top);

  //the minimun size for each border before setting border with to 0
  const adjustedMinSize = borderRadius + radiusBuffer;
  //wrapper function to keep track of the params that never change.
  const retrace = retraceHelper(speed, borderRadius, borderWidth, radiusBuffer);
  const transparent = 'transparent';

  //set right adjacent and opposite border colour to transparent before retracing border.
  if (currentLeftHeight > adjustedMinSize) {
    top.style.borderLeftColor = transparent;
    retrace(left, 'Left', currentLeftHeight, height);
    return false;
  } else if (currentBotWidth > adjustedMinSize) {
    bot.style.borderLeftColor = transparent;
    left.style.borderRightColor = transparent;
    retrace(bot, 'Bottom', currentBotWidth, width);
    return false;
  } else if (currentRightHeight > adjustedMinSize) {
    right.style.borderBottomColor = transparent;
    bot.style.borderTopColor = transparent;
    retrace(right, 'Right', currentRightHeight, height);
    return false;
  } else if (currentTopWidth > adjustedMinSize) {
    top.style.borderRightColor = transparent;
    right.style.borderLeftColor = transparent;
    retrace(top, 'Top', currentTopWidth, width);
    return false;
  }
  resetCB();
  return true;
}

/**
 * @param speed how much to increase border size by
 * @param finalSize final size of the border
 * @param current current size of the borser
 * @param borderRadius 
 * @param borderWidth 
 * @returns 
 */
const retraceHelper = (speed: number, borderRadius: number, borderWidth: number, radiusBuffer: number, radiusDict = borderRadiusDict) => {

  /**
   * @param elem The current element representing a side of the border
   * @param side 'Top' | 'Left' | 'Right' | 'Bottom'
   * @param current The current size of the border
   * @param finalSize The final size of the border, i.e. the dimensions of the container.
   */
  const retrace = (elem: HTMLElement, side: BorderSide, current: number, finalSize: number) => {
    current -= speed;
    if (current <= borderRadius + radiusBuffer) {
      current = borderRadius + radiusBuffer;
      elem.style[`border${side}Width`] = '0px';
    } else {
      elem.style[`border${side}Width`] = borderWidth + 'px';
    }

    //calculate and set the border radius base on how much distance current border is to final border size.
    const mainRadius = Math.max(borderRadius - (finalSize - current), 0);
    let crossRadius = mainRadius;
    if (mainRadius > 0) {
      //offset for border radius.
      crossRadius = mainRadius / borderRadius * mainRadius;
    }
    //horizonal and vertical components for border radius.
    const radiusString = side === 'Top' || side === 'Bottom' ?
      mainRadius + 'px ' + crossRadius + 'px' : crossRadius + 'px ' + mainRadius + 'px';

    elem.style[radiusDict[side]] = radiusString;

    elem.style[side === 'Left' || side === 'Right' ? 'height' : 'width'] = current + 'px';
  }
  return retrace;
};