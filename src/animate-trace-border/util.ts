export const getElementHeight = (element: HTMLElement) => {
  return Number(element.style.height.slice(0, -2));
}

export const getElementWidth = (element: HTMLElement) => {
  return Number(element.style.width.slice(0, -2));

}

/**
  * Assign style to HTML element
  * @param border one of the four html elements use to draw the border.
  * @param styleProperties style object corresponding to that element.
  */
export const assignStyling = (border: HTMLElement | null, styleProperties: React.CSSProperties) => {
  if (border instanceof HTMLElement) {
    try {

      for (const prop in styleProperties) {

        border.style[prop] = styleProperties[prop];
      }

    } catch (err) {
      console.error(err);
    };
  }
};

export const circleUtils = (() => {

  interface Point {
    x: number,
    y: number
  }

  interface Circle extends Point {
    r: number,
  }
  /**
  * returns the difference between x and y axis of two points
  * from origin to destination.
  * Will return negative values depenping on the orientation of the points.
  */
  function xyDiffBetweenPoints(origin: Point, destination: Point): [number, number] {
    return [destination.x - origin.x, destination.y - origin.y];
  }

  function distanceBetween2Points(point1: Point, point2: Point): number {
    const [diffX, diffY] = xyDiffBetweenPoints(point1, point2);
    return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
  }

  function angleBetween2DVector(vx1: number, vy1: number, vx2: number, vy2: number): number {

    const dotProduct = (vx1 * vx2) + (vy1 * vy2);
    const magnitude1 = Math.sqrt(Math.pow(vx1, 2) + Math.pow(vy1, 2));
    const magnitude2 = Math.sqrt(Math.pow(vx2, 2) + Math.pow(vy2, 2));
    return Math.acos(dotProduct / (magnitude1 * magnitude2)) * (180 / Math.PI);
  }

  function angleBetween3Points(start: Point, mid: Point, end: Point): number {
    return angleBetween2DVector(mid.x - start.x, mid.y - start.y, end.x - mid.x, end.y - mid.y);
  }

  /**
   *wrapper for circleLineIntersec
   */
  function getCircLineIntersect(x1, y1, x2, y2, x, y, r) {
    return circleLineIntersect({ x: x1, y: y1 }, { x: x2, y: y2 }, { x, y, r });
  }

  /**
   * @returns The number of points and the points themselves where the line intersects with the circle. 
   * No intersection 0, tangent 1 else 2.
   */
  function circleLineIntersect(lineStart: Point, lineEnd: Point, circle: Circle): [number, Point | null, Point | null] {
    //translate the coordinates of the line with the center of the circle as origin.
    const translatedStart = { x: +lineStart.x - +circle.x, y: +lineStart.y - +circle.y };
    const translatedEnd = { x: +lineEnd.x - +circle.x, y: +lineEnd.y - +circle.y };

    // console.log(translatedStart, translatedEnd);
    const dx = translatedEnd.x - translatedStart.x;
    const dy = translatedEnd.y - translatedStart.y;
    const dr = distanceBetween2Points(translatedStart, translatedEnd);
    const D = (translatedStart.x * translatedEnd.y) - (translatedEnd.x * translatedStart.y);

    const sgnDy = dy < 0 ? -1 : 1;
    const rSquared = Math.pow(circle.r, 2);
    const drSquared = Math.pow(dr, 2);
    const DSquared = Math.pow(D, 2);
    // console.log(dx, dy);
    const discriminant = rSquared * drSquared - DSquared;
    const numberOfIntersections = discriminant < 0 ? 0 : discriminant === 0 ? 1 : 2;
    // console.log(discriminant);
    if (discriminant < 0) return [numberOfIntersections, null, null];
    // console.log('what');
    const sqrtResult = Math.sqrt(discriminant);


    //calculat intersecting points and translate it back to original corrodinates.
    const x1 = ((D * dy) + (sgnDy * dx * sqrtResult)) / drSquared + Number(circle.x);
    const y1 = ((-1 * D * dx) + (Math.abs(dy) * sqrtResult)) / drSquared + Number(circle.y);

    const x2 = ((D * dy) - (sgnDy * dx * sqrtResult)) / drSquared + Number(circle.x);
    const y2 = ((-1 * D * dx) - (Math.abs(dy) * sqrtResult)) / drSquared + Number(circle.y);

    let intersect1 = { x: x1, y: y1 };
    let intersect2 = { x: x2, y: y2 };

    if (x1 > x2 || (x1 === x2 && y1 > y2)) {
      intersect2 = { ...intersect1 };
      intersect1 = { x: x2, y: y2 };
    }

    return [numberOfIntersections, intersect1, discriminant === 0 ? null : intersect2];
  }

  return {
    xyDiffBetweenPoints,
    angleBetween2DVector,
    angleBetween3Points,
    distanceBetween2Points,
    getCircLineIntersect,
    circleLineIntersect,
  };
})();