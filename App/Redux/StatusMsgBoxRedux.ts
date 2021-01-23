import {createActions, createReducer} from 'reduxsauce';
import Immutable from 'seamless-immutable';
import {VariantType} from '../Literals';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  clearStatus: null,
  setError: ['statusCode', 'statusMessage'],
  setStatus: ['statusCode', 'statusMessage', 'variant'],
});

export const StatusMsgBoxReduxTypes = Types;
export default Creators;

export interface IStatusMsgBoxReduxState {
  statusCode: string | null;
  statusMessage: string | null;
  variant: VariantType | null;
}

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
  statusCode: null,
  statusMessage: null,
  variant: null,
});

/* ------------- Reducers ------------- */
export const clearStatus = (
  state: Immutable.ImmutableObject<IStatusMsgBoxReduxState>,
) => state.merge({statusCode: null, statusMessage: null, variant: null});

export const setError = (
  state: Immutable.ImmutableObject<IStatusMsgBoxReduxState>,
  {statusCode, statusMessage}: {statusCode: string; statusMessage: string},
) => state.merge({statusCode, statusMessage, variant: 'error'});

export const setStatus = (
  state: Immutable.ImmutableObject<IStatusMsgBoxReduxState>,
  {
    statusCode,
    statusMessage,
    variant,
  }: {
    statusCode: string;
    statusMessage: string;
    variant: VariantType;
  },
) => state.merge({statusCode, statusMessage, variant});

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer<
  Immutable.ImmutableObject<IStatusMsgBoxReduxState>,
  any
>(INITIAL_STATE, {
  [Types.CLEAR_STATUS as string]: clearStatus,
  [Types.SET_ERROR as string]: setError,
  [Types.SET_STATUS as string]: setStatus,
});
