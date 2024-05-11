import Step1 from './step1';
import Step2 from './step2';
import * as RootNavigation from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';

const handleSetValue = (value: any, index?: number) => {
  RootNavigation.navigate(SCREEN_NAME.ADD_CERTIFICATE_STEP_2, {
    index: index,
    item: value,
  });
};

export {Step1, Step2, handleSetValue};
