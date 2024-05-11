import * as React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Colors} from 'src/styles';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {StepWrapperL} from 'src/components/organisms';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Step5 from './step5';
import Step6 from './step6';
import Step7 from './step7';
import StatusUpdate from './status';
import {RootState} from 'src/state/store';
import {useDispatch} from 'react-redux';
import {
  createCrops,
  pushValueSeasonCreate,
  resetData,
} from 'src/state/reducers/season/seasonSlice';
import {SEASON} from 'src/api/season/type.d';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {createOrUpdateSeason} from 'src/api/season/actions';
import * as RootNavigator from 'src/navigations/root-navigator';

type AddSeaSonProps = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<{
    params: {data?: SEASON.Request.Season; step?: number};
  }>;
};

const AddSeaSon = (props: AddSeaSonProps) => {
  const {navigation} = props;
  const {t} = useTranslation();
  const seasonValue = useSelector((state: RootState) => state.season);
  const [value, setValue] = React.useState<SEASON.Request.Season>(
    props.route.params?.data || seasonValue.seasonBody,
  );
  const dispatch = useDispatch();
  const [step, setStep] = React.useState(
    props.route.params?.step || seasonValue.step,
  );
  const [dirty, setDirty] = React.useState<boolean>(step !== 0);

  // init crops to redux on first load form
  React.useEffect(() => {
    if (value.grossArea.value && value.grossYield.value)
      dispatch(
        createCrops({
          productsOfFarm: value.productsOfFarm,
          grossArea: {
            value: value.grossArea.value,
            unitId: value.grossArea.unitId,
          },
          grossYield: {
            value: value.grossYield.value,
            unitId: value.grossYield.unitId,
          },
          certifycateOfLandIds: value.certifycateOfLandIds,
          businessType: value.businessType,
        }),
      );
  }, []);

  //handle on press next step
  const handleSetValue = (newValue: any) => {
    setDirty(true);
    setValue((pre: any) => {
      return {
        ...pre,
        ...newValue,
      };
    });
    if (step < stepList.length - 1) setStep(pre => pre + 1);
  };

  //handle on press save button on update season
  const saveValue = (newValue: any) => {
    const UpdateValue: SEASON.Request.Season = {
      ...value,
      ...newValue,
    };
    createOrUpdateSeason(UpdateValue)
      .then(() => {
        RootNavigator.navigate(SCREEN_NAME.SEASON, {refresh: true});
        dispatch(resetData());
      })
      .catch(err => console.log(err));
  };

  //popup alert on press cancel
  const alertPopup = (type: 'CREATE' | 'UPDATE') => {
    if (type === 'CREATE') {
      if (dirty) {
        Alert.alert(
          t('leave_create_farm'),
          t('mess_leave_create_farm').toString(),
          [
            {
              text: t('save').toString(),
              style: 'default',
              onPress: () => {
                dispatch(pushValueSeasonCreate({step: step, value: value}));
                navigation.navigate(SCREEN_NAME.SEASON);
              },
            },
            {
              text: t('dont_save').toString(),
              style: 'default',
              onPress: () => {
                dispatch(resetData());
                navigation.goBack();
              },
            },
            {
              text: t('cancel').toString(),
              style: 'destructive',
              onPress: () => {},
            },
          ],
        );
      } else {
        dispatch(resetData());
        navigation.goBack();
      }
    } else {
      Alert.alert(t('confirm_cancel'), t('confirm_cancel_des').toString(), [
        {
          text: t('confirm').toString(),
          style: 'default',
          onPress: () => {
            dispatch(resetData());
            navigation.goBack();
          },
        },

        {
          text: t('cancel').toString(),
          style: 'destructive',
          onPress: () => {},
        },
      ]);
    }
  };

  //list step create season
  const stepList = [
    {
      id: 0,
      title: value.id ? t('update_season') : t('create_season'),
      content: (
        <Step1
          value={value}
          onSubmit={v => handleSetValue(v)}
          onSave={saveValue}
        />
      ),
    },
    {
      id: 1,
      title: t('season_name'),
      content: (
        <Step2
          value={value}
          onSubmit={v => handleSetValue(v)}
          onSave={saveValue}
        />
      ),
    },
    {
      id: 2,
      title: t('season_info'),
      content: (
        <Step3
          value={value}
          onSubmit={v => handleSetValue(v)}
          onSave={saveValue}
        />
      ),
    },
    // {
    //   id: 3,
    //   title: t('classDistributionDensity'),
    //   content: (
    //     <Step4
    //       value={value}
    //       onSubmit={v => handleSetValue(v)}
    //       onSave={saveValue}
    //     />
    //   ),
    // },
    {
      id: 3,
      title: t('crops'),
      content: (
        <Step5
          value={value}
          onSubmit={v => handleSetValue(v)}
          onSave={saveValue}
          setValue={setValue}
        />
      ),
    },
    {
      id: 4,
      title: t('TotalexpectedOutput'),
      content: (
        <Step6
          value={value}
          onSubmit={v => handleSetValue(v)}
          onSave={saveValue}
        />
      ),
    },
    {
      id: 5,
      title: t('Addmaterials'),
      content: (
        <Step7
          value={value}
          onSubmit={v => handleSetValue(v)}
          onSave={saveValue}
        />
      ),
    },
    {
      id: 6,
      title: t('status_season'),
      content: <StatusUpdate value={value} />,
    },
  ];
  const onGoBack = () => {
    if (step > 0 && step !== 6) {
      setStep(pre => pre - 1);
    } else {
      navigation.goBack();
    }
  };
  return (
    <StepWrapperL
      stepList={stepList}
      step={step}
      onGoBack={onGoBack}
      headerRight={
        <TouchableOpacity
          onPress={() => {
            alertPopup(value.id ? 'UPDATE' : 'CREATE');
          }}>
          <Text style={styles.textCancle}>{t('cancel')}</Text>
        </TouchableOpacity>
      }
    />
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textCancle: {
    ...styleSheet.textStyleBold,
    color: Colors.CANCLE_BUTTON,
  },
});

export default AddSeaSon;
