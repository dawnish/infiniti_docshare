import {persistCombineReducers} from 'redux-persist';
import {PersistPartial} from 'redux-persist/es/persistReducer';
import ReduxPersist from '../Config/ReduxPersist';
import rootSaga from '../Sagas';
import {AuthReduxTypes, IAuthReduxState} from './AuthRedux';
import {IConnectivityReduxState} from './ConnectivityRedux';
import configureStore from './CreateStore';
import {IStatusMsgBoxReduxState} from './StatusMsgBoxRedux';
import {IStorageReduxState} from './StorageRedux';

/* ------------- Assemble Persit Combine Reducer ------------- */
const config = ReduxPersist.storeConfig;

export interface IReducers {
  auth: IAuthReduxState;
  connection: IConnectivityReduxState;
  nav: any;
  statusMsgBox: IStatusMsgBoxReduxState;
  storage: IStorageReduxState;
}
export const reducers = persistCombineReducers<IReducers>(config, {
  auth: require('./AuthRedux').reducer,
  connection: require('./ConnectivityRedux').reducer,
  nav: require('./NavigationRedux').reducer,
  statusMsgBox: require('./StatusMsgBoxRedux').reducer,
  storage: require('./StorageRedux').reducer,
});

export default () => {
  const rootReducer = (state: IReducers & PersistPartial, action: any) => {
    if (action.type === AuthReduxTypes.SIGN_OUT) {
      return reducers(undefined, action);
    }
    return reducers(state, action);
  };

  // tslint:disable-next-line:prefer-const
  let {store, sagasManager, sagaMiddleware} = configureStore(
    rootReducer,
    rootSaga,
  );

  // @ts-ignore: module.hot not available in NodeModule declaration
  if (module.hot) {
    // @ts-ignore: module.hot not available in NodeModule declaration
    module.hot.accept(() => {
      const nextRootReducer = require('./').reducers;
      store.replaceReducer(nextRootReducer);

      const newYieldedSagas = require('../Sagas').default;
      sagasManager.cancel();
      sagasManager.toPromise().then(() => {
        sagasManager = sagaMiddleware.run(newYieldedSagas);
      });
    });
  }

  return store;
};
