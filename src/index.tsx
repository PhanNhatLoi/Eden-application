/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef} from 'react';
import 'src/i18n/i18n.config';
import {Provider} from 'react-redux';
import ContainNavigator from './navigations';
import FCMlisteners from './fcm/FCMlisteners';
import {persistor, store} from 'src/state/store';
import {PersistGate} from 'redux-persist/integration/react';
import {backgroundMessageHandler} from './fcm/FCMlisteners';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {CustomAlert} from './components/organisms';
import InternetInfo from './help/internetInfor';
import CheckPermissionAndVerSion from './help/permission';
backgroundMessageHandler();

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{flex: 1}}>
          <ContainNavigator />
          <InternetInfo />
          <FCMlisteners />
          <CheckPermissionAndVerSion />
          <CustomAlert />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}

export default App;
