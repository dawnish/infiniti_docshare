import AsyncStorage from '@react-native-community/async-storage';
import immutablePersistenceReconciler from '../Services/ImmutablePersistenceReconciler';
import immutablePersistenceTransform from '../Services/ImmutablePersistenceTransform';

// More info here:  https://shift.infinite.red/shipping-persistant-reducers-7341691232b1
const REDUX_PERSIST = {
  active: true,
  reducerVersion: '1.0.0',
  storeConfig: {
    debug: false,
    key: 'root',
    stateReconciler: immutablePersistenceReconciler,
    storage: AsyncStorage,
    // blacklist: ['nav'], // reducer keys that you do NOT want stored to persistence here
    transforms: [immutablePersistenceTransform],
    whitelist: ['storage'], // Optionally, just specify the keys you DO want stored to
    // persistence. An empty array means 'don't store any reducers' -> infinitered/ignite#409
  },
};

export default REDUX_PERSIST;
