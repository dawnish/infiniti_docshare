import {createNavigationReducer} from 'react-navigation-redux-helpers';
import {AppNavigation} from '../Navigators/AppNavigator';

export const reducer = createNavigationReducer(AppNavigation);
