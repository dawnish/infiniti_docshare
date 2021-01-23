import {StyleSheet} from 'react-native';
import {Colors} from '../../Themes';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    backgroundColor: Colors.snow,
    flex: 1,
    justifyContent: 'center',
  },
  loadingBackgroudView: {
    backgroundColor: 'rgba(125, 125, 255, 1)',
  },
});
