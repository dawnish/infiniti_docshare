import {call, put, select} from 'redux-saga/effects';
import {displayInfo, errorLog} from '../Services/LogService';
import StatusMsgBoxActions from '../Redux/StatusMsgBoxRedux';
import StorageActions from '../Redux/StorageRedux';
import * as Selectors from '../Redux/Selectors';
import {isArray, isEmpty} from 'validate.js';
import {IFileMeta} from '../Interfaces';
import {FileTypeEnum} from '../Literals/Enums';

export function* getFiles(service: any, payload: any) {
  try {
    yield put(StorageActions.setIsDownloading(true));
    const currentUser = yield select(Selectors.currentUser);
    if (currentUser) {
      const response: Promise<IFileMeta>[] | null = yield call(
        service.GetFiles,
        currentUser.uid,
        payload.fileType || 'images',
      );
      if (response && isArray(response) && !isEmpty(response)) {
        const fileData = yield Promise.all(response);
        displayInfo({
          name: 'StorageSaga',
          preview: 'getFiles',
          value: {response, fileData, type: payload.fileType},
        });
        if (payload.fileType === FileTypeEnum.Documents) {
          yield put(StorageActions.setDocuments(fileData));
        } else {
          yield put(StorageActions.setImages(fileData));
        }
      } else {
        displayInfo({
          name: 'StorageSaga',
          preview: 'getFiles',
          value: {response: 'Unknown issue while trying to retrieve documents'},
        });
        yield put(
          StatusMsgBoxActions.setStatus(
            'ERR',
            `No ${payload.fileType} available to download`,
            'info',
          ),
        );
      }
      yield put(StorageActions.setIsDownloading(false));
    }
    yield put(StorageActions.setIsDownloading(false));
  } catch (ex) {
    yield put(StorageActions.setIsDownloading(false));
    displayInfo({
      name: 'StorageSaga',
      preview: 'getImages_Exception',
      value: {ex, message: ex.message},
    });
  }
}

export function* uploadFile(service: any, payload: any) {
  try {
    yield put(StorageActions.setIsUploading(true));
    const currentUser = yield select(Selectors.currentUser);
    if (currentUser) {
      const response = yield call(
        service.UploadFile,
        payload.file,
        payload.name,
        currentUser.uid,
        payload.fileType,
      );
      if (response) {
        let data: IFileMeta[] = yield select(
          payload.fileType === FileTypeEnum.Documents
            ? Selectors.documents
            : Selectors.images,
        ) || [];
        data = [...(data || []), response];
        if (payload.fileType === FileTypeEnum.Documents) {
          yield put(StorageActions.setDocuments(data));
        } else {
          yield put(StorageActions.setImages(data));
        }
        yield put(StorageActions.setIsUploading(false));
        yield put(
          StatusMsgBoxActions.setStatus(
            'SUCC',
            'Successfully uploaded the document',
            'success',
          ),
        );
      } else {
        errorLog(
          {
            method: 'uploadFile',
            class: 'StorageSaga',
          },
          {
            type: payload.fileType,
            value: 'Unknown issue while trying to upload documents',
          },
        );
        yield put(
          StatusMsgBoxActions.setError(
            'ERR',
            'Unknown issue while trying to upload document',
          ),
        );
      }
    }
  } catch (ex) {
    yield put(StorageActions.setIsUploading(false));
    displayInfo({
      name: 'StorageSaga',
      preview: 'uploadFile_Exception',
      value: {ex, message: ex.message},
    });
    yield put(
      StatusMsgBoxActions.setError(
        'ERR',
        'Technical issue while uploading file. Please try uploading another local file',
      ),
    );
  }
}

export function* deleteFile(service: any, payload: any) {
  try {
    yield put(StorageActions.setIsUploading(true));
    const currentUser = yield select(Selectors.currentUser);
    if (currentUser) {
      const response = yield call(
        service.DeleteFile,
        payload.name,
        currentUser.uid,
        payload.fileType,
      );
      if (response) {
        let data: IFileMeta[] = yield select(
          payload.fileType === FileTypeEnum.Documents
            ? Selectors.documents
            : Selectors.images,
        ) || [];
        data = (data || []).filter((d) => d.FileName !== payload.name);
        if (payload.fileType === FileTypeEnum.Documents) {
          yield put(StorageActions.setDocuments(data));
        } else {
          yield put(StorageActions.setImages(data));
        }
        yield put(StorageActions.setIsUploading(false));
        yield put(
          StatusMsgBoxActions.setStatus(
            'SUCC',
            'File deleted successfully',
            'success',
          ),
        );
      } else {
        errorLog(
          {
            method: 'deleteFile',
            class: 'StorageSaga',
          },
          {
            type: payload.fileType,
            value: 'Unknown issue while trying to delete document',
          },
        );
        yield put(
          StatusMsgBoxActions.setError(
            'ERR',
            'Unknown issue while trying to delete file',
          ),
        );
      }
    }
  } catch (ex) {
    yield put(StorageActions.setIsUploading(false));
    displayInfo({
      name: 'StorageSaga',
      preview: 'uploadFile_Exception',
      value: {ex, message: ex.message},
    });
  }
}
