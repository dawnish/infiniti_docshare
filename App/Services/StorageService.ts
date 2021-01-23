import storage, {FirebaseStorageTypes} from '@react-native-firebase/storage';
import {IFileMeta} from '../Interfaces';
import {displayInfo} from './LogService';
import RNFetchBlob from 'react-native-fetch-blob';

function listFilesAndDirectories(
  reference: FirebaseStorageTypes.Reference,
  pageToken?: string,
  referenceList: Array<FirebaseStorageTypes.Reference> = [],
): Promise<Array<FirebaseStorageTypes.Reference>> {
  return reference.list({pageToken}).then((result) => {
    // Loop over each item
    referenceList.push(...result.items);
    displayInfo({
      name: 'StorageService',
      preview: 'listFilesAndDirectories',
      value: {result, pageToken, referenceList},
    });

    if (result.nextPageToken) {
      return listFilesAndDirectories(
        reference,
        result.nextPageToken,
        referenceList,
      );
    }

    return Promise.resolve(referenceList);
  });
}

export const GetFiles = async (
  userUid: string,
  type: string,
): Promise<Array<Promise<IFileMeta>>> => {
  const reference = storage().ref(`/user/${userUid}/${type}`);
  const refList = listFilesAndDirectories(reference);
  displayInfo({
    name: 'StorageService',
    preview: 'GetFiles',
    value: {userUid, reference, type},
  });
  return (await refList).map(async (ref) => {
    const fileUrl = await ref.getDownloadURL();
    const metadata = await ref.getMetadata();
    return {
      DownloadUrl: fileUrl,
      FileName: ref.name,
      Path: ref.fullPath,
      Timestamp: metadata.timeCreated,
      Size: `${Math.round(metadata.size / 1024)} kb`,
    } as IFileMeta;
  });
};

const getPathForFirebaseStorage = async (uri: string) => {
  const stat = await RNFetchBlob.fs.stat(uri);
  return stat.path;
};

export const UploadFile = async (
  file: string,
  name: string,
  userUid: string,
  type: string,
) => {
  const pathToFile = `/user/${userUid}/${type}/${name}`;
  const reference = storage().ref(pathToFile);
  const fileUri = await getPathForFirebaseStorage(file);
  return reference.putFile(fileUri).then(async () => {
    displayInfo({
      name: 'StorageService',
      preview: 'UploadFile',
      value: {file, fileUri, pathToFile, name, reference},
    });
    const metadata = await reference.getMetadata();
    const fileUrl = await reference.getDownloadURL();
    return {
      DownloadUrl: fileUrl,
      FileName: name,
      Path: reference.fullPath,
      Timestamp: metadata.timeCreated,
      Size: `${metadata.size / 1024} kb`,
    } as IFileMeta;
  });
};

export const DeleteFile = (
  name: string,
  userUid: string,
  type: string,
): Promise<boolean> => {
  try {
    const pathToFile = `/user/${userUid}/${type}/${name}`;
    const reference = storage().ref(pathToFile);
    return reference
      .delete()
      .then(() => Promise.resolve(true))
      .catch(() => Promise.reject(false));
  } catch (ex) {
    return Promise.reject(false);
  }
};
