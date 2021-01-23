import AsyncStorage from '@react-native-community/async-storage';
import {persistStore} from 'redux-persist';
import DebugConfig from '../Config/DebugConfig';
import ReduxPersist from '../Config/ReduxPersist';
import {displayInfo} from './LogService';
// import StartupActions from '../Redux/StartupRedux'

const updateReducers = (store: any) => {
  const reducerVersion = ReduxPersist.reducerVersion;
  // const startup = () => store.dispatch(StartupActions.startup())

  // Check to ensure latest reducer version
  AsyncStorage.getItem('reducerVersion')
    .then((localVersion) => {
      if (localVersion !== reducerVersion) {
        if (DebugConfig.useReactotron) {
          displayInfo({
            important: true,
            name: 'PURGE',
            preview: 'Reducer Version Change Detected',
            value: {
              'New Version:': reducerVersion,
              'Old Version:': localVersion,
            },
          });
        }
        // Purge store
        persistStore(store, undefined).purge();
        AsyncStorage.setItem('reducerVersion', reducerVersion);
      } else {
        persistStore(store, undefined);
      }
    })
    .catch(() => {
      persistStore(store, undefined);
      AsyncStorage.setItem('reducerVersion', reducerVersion);
    });
};

export default {updateReducers};
