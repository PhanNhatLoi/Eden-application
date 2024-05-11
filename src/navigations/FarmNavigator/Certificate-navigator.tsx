// In App.js in a new project

import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREEN_NAME} from '../screen-name';
import {Step1, Step2} from 'src/scenes/farm/addStandardCertificate';
import {RouteProp} from '@react-navigation/native';
import {FARM} from 'src/api/farm/type.d';

const Stack = createNativeStackNavigator();

type Props = {
  route?: RouteProp<{
    params: {
      step: number;
      item: FARM.Request.Cetification;
      index: number;
      type: 'UPDATE' | 'ADD';
    };
  }>;
};
function CertificateNavigator(props: Props) {
  let defaultStep =
    props.route?.params?.step === 1
      ? SCREEN_NAME.ADD_CERTIFICATE_STEP_2
      : SCREEN_NAME.ADD_CERTIFICATE_STEP_1;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName={defaultStep}>
      <Stack.Screen
        name={SCREEN_NAME.ADD_CERTIFICATE_STEP_1}
        component={Step1}
        initialParams={{
          ...props.route?.params,
        }}
      />
      <Stack.Screen
        name={SCREEN_NAME.ADD_CERTIFICATE_STEP_2}
        component={Step2}
        initialParams={{
          ...props.route?.params,
        }}
      />
    </Stack.Navigator>
  );
}

export default CertificateNavigator;
