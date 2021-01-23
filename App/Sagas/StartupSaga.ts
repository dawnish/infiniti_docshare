import {put} from 'redux-saga/effects';
import {IReducers} from '../Redux';
import AuthActions from '../Redux/AuthRedux';
import ConnectivityActions from '../Redux/ConnectivityRedux';
import {displayInfo} from '../Services/LogService';

export function* startupRehydrate({payload}: {payload: IReducers}) {
  yield put(ConnectivityActions.fetchIsConnected());
  yield put(AuthActions.checkAuthState());

  displayInfo({
    name: 'Startup Rehydrate',
    preview: 'Startup Rehydrate trigger',
    value: {
      payload,
    },
  });
}
