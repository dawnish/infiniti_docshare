import {NavigationActions} from 'react-navigation';
import {debugLog, displayInfo} from '../Services/LogService';

// gets the current screen from navigation state
const getCurrentRouteName = (navigationState: any): string | null => {
  if (!navigationState || navigationState.index < 0) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
};

const screenTracking = ({getState}: {getState: any}) => (next: any) => (
  action: any,
) => {
  if (
    action.type !== NavigationActions.NAVIGATE &&
    action.type !== NavigationActions.BACK
  ) {
    return next(action);
  }
  const currentScreen = getCurrentRouteName(getState().nav);
  const result = next(action);
  const nextScreen = getCurrentRouteName(getState().nav);
  if (nextScreen !== currentScreen) {
    try {
      displayInfo({
        name: 'NAVI FROM:',
        preview: `${currentScreen} to ${nextScreen}`,
        value: {},
      });
      // Example: Analytics.trackEvent('user_navigation', {currentScreen, nextScreen})
    } catch (e) {
      debugLog(e);
    }
  }
  return result;
};

export default screenTracking;
