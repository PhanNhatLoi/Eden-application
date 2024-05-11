import * as React from 'react';
import {Alert} from 'react-native';
import * as RootNavigation from 'src/navigations/root-navigator';
import {FARM} from 'src/api/farm/type.d';
import {clearFarmFlow, saveFarmFlow} from 'src/state/reducers/farm/farmSlice';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Step4 from './step4';
import Step5 from './step5';
import Step6 from './step6';
import Step7 from './step7';
import Step8 from './step8';
import Step9 from './step9';
import Step10 from './step10';
import Step11 from './step11';
// import Step12 from './step12';
import {store} from 'src/state/store';
import {SCREEN_NAME} from 'src/navigations/screen-name';

const saveValue = (newValue: any, step: number) => {
  const value = store.getState().farmReducer.farmBody;
  const farmBody: FARM.Request.Farm = {...value, ...newValue};
  store.dispatch(saveFarmFlow({farmBody: farmBody, step: step || 0}));
  RootNavigation.navigate('ADD_FARM_STEP_' + (step + 1));
};

const UpdateValue = (newValue: any) => {
  const value = store.getState().farmReducer.farmBody;
  const farmBody: FARM.Request.Farm = {...value, ...newValue};
  store.dispatch(saveFarmFlow({farmBody: farmBody, step: 0}));
  RootNavigation.goBack();
};

const alertPopup = (
  type: 'CREATE' | 'UPDATE',
  newValue: any,
  dirty: boolean,
  step: number,
  t: any,
) => {
  if (type === 'CREATE') {
    if (dirty) {
      Alert.alert(
        t('leave_create_farm'),
        t('mess_leave_create_farm').toString(),
        [
          {
            text: t('save').toString(),
            onPress: () => {
              const value = store.getState().farmReducer.farmBody;
              const farmBody: FARM.Request.Farm = {...value, ...newValue};
              saveValue(farmBody, step);
              RootNavigation.navigate(SCREEN_NAME.FARM);
            },
            style: t('default'),
          },
          {
            text: t('dont_save').toString(),
            onPress: () => {
              store.dispatch(clearFarmFlow());
              RootNavigation.navigate(SCREEN_NAME.FARM);
            },
            style: 'default',
          },
          {
            text: t('cancel').toString(),
            onPress: () => {},
            style: 'destructive',
          },
        ],
      );
    } else {
      store.dispatch(clearFarmFlow());
      RootNavigation.navigate(SCREEN_NAME.FARM);
    }
  } else {
    Alert.alert(t('leave_create_farm'), t('confirm_cancel').toString(), [
      {
        text: t('confirm').toString(),
        onPress: () => {
          RootNavigation.navigate(SCREEN_NAME.FARM);
        },
        style: 'default',
      },
      {
        text: t('cancel').toString(),
        onPress: () => {},
        style: 'destructive',
      },
    ]);
  }
};

export {
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
  saveValue,
  alertPopup,
  UpdateValue,
};
