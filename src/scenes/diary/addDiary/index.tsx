import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useState} from 'react';
import {FieldSelect, StepWrapperL} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import {FieldTitle} from 'src/components/molecules';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import Step1 from './step1';
import Step2 from './step2';
import {DIARY} from 'src/api/diary/type.d';
import {CreateDiary} from 'src/api/diary/actions';
import * as RootNavigation from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {useDispatch} from 'react-redux';
import {
  clearDataDiary,
  initDataDiary,
} from 'src/state/reducers/diary/diarySlice';
import {optionsType} from 'src/components/organisms/appForm/FieldDropDown';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';

type Props = {
  route: RouteProp<{
    params: {
      farmingSeasonId: number;
      data?: DIARY.Request.Diary;
      seasonList: optionsType[];
    };
  }>;
  navigation: NavigationProp<ParamListBase>;
};

const Works = (props: Props) => {
  const {params} = props.route;
  const {navigation} = props;
  const dishpatch = useDispatch();
  const {t} = useTranslation();

  const [value, setValue] = React.useState<DIARY.Request.Diary>({
    id: null,
    farmingSeasonId: null,
    works: [],
    createdDate: null,
    expectedOutputToday: {
      value: null,
      unitId: null,
      unitName: null,
    },
  });
  const [step, setStep] = React.useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const viewForm = Boolean(params.data);

  React.useEffect(() => {
    if (params.data) {
      dishpatch(initDataDiary(params.data));
      setValue(params.data);
    } else {
      dishpatch(clearDataDiary());
      setValue((pre: DIARY.Request.Diary) => {
        return {...pre, farmingSeasonId: params.farmingSeasonId};
      });
    }
  }, []);

  const handleSetValue = (newValue: any) => {
    setValue((pre: any) => {
      return {
        ...pre,
        ...newValue,
      };
    });
    if (step < stepList.length - 1) setStep(pre => pre + 1);
    else {
      if (viewForm) RootNavigation.navigate(SCREEN_NAME.DIARY);
      else {
        // create diary
        setLoading(true);
        const diaryBody: DIARY.Request.Diary = {
          ...value,
          ...newValue,
          createdDate: new Date(Date.now()).toISOString(),
        };
        CreateDiary(diaryBody)
          .then(res => {
            RootNavigation.navigate(SCREEN_NAME.DIARY, {
              refresh: true,
              farmingSeasonId: value?.farmingSeasonId,
            });
          })
          .catch(err => console.log(err))
          .finally(() => {
            dishpatch(clearDataDiary());
            setLoading(false);
          });
      }
    }
  };

  const stepList = [
    {
      id: 0,
      title: t(viewForm ? 'category_work' : 'choose_category_work'),
      content: (
        <Step1
          value={value}
          onSubmit={v => handleSetValue(v)}
          viewForm={viewForm}
          seasonList={params.seasonList}
        />
      ),
    },
    {
      id: 1,
      title: t('estimatedOutput'),
      content: (
        <Step2
          value={value}
          loading={loading}
          onSubmit={v => handleSetValue(v)}
          viewForm={viewForm}
        />
      ),
    },
  ];
  const onGoBack = () => {
    if (step > 0) {
      setStep(pre => pre - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <StepWrapperL
      hiddenHeaderLine
      headerContent={
        <View style={styles.header}>
          <View style={styles.row}>
            <View>
              <FieldTitle
                style={styleSheet.textStyleBold}
                title={t(viewForm ? 'season_name' : 'select_season')}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  marginRight: 10,
                  ...styleSheet.textStyleBasic,
                  color: Colors.SYS_BUTTON,
                }}>
                {new Date(
                  params?.data?.createdDate || Date.now(),
                ).toLocaleDateString('vi-VN')}
              </Text>
              {/* <Image source={ICON['clock']} /> */}
              <IconFigma name="clock" />
            </View>
          </View>
          <FieldSelect
            minValueArray={1}
            loading={false}
            options={params.seasonList}
            placeholder={'select_season'}
            disabled={viewForm}
            title={''}
            // name="farmId"
            require
            defaultValue={
              (params.farmingSeasonId && [params.farmingSeasonId]) || []
            }
            onChangeValue={items => {
              setValue((pre: any) => {
                return {
                  ...pre,
                  farmingSeasonId: (items.length && items[0].value) || null,
                };
              });
            }}
          />
        </View>
      }
      stepList={stepList}
      step={step}
      onGoBack={onGoBack}
    />
  );
};

export default Works;

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.WHITE,
    padding: 20,
    width: '100%',
    height: 130,
    borderBottomColor: Colors.GRAY_02,
    borderBottomWidth: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  textCancle: {
    ...styleSheet.textStyleBold,
    color: Colors.CANCLE_BUTTON,
  },
});
