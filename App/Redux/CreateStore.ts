import {createReactNavigationReduxMiddleware} from 'react-navigation-redux-helpers';
import {applyMiddleware, compose, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {IReducers} from '.';
import Config from '../Config/DebugConfig';
import Reactotron from '../Config/ReactotronConfig';
import ReduxPersist from '../Config/ReduxPersist';
import RehydrationServices from '../Services/RehydrationService';
import ScreenTracking from './ScreenTrackingMiddleware';

// creates the store
export default (rootReducer: any, rootSaga: any) => {
  /* ------------- Redux Configuration ------------- */
  const middleware = [];
  const enhancers = [];

  /* ------------- ScreenTracking Middleware ------------- */
  middleware.push(ScreenTracking);

  /* ------------- Navigation Middleware ------------- */
  const navMiddleware = createReactNavigationReduxMiddleware<IReducers>(
    (state) => state.nav,
    'root',
  );

  middleware.push(navMiddleware);

  /* ------------- Saga Middleware ------------- */
  // @ts-ignore: tron is available in console module
  // tslint:disable-next-line:no-console
  const sagaMonitor =
    Config.useReactotron && Reactotron.createSagaMonitor
      ? Reactotron.createSagaMonitor()
      : undefined;
  const sagaMiddleware = createSagaMiddleware({sagaMonitor});
  middleware.push(sagaMiddleware);

  /* ------------- Assemble Middleware ------------- */

  enhancers.push(applyMiddleware(...middleware));
  if (Config.useReactotron && Reactotron.createEnhancer) {
    enhancers.push(Reactotron.createEnhancer());
  }

  // if Reactotron is enabled (default for __DEV__), we'll create the store through Reactotron
  // @ts-ignore: tron is available in console module
  // tslint:disable-next-line:no-console
  // const createAppropriateStore = Config.useReactotron ? Reactotron.createStore : createStore;
  const store = createStore(rootReducer, compose(...enhancers));

  // configure persistStore and check reducer version number
  if (ReduxPersist.active) {
    RehydrationServices.updateReducers(store);
  }
  // kick off root saga
  const sagasManager = sagaMiddleware.run(rootSaga);

  return {
    sagaMiddleware,
    sagasManager,
    store,
  };
};
