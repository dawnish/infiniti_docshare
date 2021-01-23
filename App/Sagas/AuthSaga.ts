import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {channel} from 'redux-saga';
import {call, put, select, take} from 'redux-saga/effects';
import {isEmpty} from 'validate.js';
import {SaveStatusEnum} from '../Literals/Enums';
import AuthActions from '../Redux/AuthRedux';
import StorageActions from '../Redux/StorageRedux';
import StatusMsgActions from '../Redux/StatusMsgBoxRedux';
import * as Selectors from '../Redux/Selectors';
import {displayInfo} from '../Services/LogService';
import {TransformFireUserToIUser} from '../Services/TransformationServices';
import {isAuthError} from '../Services/ValidationService';

const authChannel = channel();

export function* checkAuthState(service: any, _: any) {
  yield put(AuthActions.setIsAuthenticating(true));
  yield put(AuthActions.setAuthError(null));
  try {
    const user = yield call(service.CheckAuthState);
    if (user) {
      yield put(AuthActions.setUser(TransformFireUserToIUser(user)));
      const token = yield user.getIdToken();
      if (token) {
        yield put(AuthActions.setToken(token));
        yield put(AuthActions.setIsAuthenticating(false));
        return token;
      }
      yield put(AuthActions.setIsAuthenticating(false));
    }
    return null;
  } catch (ex) {
    displayInfo({
      name: 'AuthSaga',
      preview: 'checkAuthStateSaga_Exception',
      value: {ex, message: ex && ex.message},
    });
    if (isAuthError(ex)) {
      yield put(AuthActions.setAuthError({code: ex.code, message: ex.message}));
    }
    yield put(AuthActions.setIsAuthenticating(false));
    return null;
  }
}

export function* checkIfUnauthorized(service: any, payload: any) {
  try {
    const isUnauthorized = yield call(service.CheckIfUnauthorized, payload.ex);
    if (isUnauthorized) {
      yield call(service.SignOut);
      yield put(AuthActions.setAuthError({code: 403, message: 'Unauthorized'}));
      yield put(AuthActions.setUser(null));
      yield put(AuthActions.setToken(null));
    }
  } catch (ex) {
    displayInfo({
      name: 'AuthSaga',
      preview: 'checkIfUnauthorized_Exception',
      value: {ex, message: ex.message},
    });
  }
}

export function* signInEmail(service: any, payload: any) {
  yield put(AuthActions.setIsAuthenticating(true));
  yield put(AuthActions.setAuthError(null));
  try {
    const response = yield call(
      service.SignInWithEmailAndPassword,
      payload.email,
      payload.password,
    );
    if (response.user) {
      yield put(AuthActions.setUser(TransformFireUserToIUser(response.user)));
      const token = yield response.user.getIdToken(true);
      if (token) {
        yield put(AuthActions.setToken(token));
      }
    } else {
      StatusMsgActions.setError(
        'Err',
        'Unable to sign you in now! Please check your connection or reset password',
      );
    }
    yield put(AuthActions.setIsAuthenticating(false));
  } catch (ex) {
    displayInfo({
      name: 'AuthSaga',
      preview: 'SignInEmail_Exception',
      value: {ex, message: ex.message},
    });
    if (!ex) {
      yield put(AuthActions.setUser(null));
      yield put(AuthActions.setToken(null));
    }
    if (isAuthError(ex)) {
      yield put(AuthActions.setAuthError({code: ex.code, message: ex.message}));
      StatusMsgActions.setError(ex.code, ex.message);
    }
    yield put(AuthActions.setIsAuthenticating(false));
  }
}

export function* signUpEmail(service: any, payload: any) {
  yield put(AuthActions.setIsAuthenticating(true));
  yield put(AuthActions.setAuthError(null));
  try {
    const response = yield call(
      service.SignUpUserEmail,
      payload.email,
      payload.password,
    );
    if (response.user) {
      yield put(AuthActions.setUser(TransformFireUserToIUser(response.user)));
      const token = yield response.user.getIdToken(true);
      if (token) {
        yield put(AuthActions.setToken(token));
      }
    } else {
      StatusMsgActions.setError(
        'Err',
        'Oops! Unable to sign up now due to some technical issue. Please try relaunching the app',
      );
    }
    yield put(AuthActions.setIsAuthenticating(false));
  } catch (ex) {
    displayInfo({
      name: 'AuthSaga',
      preview: 'SignUpEmail_Exception',
      value: {ex, message: ex.message},
    });
    if (!ex) {
      yield put(AuthActions.setUser(null));
      yield put(AuthActions.setToken(null));
    } else if (isAuthError(ex)) {
      yield put(AuthActions.setAuthError({code: ex.code, message: ex.message}));
    }
    yield put(AuthActions.setIsAuthenticating(false));
  }
}

export function* signOut(service: any, _: any) {
  try {
    yield call(service.SignOut);
    yield put(AuthActions.setAuthError(null));
    yield put(AuthActions.setUser(null));
    yield put(AuthActions.setToken(null));
    yield put(StorageActions.setDocuments(null));
    yield put(StorageActions.setImages(null));
  } catch (ex) {
    displayInfo({
      name: 'AuthSaga',
      preview: 'signOutSaga_Exception',
      value: {ex, message: ex.message},
    });
  }
}

export function* forgotPassword(service: any, payload: any) {
  yield put(AuthActions.setIsAuthenticating(true));
  yield put(AuthActions.setAuthError(null));
  try {
    yield call(service.SendPasswordResetEmail, payload.email);
    yield put(
      StatusMsgActions.setStatus(
        'SUCC',
        `Password reset link has been sent to ${payload.email}`,
        'success',
      ),
    );
    yield put(AuthActions.setIsAuthenticating(false));
  } catch (ex) {
    displayInfo({
      name: 'AuthSaga',
      preview: 'ForgotPassword_Exception',
      value: {ex, message: ex.message},
    });
    if (!ex) {
      yield put(AuthActions.setUser(null));
      yield put(AuthActions.setToken(null));
    }
    if (isAuthError(ex)) {
      yield put(AuthActions.setAuthError({code: ex.code, message: ex.message}));
      yield put(StatusMsgActions.setError(ex.code, ex.message));
    }
    yield put(AuthActions.setIsAuthenticating(false));
  }
}

export function* updateUser(api: any, payload: any) {
  try {
    displayInfo({name: 'AuthSaga', preview: 'updateUser', value: payload});
    yield put(AuthActions.setIsSaving(true));
    yield put(AuthActions.setAuthSaveStatus(SaveStatusEnum.None));
    const tokenStr = yield call(api.GetAuthToken);
    const response = yield call(api.UpdateUser, payload.data, tokenStr);
    displayInfo({
      name: 'AuthSaga',
      preview: 'onResponse',
      value: {userResponse: response},
    });
    if (
      !isEmpty(response) &&
      !isEmpty(response.updateUser) &&
      response.updateUser.isSuccess
    ) {
      const currentUser = yield select(Selectors.currentUser);
      const respUserData = response.updateUser.data;
      const updatedUser = {
        ...currentUser,
        displayName:
          respUserData && respUserData.DisplayName
            ? respUserData.DisplayName
            : currentUser.displayName,
        email:
          respUserData && respUserData.Email
            ? respUserData.Email
            : currentUser.email,
      } as FirebaseAuthTypes.User;
      yield put(AuthActions.setUser(updatedUser));
      yield put(AuthActions.setAuthSaveStatus(SaveStatusEnum.Success));
    } else {
      yield put(AuthActions.setAuthSaveStatus(SaveStatusEnum.Failure));
    }
    yield put(AuthActions.setIsSaving(false));
  } catch (ex) {
    yield call(checkIfUnauthorized, api, {ex});
    displayInfo({
      name: 'AuthSaga',
      preview: 'updateUser_Exception',
      value: {ex, message: ex.message},
    });
    yield put(AuthActions.setIsSaving(false));
  }
}

export function* watchAuthState(__: any, _: any) {
  try {
    yield put(AuthActions.setAuthError(null));
    auth().onAuthStateChanged(async (user: any) => {
      displayInfo({
        name: 'FirebaseAuthService',
        preview: 'watchAuthState',
        value: {user},
      });
      if (user) {
        authChannel.put(AuthActions.setUser(TransformFireUserToIUser(user)));
        const token = await user.getIdToken();
        if (token) {
          authChannel.put(AuthActions.setToken(token));
        } else {
          authChannel.put(AuthActions.setToken(null));
          authChannel.put(
            AuthActions.setAuthError({code: 403, message: 'Unauthorized'}),
          );
        }
      } else {
        authChannel.put(AuthActions.setToken(null));
        authChannel.put(
          AuthActions.setAuthError({code: 403, message: 'Unauthorized'}),
        );
      }
    });
  } catch (ex) {
    displayInfo({
      name: 'AuthSaga',
      preview: 'checkAuthStateSaga_Exception',
      value: {ex, message: ex && ex.message},
    });
    if (isAuthError(ex)) {
      yield put(AuthActions.setAuthError({code: ex.code, message: ex.message}));
    }
    yield put(AuthActions.setIsAuthenticating(false));
    return null;
  }
}

export function* watchAuthChannel() {
  while (true) {
    const action = yield take(authChannel);
    yield put(action);
  }
}
