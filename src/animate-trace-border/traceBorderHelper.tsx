interface Borders {
  top: HTMLDivElement,
  right: HTMLDivElement,
  bot: HTMLDivElement,
  left: HTMLDivElement
}

type BorderSide = 'Top' | 'Left' | 'Right' | 'Bottom';

type RadiusPosition = 'borderTopRightRadius' | 'borderBottomRightRadius' | 'borderBottomLeftRadius' | 'borderTopLeftRadius';

const borderRadiusDict: { [key: string]: RadiusPosition } = {
  'Top': 'borderTopRightRadius',
  'Right': 'borderBottomRightRadius',
  'Bottom': 'borderBottomLeftRadius',
  'Left': 'borderTopLeftRadius'
}


/**
 * Builds the trace and retrace functions.
 * @param top top border
 * @param right right border
 * @param bot bottom border
 * @param left left border
 * @param radius border radius
 * @param borderWidth border width
 * @param radiusBuffer const value added to initial border size to stop janky animation on chrome
 */
export const build = (top: HTMLDivElement, right: HTMLDivElement, bot: HTMLDivElement, left: HTMLDivElement, radius: number, borderWidth: number, radiusBuffer: number) => {
  const borders = { top, left, right, bot };
  return [
    (width: number, height: number, speed: number) => { return traceBorders(borders, height, width, radius, borderWidth, speed, radiusBuffer) },
    (width: number, height: number, speed: number) => { return retraceBorders(borders, height, width, radius, borderWidth, speed, radiusBuffer) }
  ]
}

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
    elem.style[radiusDict[side]] = Math.max(borderRadius - (finalSize - current), 0) + 'px';
    //set the borderwidth
    elem.style[`border${side}Width`] = borderWidth + 'px';
    //set height or width 
    elem.style[side === 'Left' || side === 'Right' ? 'height' : 'width'] = current + 'px';
  }
  return trace;
};

/**
 * 'back track' the drawn border.
 * @param param0 Elements corrensponding to each side of the border.
 * @param radius height of parent element
 * @param width width of parent element
 * @param speed how much to subtract current border by.
 * @param radiusBuffer value added to stop 
 */
const retraceBorders = ({ top, right, bot, left }: Borders, height: number, width: number, borderRadius: number, borderWidth: number, speed: number, radiusBuffer: number) => {
  const currentLeftHeight = getElementHeight(left);
  const currentBotWidth = getElementWidth(bot)
  const currentRightHeight = getElementHeight(right);
  const currentTopWidth = getElementWidth(top);

  //the minimun size for each border before setting border with to 0
  const adjustedMinSize = borderRadius + radiusBuffer;
  //wrapper function to keep track of the params that never change.
  const retrace = retraceHelper(speed, borderRadius, borderWidth, radiusBuffer);

  //set right adjacent border colour back to transparent before retracing border.
  if (currentLeftHeight > adjustedMinSize) {
    top.style.borderLeftColor = 'transparent';
    retrace(left, 'Left', currentLeftHeight, height);
    return false;
  } else if (currentBotWidth > adjustedMinSize) {
    bot.style.borderLeftColor = 'transparent';
    retrace(bot, 'Bottom', currentBotWidth, width);
    return false;
  } else if (currentRightHeight > adjustedMinSize) {
    right.style.borderBottomColor = 'transparent';
    retrace(right, 'Right', currentRightHeight, height);
    return false;
  } else if (currentTopWidth > adjustedMinSize) {
    top.style.borderRightColor = 'transparent';
    retrace(top, 'Top', currentTopWidth, width);
    return false;
  }
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
      elem.style[side === 'Left' || side === 'Right' ? 'height' : 'width'] = borderRadius + radiusBuffer + 'px';
    } else {
      elem.style[`border${side}Width`] = borderWidth + 'px';
    }
    elem.style[radiusDict[side]] = Math.max(borderRadius - (finalSize - current), 0) + 'px';
    elem.style[side === 'Left' || side === 'Right' ? 'height' : 'width'] = current + 'px';
  }
  return retrace;
}

const getElementHeight = (element: HTMLElement) => {
  return Number(element.style.height.slice(0, -2));
}

const getElementWidth = (element: HTMLElement) => {
  return Number(element.style.width.slice(0, -2));

}