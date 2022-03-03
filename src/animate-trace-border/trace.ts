import { Borders, borderRadiusDict, BorderSide } from "./traceBorder";
import { getElementHeight, getElementWidth } from './util';

/**
 * trace the outer edge of an element or a group of elements.
 * @param param0 
 * @param radius border radius
 * @param width final border width
 * @param height final order height
 * @param speed how much to increase width or height by.
 * @param radiusBuffer const value added to initial border size to stop janky animation on chrome
 */
export const traceBorders = ({ top, right, bot, left }: Borders, height: number, width: number, borderRadius: number, borderWidth: number, speed: number, radiusBuffer: number) => {
  const currentLeftHeight = getElementHeight(left);
  const currentBotWidth = getElementWidth(bot)
  const currentRightHeight = getElementHeight(right);
  const currentTopWidth = getElementWidth(top);

  const trace = traceHelper(speed, borderRadius, borderWidth, radiusBuffer);

  //draw the borders from top left corner clockwise.
  //after each section of border is drawn, switch its right adjacent border colour
  //from transparaent to hide the 1px gap between connecting borders.
  if (currentTopWidth < width) {
    trace(top, 'Top', currentTopWidth, width);
    return false;
  } else if (currentRightHeight < height) {
    top.style.borderRightColor = top.style.borderTopColor;
    trace(right, 'Right', currentRightHeight, height);
    return false;
  } else if (currentBotWidth < width) {
    right.style.borderBottomColor = right.style.borderRightColor;
    trace(bot, 'Bottom', currentBotWidth, width);
    return false;
  } else if (currentLeftHeight < height) {
    bot.style.borderLeftColor = bot.style.borderBottomColor;
    trace(left, 'Left', currentLeftHeight, height);
    return false;
  }
  top.style.borderLeftColor = top.style.borderTopColor;
  return true;
};


const traceHelper = (speed: number, borderRadius: number, borderWidth: number, radiusBuffer: number, radiusDict = borderRadiusDict) => {
  /**
   * @param elem The current element representing a side of the border
   * @param side 'Top' | 'Left' | 'Right' | 'Bottom'
   * @param current The current size of the border
   * @param finalSize The final size of the border, i.e. the dimensions of the container.
   */
  const trace = (elem: HTMLElement, side: BorderSide, current: number, finalSize: number) => {
    //first iteration of the border
    if (current === borderRadius + radiusBuffer) {
      if (speed > current) {
        current = speed;
      } else {
        current += 0.1;
      }
      speed = 0;
    }
    //calculate new border size, if its bigger than the parent
    //element's dimensions the extra is move to the overflow.
    current += speed;
    if (current > finalSize) {
      current = finalSize;
    }
    //calculate and set the border radius base on how much distance current border is to final border size.
    const remainder = borderRadius - (finalSize - current);
    elem.style[radiusDict[side]] = Math.max(remainder, 0) + 'px';
    //set the borderwidth
    elem.style[`border${side}Width`] = borderWidth + 'px';
    //set height or width 
    elem.style[side === 'Left' || side === 'Right' ? 'height' : 'width'] = current + 'px';
  }
  return trace;
};