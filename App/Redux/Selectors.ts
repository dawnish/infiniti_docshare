import {IReducers} from '.';

export const currentUser = (state: IReducers) => state.auth.user;

export const documents = (state: IReducers) => state.storage.documents;

export const images = (state: IReducers) => state.storage.images;
