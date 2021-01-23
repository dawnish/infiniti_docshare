import {ReducerState} from 'react-navigation-redux-helpers';
import {isEmpty} from 'validate.js';

export const getCurrentScreen = (navState: ReducerState): string | null => {
  if (!navState || navState.index < 0) {
    return null;
  }
  let route = navState.routes[navState.index];
  // dive into nested navigators
  if (!isEmpty(route) && !isEmpty(route.routes)) {
    return getCurrentScreen(route);
  }
  route = navState.routes[navState.index];
  return route.routeName;
};

export const getPreviousRouteName = (navState: any): string | null => {
  if (!navState || navState.index < 0) {
    return null;
  }
  let route = navState.routes[navState.index];
  // dive into nested navigators
  if (!isEmpty(route) && !isEmpty(route.routes)) {
    return getPreviousRouteName(route);
  }
  if (navState.index > 0) {
    route = navState.routes[navState.index - 1];
  }
  return route.routeName;
};
