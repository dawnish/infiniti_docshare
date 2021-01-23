import {isEmpty} from 'validate.js';
import {IAuthError} from '../Interfaces';

export function isAuthError(obj: any | undefined): obj is IAuthError {
  return !isEmpty(obj) && !isEmpty(obj.code) && !isEmpty(obj.message);
}
