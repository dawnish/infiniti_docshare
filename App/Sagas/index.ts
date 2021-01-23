import {all, spawn, takeLatest} from 'redux-saga/effects';

/* ------------- Types ------------- */
import {AuthReduxTypes} from '../Redux/AuthRedux';
import {StorageReduxTypes} from '../Redux/StorageRedux';

/* ------------- Sagas ------------- */
import {
  checkAuthState,
  checkIfUnauthorized,
  signInEmail,
  signUpEmail,
  signOut,
  updateUser,
  watchAuthChannel,
  watchAuthState,
  forgotPassword,
} from './AuthSaga';
import {startupRehydrate} from './StartupSaga';
import {deleteFile, getFiles, uploadFile} from './StorageSaga';

/* ------------- API ------------- */

import * as AuthService from '../Services/FirebaseAuthService';
import * as StorageService from '../Services/StorageService';

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  const sagaIndex = [
    takeLatest('persist/REHYDRATE' as any, startupRehydrate),
    takeLatest(AuthReduxTypes.SIGN_IN_EMAIL, signInEmail, AuthService),
    takeLatest(AuthReduxTypes.SIGN_UP_EMAIL, signUpEmail, AuthService),
    takeLatest(AuthReduxTypes.SIGN_OUT, signOut, AuthService),
    takeLatest(AuthReduxTypes.FORGOT_PASSWORD, forgotPassword, AuthService),
    takeLatest(AuthReduxTypes.CHECK_AUTH_STATE, checkAuthState, AuthService),
    takeLatest(
      AuthReduxTypes.CHECK_IF_UNAUTHORIZED,
      checkIfUnauthorized,
      AuthService,
    ),
    takeLatest(AuthReduxTypes.UPDATE_USER, updateUser, AuthService),
    takeLatest(AuthReduxTypes.WATCH_AUTH_STATE, watchAuthState, AuthService),
    takeLatest(StorageReduxTypes.GET_FILES, getFiles, StorageService),
    takeLatest(StorageReduxTypes.UPLOAD_FILE, uploadFile, StorageService),
    takeLatest(StorageReduxTypes.DELETE_FILE, deleteFile, StorageService),
    spawn(watchAuthChannel),
  ];
  yield all(sagaIndex);
}
