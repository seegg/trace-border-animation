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