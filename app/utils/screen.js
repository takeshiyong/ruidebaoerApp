let ReactNative = require('react-native');
// 获取屏幕的dp
import {Dimensions, Platform, StatusBar} from 'react-native';
let screenW = Dimensions.get('window').width;
let screenH = Dimensions.get('window').height;
let fontScale = ReactNative.PixelRatio.getFontScale();
let pixelRatio = ReactNative.PixelRatio.get();
// 高保真的宽度和告诉
const designWidth = 375.0;
const designHeight = 667.0;

// 根据dp获取屏幕的px
let screenPxW = ReactNative.PixelRatio.getPixelSizeForLayoutSize(screenW);
let screenPxH = ReactNative.PixelRatio.getPixelSizeForLayoutSize(screenH);


// 判断是不是x序列手机
export function isIphoneX() {
  return Platform.OS === 'ios' && (Number(((screenH/screenW)+"").substr(0,4)) * 100) === 216;
}

// 主页信息高度
export function barHeight() {
    if (Platform.OS === 'android') {
      return StatusBar.currentHeight;
    } else {
        if (isIphoneX()) {
            return 40;
        } else {
            return 30;
        }
    }
}

// 导航栏高度
export function navHeight() {
  if (Platform.OS === 'android') {
    return {height: 70, paddingTop: 40};
  } else {
    if (isIphoneX()) {
      return {height: 35, paddingTop: 30};
    } else {
      return {height: 45, paddingTop: 20};
    }
  }
}

// 除去导航栏的高度
export function clientHeight() {
  if (Platform.OS === 'android') {
    return screenH - 70;
  } else {
    if (isIphoneX()) {
      return screenH - 35;
    } else {
      return screenH - 45;
    }
  }
}

/**
 * 设置text
 * @param size  px
 * @returns {Number} dp
 */
export function sT(size) {
    var scaleWidth = screenW / designWidth;
    var scaleHeight = screenH / designHeight;
    var scale = Math.min(scaleWidth, scaleHeight);
    size = Math.round(size * scale / fontScale + 0.5);
    return size;
}

/**
 * 设置高度
 * @param size  px
 * @returns {Number} dp
 */
export function sH(size) {
    var scaleHeight = size * screenPxH / designHeight;
    size = Math.round((scaleHeight / pixelRatio + 0.5));
    return size;
}

/**
 * 设置宽度
 * @param size  px
 * @returns {Number} dp
 */
export function sW(size) {
    var scaleWidth = size * screenPxW / designWidth;
    size = Math.round((scaleWidth / pixelRatio + 0.5));
    return size;
}