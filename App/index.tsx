import 'react-native-gesture-handler';

import React from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {Provider} from 'react-redux';
import {Action, Store} from 'redux';
import RootContainer from './Containers/RootContainer';
import {IReducers} from './Redux';
import BuildConfig from 'react-native-config';
import ReactotronConfig from './Config/ReactotronConfig';

const App = (store: Store<IReducers, Action<any>>) => {
  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#092247',
      accent: '#D12635',
    },
  };

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <RootContainer />
      </PaperProvider>
    </Provider>
  );
};

const isDebugBuild = BuildConfig.IS_DEBUG && BuildConfig.IS_DEBUG === 'true';
export default isDebugBuild && ReactotronConfig.overlay
  ? ReactotronConfig.overlay(App)
  : App;
