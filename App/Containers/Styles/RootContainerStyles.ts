import {StyleSheet} from 'react-native';
import {Colors, Fonts, Metrics} from '../../Themes/';

export default StyleSheet.create({
  applicationView: {
    flex: 1,
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    justifyContent: 'center',
  },
  myImage: {
    alignSelf: 'center',
    height: 200,
    width: 200,
  },
  welcome: {
    fontFamily: Fonts.type.regular,
    fontSize: 20,
    margin: Metrics.baseMargin,
    textAlign: 'center',
  },
});
