// In App.js in a new project

import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREEN_NAME} from '../screen-name';
import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  Step7,
  Step8,
  Step9,
  Step10,
  Step11,
  // Step12,
} from 'src/scenes/farm/addFarm';
import {RouteProp} from '@react-navigation/native';

const Stack = createNativeStackNavigator();

type Props = {
  route?: RouteProp<{
    params: {step: number};
  }>;
};
function FarmNavigator(props: Props) {
  let defaultStep = SCREEN_NAME.ADD_FARM_STEP_1;
  switch (props.route?.params.step) {
    case 1:
      defaultStep = SCREEN_NAME.ADD_FARM_STEP_2;
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
    case 8:
      defaultStep = SCREEN_NAME.ADD_FARM_STEP_9;
      break;
    case 9:
      defaultStep = SCREEN_NAME.ADD_FARM_STEP_10;
      break;
    case 10:
      defaultStep = SCREEN_NAME.ADD_FARM_STEP_11;
      break;
    // case 11:
    //   defaultStep = SCREEN_NAME.ADD_FARM_STEP_12;
    //   break;
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
      <Stack.Screen name={SCREEN_NAME.ADD_FARM_STEP_1} component={Step1} />
      <Stack.Screen name={SCREEN_NAME.ADD_FARM_STEP_2} component={Step2} />
      <Stack.Screen name={SCREEN_NAME.ADD_FARM_STEP_3} component={Step3} />
      <Stack.Screen name={SCREEN_NAME.ADD_FARM_STEP_4} component={Step4} />
      <Stack.Screen name={SCREEN_NAME.ADD_FARM_STEP_5} component={Step5} />
      <Stack.Screen name={SCREEN_NAME.ADD_FARM_STEP_6} component={Step6} />
      <Stack.Screen name={SCREEN_NAME.ADD_FARM_STEP_7} component={Step7} />
      <Stack.Screen name={SCREEN_NAME.ADD_FARM_STEP_8} component={Step8} />
      <Stack.Screen name={SCREEN_NAME.ADD_FARM_STEP_9} component={Step9} />
      <Stack.Screen name={SCREEN_NAME.ADD_FARM_STEP_10} component={Step10} />

      <Stack.Screen
        options={{gestureEnabled: false}}
        name={SCREEN_NAME.ADD_FARM_STEP_11}
        component={Step11}
      />
      {/* <Stack.Screen name={SCREEN_NAME.ADD_FARM_STEP_12} component={Step12} /> */}
    </Stack.Navigator>
  );
}

export default FarmNavigator;
