import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../Themes';

export default StyleSheet.create({
  card: {
    backgroundColor: Colors.snow,
    opacity: 1,
  },
  header: {
    backgroundColor: Colors.background,
  },
  tabBar: {
    backgroundColor: Colors.primary,
    borderTopColor: 'rgba(255,255,255,0.3)',
    borderTopWidth: 1,
    height: 54,
    paddingBottom: 1,
    paddingHorizontal: 28,
    paddingTop: 5,
  },
  tabBarIndicatorStyle: {
    backgroundColor: Colors.secondary,
  },
  tabBarLabel: {
    ...Fonts.style.caption,
    color: Colors.text,
    letterSpacing: 0,
  },
});
