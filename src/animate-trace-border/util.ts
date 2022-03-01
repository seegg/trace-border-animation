export const getElementHeight = (element: HTMLElement) => {
  return Number(element.style.height.slice(0, -2));
}

export const getElementWidth = (element: HTMLElement) => {
  return Number(element.style.width.slice(0, -2));

}