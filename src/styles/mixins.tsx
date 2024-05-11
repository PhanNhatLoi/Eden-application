import {Dimensions, PixelRatio} from 'react-native';
const WINDOW_WIDTH = Dimensions.get('window').width;
const guidelineBaseWidth = 375;
export const scaleSize = (size: number) =>
  (WINDOW_WIDTH / guidelineBaseWidth) * size;

export const scaleFont = (size: number) => size * PixelRatio.getFontScale();

type stylesType = {
  marginTop?: number;
  marginRight?: number;
  marginLeft?: number;
  marginBottom?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingLeft?: number;
  paddingBottom?: number;
};

function dimensions(
  property: 'margin' | 'padding',
  top?: number,
  right = top,
  bottom = top,
  left = right,
) {
  let styles: stylesType = {};
  styles[`${property}Top`] = top;
  styles[`${property}Right`] = right;
  styles[`${property}Bottom`] = bottom;
  styles[`${property}Left`] = left;
  return styles;
}
export function margin(
  top?: number,
  right?: number,
  bottom?: number,
  left?: number,
) {
  return dimensions('margin', top, right, bottom, left);
}
export function padding(
  top?: number,
  right?: number,
  bottom?: number,
  left?: number,
) {
  return dimensions('padding', top, right, bottom, left);
}
export function boxShadow(
  color: string,
  offset = {height: 2, width: 2},
  radius = 2,
  opacity = 0.2,
) {
  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: radius,
  };
}
