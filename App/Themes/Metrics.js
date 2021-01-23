import {Dimensions, Platform} from 'react-native';
import config from '../Config/AppConfig';

const {width, height} = Dimensions.get('window');
const screenWidth = width < height ? width : height;
const screenHeight = width < height ? height : width;

function wp(percentage) {
  const value = (percentage * width) / 100;
  return Math.round(value);
}
const slideWidth = wp(60);
const subCardPaddingHorizontal = wp(2);

const subCardHeight = Math.round(height * 0.3);
const subCardWidth = slideWidth + subCardPaddingHorizontal * 2;

// Used via Metrics.baseMargin
const metrics = {
  baseMargin: 10,
  buttonRadius: 4,
  cardRadius: 5,
  categoryTabWidth: (screenWidth - 56) / 3,
  doubleBaseMargin: 20,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 50,
  },
  imageCarousel: {
    width: screenWidth,
    height: screenWidth * (2 / 3),
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 200,
    avatar: 94,
  },
  listViewHeight: 72,
  listViewHeightSmall: 48,
  locationBackgroundHeight: screenHeight * 0.185757121,
  mainCardHeight: 128,
  mapSnapshot: {
    width: screenWidth,
    height: screenWidth * (2 / 3),
  },
  marginBody1Bottom: 24,
  marginBody2Bottom: 20,
  marginHorizontal: 16,
  marginHorizontalSmall: 8,
  marginHeadlineBottom: 32,
  marginSubHeading1Bottom: 24,
  marginSubHeading2Bottom: 28,
  marginVertical: 8,
  marginVerticalLarge: 16,
  modalHeight: screenWidth * (2 / 3),
  navBarHeight: Platform.OS === 'ios' ? 54 : 64,
  row1Width: 40,
  screenWidth,
  screenHeight,
  searchBarHeight: 30,
  section: 25,
  smallMargin: 5,
  subCardHeight,
  subCardPaddingHorizontal,
  subCardWidth,
  statusBarVertical: config.isAndroid ? 24 : 24, // 13,
  toolbarHeight: 56,
  toolbarHeightSmall: 42,
};

export default metrics;
