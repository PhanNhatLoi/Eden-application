// In App.js in a new project

import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREEN_NAME} from '../screen-name';
import {Step1} from 'src/scenes/farm/addFarm';
import {RouteProp} from '@react-navigation/native';

const Stack = createNativeStackNavigator();

type Props = {
  route?: RouteProp<{
    params: {step: number};
  }>;
};
function FarmNavigator(props: Props) {
  let defaultStep = SCREEN_NAME.ADD_SEASON_STEP_1;
  switch (props.route?.params.step) {
    case 1:
      defaultStep = SCREEN_NAME.ADD_SEASON_STEP_2;
      break;
    case 2:
      defaultStep = SCREEN_NAME.ADD_FARM_STEP_3;
      break;
    case 3:
      defaultStep = SCREEN_NAME.ADD_FARM_STEP_4;
      break;
    case 4:
      defaultStep = SCREEN_NAME.ADD_FARM_STEP_5;
      break;
    case 5:
      defaultStep = SCREEN_NAME.ADD_FARM_STEP_6;
      break;
    case 6:
      defaultStep = SCREEN_NAME.ADD_FARM_STEP_7;
      break;
    case 7:
      defaultStep = SCREEN_NAME.ADD_FARM_STEP_8;
      break;
    default:
      break;
  }
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, gestureEnabled: false}}
      initialRouteName={defaultStep}>
      <Stack.Screen name={SCREEN_NAME.ADD_FARM_STEP_1} component={Step1} />
    </Stack.Navigator>
  );
}

export default FarmNavigator;
