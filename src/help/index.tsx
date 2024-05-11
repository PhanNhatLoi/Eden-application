// reuseable function
// helpers
import {Dimensions, PixelRatio, Platform} from 'react-native';
let widthDP = Dimensions.get('screen').width;
let heightDP = Dimensions.get('screen').height;
let widthPixel = PixelRatio.getPixelSizeForLayoutSize(widthDP);
let heightPixel = PixelRatio.getPixelSizeForLayoutSize(heightDP);
export const SCREEN = {
  width: widthDP,
  height:
    Dimensions.get('window').height - (Platform.OS === 'android' ? 0 : 60),
  height_full: heightDP,
  width_pixel: widthPixel.toFixed(0),
  height_pixel: heightPixel.toFixed(0),
  pixel_ratio: PixelRatio.get(),
};
