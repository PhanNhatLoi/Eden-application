// In App.js in a new project

import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREEN_NAME} from '../screen-name';
import {Step1, Step2, Step3} from 'src/scenes/farm/addLandCertificate';
import {RouteProp} from '@react-navigation/native';
import {FARM} from 'src/api/farm/type.d';

const Stack = createNativeStackNavigator();

type Props = {
  route?: RouteProp<{
    params: {
      step: number;
      item: FARM.Request.LandCetification;
      index: number;
    };
  }>;
};
function LandCertificateNavigator(props: Props) {
  let defaultStep = SCREEN_NAME.ADD_LAND_CERTIFICATE_STEP_1;
  switch (props.route?.params?.step) {
    case 1:
      defaultStep = SCREEN_NAME.ADD_LAND_CERTIFICATE_STEP_2;
      break;
    case 2:
      defaultStep = SCREEN_NAME.ADD_LAND_CERTIFICATE_STEP_3;
      break;
    default:
      break;
  }
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName={defaultStep}>
      <Stack.Screen
        name={SCREEN_NAME.ADD_LAND_CERTIFICATE_STEP_1}
        component={Step1}
        initialParams={{
          ...props.route?.params,
        }}
      />
      <Stack.Screen
        name={SCREEN_NAME.ADD_LAND_CERTIFICATE_STEP_2}
        component={Step2}
        initialParams={{
          ...props.route?.params,
        }}
      />
      <Stack.Screen
        name={SCREEN_NAME.ADD_LAND_CERTIFICATE_STEP_3}
        component={Step3}
        initialParams={{
          ...props.route?.params,
        }}
      />
    </Stack.Navigator>
  );
}

export default LandCertificateNavigator;
