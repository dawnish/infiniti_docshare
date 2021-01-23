import {createActions, createReducer} from 'reduxsauce';
import Immutable from 'seamless-immutable';
import {IFileMeta} from '../Interfaces';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  getFiles: ['fileType'],
  deleteFile: ['name', 'fileType'],
  uploadFile: ['file', 'name', 'fileType'],
  setDocuments: ['documents'],
  setImages: ['images'],
  setIsDownloading: ['isDownloading'],
  setIsUploading: ['isUploading'],
});

export const StorageReduxTypes = Types;
export default Creators;

export interface IStorageReduxState {
  documents: IFileMeta[] | null;
  images: IFileMeta[] | null;
  isDownloading: boolean;
  isUploading: boolean;
}

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
  documents: null,
  images: null,
  isDownloading: false,
  isUploading: false,
});

/* ------------- Reducers ------------- */

export const setDocuments = (
  state: Immutable.ImmutableObject<IStorageReduxState>,
  {documents}: {documents: IFileMeta[]},
) => state.merge({documents});

export const setImages = (
  state: Immutable.ImmutableObject<IStorageReduxState>,
  {images}: {images: IFileMeta[]},
) => state.merge({images});

export const setIsDownloading = (
  state: Immutable.ImmutableObject<IStorageReduxState>,
  {isDownloading}: {isDownloading: boolean},
) => state.merge({isDownloading});

export const setIsUploading = (
  state: Immutable.ImmutableObject<IStorageReduxState>,
  {isUploading}: {isUploading: boolean},
) => state.merge({isUploading});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_DOCUMENTS]: setDocuments,
  [Types.SET_IMAGES]: setImages,
  [Types.SET_IS_DOWNLOADING]: setIsDownloading,
  [Types.SET_IS_UPLOADING]: setIsUploading,
});
