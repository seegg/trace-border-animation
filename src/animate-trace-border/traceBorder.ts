import { retraceBorders } from "./retrace";
import { traceBorders } from "./trace";

export interface Borders {
  top: HTMLDivElement,
  right: HTMLDivElement,
  bot: HTMLDivElement,
  left: HTMLDivElement
}

export type BorderSide = 'Top' | 'Left' | 'Right' | 'Bottom';

export type RadiusPosition = 'borderTopRightRadius' | 'borderBottomRightRadius' | 'borderBottomLeftRadius' | 'borderTopLeftRadius';

export const borderRadiusDict: { [key: string]: RadiusPosition } = {
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
const build = (top: HTMLDivElement, right: HTMLDivElement,
  bot: HTMLDivElement, left: HTMLDivElement,
  radius: number, borderWidth: number,
  radiusBuffer: number, traceAllSidesSameTime: boolean) => {
  const borders = { top, left, right, bot };

  /**
   * 
   * @param width width of the container
   * @param height height of the container
   * @param speed the value in px to be added to border.
   * @returns whether tracing is finish or not.
   */
  const trace = (width: number, height: number, speed: number) => {
    return traceBorders(borders, height, width, radius, borderWidth, speed, radiusBuffer), traceAllSidesSameTime;
  };

  /**
   * 
  * @param width width of the container
   * @param height height of the container
   * @param speed the value in px to be added to border.
   * @param resetCB callback to reset borders to initial state.
   * @returns 
   */
  const retrace = (width: number, height: number, speed: number, resetCB: () => void) => {
    return retraceBorders(borders, height, width, radius, borderWidth, speed, radiusBuffer, resetCB);
  };

  return { trace, retrace };

};

export default build;