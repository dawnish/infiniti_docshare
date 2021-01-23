import {groupBy, merge, prop} from 'ramda';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {IUser} from '../Interfaces';

interface ICommon {
  [x: string]: any;
  Uid: string;
}
export const MergeList = <T extends ICommon>(newList: T[]) => (
  existingData: T,
) => {
  if (existingData.Uid && newList.every((item: T) => item.Uid)) {
    const grpedItems = grpItemsById(newList);
    const newData = grpedItems[existingData.Uid]
      ? grpedItems[existingData.Uid][0]
      : ({} as T);
    const mergedItem = merge(existingData, newData);
    return mergedItem;
  }
  return existingData;
};

const grpItemsById = <T extends ICommon>(newData: T[]) =>
  groupBy<T>(prop('Uid'), newData);

export function TransformFireUserToIUser(src: FirebaseAuthTypes.User): IUser {
  return {
    displayName: src.displayName,
    email: src.email,
    emailVerified: src.emailVerified,
    isAnonymous: src.isAnonymous,
    metadata: src.metadata,
    phoneNumber: src.phoneNumber,
    photoURL: src.photoURL,
    providerData: src.providerData,
    providerId: src.providerId,
    title: src.displayName
      ? src.displayName.slice(0, 1)
      : src.email
      ? src.email.slice(0, 1)
      : '',
    uid: src.uid,
  };
}

export function unicodeToChar(text: string) {
  return text.replace(/\\u[\dA-F]{4}/gi, (match) => {
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
  });
}
