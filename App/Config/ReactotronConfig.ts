import {NativeModules} from 'react-native';
import BuildConfig from 'react-native-config';
import Reactotron from 'reactotron-react-native';
import {reactotronRedux as reduxPlugin} from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';
import Immutable from 'seamless-immutable';

if (BuildConfig.IS_DEBUG && BuildConfig.IS_DEBUG === 'true') {
  const scriptURL = NativeModules.SourceCode.scriptURL;
  const scriptHostname = scriptURL.split('://')[1].split(':')[0];

  // https://github.com/infinitered/reactotron for more options!
  Reactotron.configure({name: 'DocShare', host: scriptHostname})
    .useReactNative()
    .use(reduxPlugin({onRestore: Immutable}))
    // register the redux-saga plugin so we can use the monitor in CreateStore.js
    .use(sagaPlugin({}));

  // let's connect!
  Reactotron.connect();

  // Let's clear Reactotron on every time we load the app
  Reactotron.clear && Reactotron.clear();

  // Totally hacky, but this allows you to not both importing reactotron-react-native
  // on every file.  This is just DEV mode, so no big deal.
}

(console as any).tron = Reactotron;

export default Reactotron;
