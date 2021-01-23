import {NetInfoState} from '@react-native-community/netinfo';
import {createActions, createReducer} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  fetchIsConnected: null,
  setConnectionState: ['connectionState'],
  setIsConnected: ['isConnected'],
});

export const ConnectivityReduxTypes = Types;
export default Creators;

export interface IConnectivityReduxState {
  connectionState: NetInfoState | null;
  isConnected: boolean;
}

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
  connectionState: null,
  isConnected: false,
});

/* ------------- Reducers ------------- */

export const setConnectionState = (
  state: Immutable.ImmutableObject<IConnectivityReduxState>,
  {connectionState}: {connectionState: NetInfoState},
) => state.merge({connectionState});

export const setIsConnected = (
  state: Immutable.ImmutableObject<IConnectivityReduxState>,
  {isConnected}: {isConnected: boolean},
) => state.merge({isConnected});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_CONNECTION_STATE]: setConnectionState,
  [Types.SET_IS_CONNECTED]: setIsConnected,
});
