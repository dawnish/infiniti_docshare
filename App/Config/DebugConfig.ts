import BuildConfig from 'react-native-config';

export default {
  codepushStaging: false,
  getAPI: false, // should app hit API server for data? (Turn off if we're using codepush)
  hotwireDate: BuildConfig.IS_DEBUG, // force today to be the day of the conf
  hotwirePush: BuildConfig.IS_DEBUG, // force push notifications to happen in 5 seconds
  includeExamples: BuildConfig.IS_DEBUG,
  showDevScreens: BuildConfig.IS_DEBUG,
  useFixtures: false,
  useReactotron: BuildConfig.IS_DEBUG,
  yellowBox: BuildConfig.IS_DEBUG,
};
