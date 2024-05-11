import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import * as RootNavigation from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
const handleSetValue = (
  value: any,
  screenName: keyof typeof SCREEN_NAME,
  index?: number,
) => {
  RootNavigation.navigate(screenName, {
    index: index,
    item: value,
  });
};

export {Step1, Step2, Step3, handleSetValue};
