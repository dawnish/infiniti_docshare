/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import createStore from './App/Redux';

const store = createStore();
AppRegistry.registerComponent(appName, () => App.bind(null, store));
