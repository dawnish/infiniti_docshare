import {Platform} from 'react-native';
import BuildConfig from 'react-native-config';

export default {
  // font scaling override - RN default is on
  allowTextFontScaling: true,
  isAndroid: Platform.OS === 'android',
  isIOS: Platform.OS === 'ios',
  url: BuildConfig.API_URL,
};
