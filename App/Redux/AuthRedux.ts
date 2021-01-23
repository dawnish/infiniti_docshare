import {createActions, createReducer} from 'reduxsauce';
import Immutable from 'seamless-immutable';
import {IAuthError, IUser} from '../Interfaces';
import {SaveStatusEnum, SaveStatusType} from '../Literals';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  checkAuthState: null,
  checkIfUnauthorized: ['ex'],
  confirmPhoneNumber: ['otpVerifier', 'code'],
  forgotPassword: ['email'],
  getUserToken: null,
  setAuthError: ['authError'],
  setAuthSaveStatus: ['authSaveStatus'],
  setIsAuthenticating: ['isAuthenticating'],
  setIsSaving: ['isSaving'],
  setToken: ['token'],
  setUser: ['user'],
  signInEmail: ['email', 'password'],
  signUpEmail: ['email', 'password'],
  signOut: null,
  updateMessageToken: ['messageToken'],
  updateUser: ['data'],
  watchAuthState: null,
});

export const AuthReduxTypes = Types;
export default Creators;

export interface IAuthReduxState {
  authError: IAuthError | null;
  isAuthenticating: boolean;
  isSaving: boolean;
  authSaveStatus: SaveStatusType;
  token: string | null;
  user: IUser | null;
}

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
  authError: null,
  authSaveStatus: SaveStatusEnum.None,
  isAuthenticating: false,
  isSaving: false,
  token: null,
  user: null,
} as IAuthReduxState);

/* ------------- Reducers ------------- */
export const setAuthError = (
  state: Immutable.Immutable<IAuthReduxState>,
  {authError}: {authError: IAuthError | null},
) => state.merge({authError});
export const setIsAuthenticating = (
  state: Immutable.Immutable<IAuthReduxState>,
  {isAuthenticating}: {isAuthenticating: boolean},
) => state.merge({isAuthenticating});

export const setIsSaving = (
  state: Immutable.Immutable<IAuthReduxState>,
  {isSaving}: {isSaving: boolean},
) => state.merge({isSaving});

export const setAuthSaveStatus = (
  state: Immutable.Immutable<IAuthReduxState>,
  {authSaveStatus}: {authSaveStatus: SaveStatusType},
) => state.merge({authSaveStatus});

export const setToken = (
  state: Immutable.Immutable<IAuthReduxState>,
  {token}: {token: string},
) => state.merge({token});

export const setUser = (
  state: Immutable.Immutable<IAuthReduxState>,
  {user}: {user: IUser},
) => state.merge({user});

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_AUTH_ERROR]: setAuthError,
  [Types.SET_IS_AUTHENTICATING]: setIsAuthenticating,
  [Types.SET_IS_SAVING]: setIsSaving,
  [Types.SET_AUTH_SAVE_STATUS]: setAuthSaveStatus,
  [Types.SET_TOKEN]: setToken,
  [Types.SET_USER]: setUser,
});
