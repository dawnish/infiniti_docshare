import auth from '@react-native-firebase/auth';
import {isEmpty} from 'validate.js';
import {displayInfo} from './LogService';

export const CheckAuthState = () => {
  return new Promise((resolve, reject) => {
    auth().onAuthStateChanged((user: any) => {
      displayInfo({
        name: 'FirebaseAuthService',
        preview: 'CheckAuthState',
        value: {user},
      });
      if (user) {
        resolve(user);
      } else {
        reject({message: 'Unexpected error during check auth state'});
      }
    });
  });
};

export const CheckIfUnauthorized = async (ex: any): Promise<boolean> => {
  if (!isEmpty(ex) && !isEmpty(ex.response)) {
    if (ex.response.status === '403') {
      return true;
    }
  } else {
    const tokenStr = await GetAuthToken();
    if (isEmpty(tokenStr)) {
      return true;
    }
  }
  return false;
};

export const GetAuthToken = (): Promise<string | null> => {
  const currentUser = auth().currentUser;
  if (currentUser && !isEmpty(currentUser)) {
    return currentUser.getIdToken(true);
  } else {
    return Promise.resolve(null);
  }
};

export const SendPasswordResetEmail = (email: string): Promise<void> => {
  return auth().sendPasswordResetEmail(email);
};

export const SignUpUserEmail = (email: string, password: string) => {
  return auth().createUserWithEmailAndPassword(email, password);
};

export const SignInWithEmailAndPassword = (email: string, password: string) => {
  return auth().signInWithEmailAndPassword(email, password);
};

export const SignInWithPhoneNumber = (phoneNumber: string) => {
  return auth().signInWithPhoneNumber(phoneNumber);
};

export const SignOut = () => {
  return auth().signOut();
};
