const WHITE40 = 'rgba(255, 255, 255, 0.4)';
const WHITE60 = 'rgba(255, 255, 255, 0.6)';
const WHITE80 = 'rgba(255, 255, 255, 0.8)';
const WHITE90 = 'rgba(255, 255, 255, 0.9)';
const ROBOTO_LIGHT = 100;
const ROBOTO_SEMILIGHT = 300;
const ROBOTO_REGULAR = 400;
const ROBOTO_SEMIBOLD = 500;
const ROBOTO_BOLD = 700;
const ROBOTO_EXTRABOLD = 900;

const getRemInPixel = (): number => parseFloat(getComputedStyle(document.documentElement).fontSize); 

const ToRem = (pixel: number): string => `${pixel / getRemInPixel()}rem`;

export {
  WHITE40,
  WHITE60,
  WHITE80,
  WHITE90,
  ROBOTO_LIGHT,
  ROBOTO_SEMILIGHT,
  ROBOTO_REGULAR,
  ROBOTO_SEMIBOLD,
  ROBOTO_BOLD,
  ROBOTO_EXTRABOLD,
  getRemInPixel,
  ToRem
}
