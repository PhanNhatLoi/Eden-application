// In App.js in a new project

import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREEN_NAME} from './screen-name';
import {
  Login,
  Register,
  FogotPassword,
  TermsOfService,
  Policy,
} from 'src/scenes';
import CompeletedScreen from 'src/scenes/orther/compeletedScreen';

const Stack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={SCREEN_NAME.LOGIN}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={SCREEN_NAME.LOGIN} component={Login} />
      <Stack.Screen
        options={{gestureEnabled: false}}
        name={SCREEN_NAME.REGISTER}
        component={Register}
      />
      <Stack.Screen
        name={SCREEN_NAME.FOGOT_PASSWORD}
        component={FogotPassword}
      />
      <Stack.Screen
        name={SCREEN_NAME.COMPELETED}
        component={CompeletedScreen}
      />
      <Stack.Screen
        name={SCREEN_NAME.TERMS_OF_SERVICE}
        component={TermsOfService}
      />
      <Stack.Screen name={SCREEN_NAME.POLICY} component={Policy} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
