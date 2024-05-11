import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {
  FieldDropsDownModal,
  FieldSelect,
  StepWrapperL,
} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import Step1 from './step1';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import {FieldTitle} from 'src/components/molecules';
import {ICON} from 'src/assets';
import {DIARY} from 'src/api/diary/type.d';
import Step2 from './step2';
import {UpdateWorks} from 'src/state/reducers/diary/diarySlice';
import {useDispatch} from 'react-redux';
import {OptionType} from 'src/api/appData/type';
import {optionsType} from 'src/components/organisms/appForm/FieldDropDown';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';
type Props = {
  route: RouteProp<{
    params: {
      work: DIARY.Basic.WorkType;
      farmingSeasonId: number | null;
      viewForm: boolean;
      seasonList: optionsType[];
      index: number;
      infor: DIARY.Response.Diary;
    };
  }>;
  navigation: NavigationProp<ParamListBase>;
};

const AddWork = (props: Props) => {
  const {navigation} = props;
  const {params} = props.route;
  const dishpatch = useDispatch();
  const [value, setValue] = React.useState<DIARY.Basic.WorkType>(params.work);
  const {t} = useTranslation();
  const [step, setStep] = React.useState(0);

  const handleSetValue = (newValue: any) => {
    const newData = {
      ...value,
      ...newValue,
    };
    setValue(newData);
    if (step < stepList.length - 1) setStep(pre => pre + 1);
    else {
      dishpatch(UpdateWorks({work: newData, index: params.index}));
      navigation.goBack();
    }
  };

  const stepList = [
    {
      id: 0,
      title: params.work.name || '',
      content: (
        <Step1
          onSubmit={handleSetValue}
          value={value}
          viewForm={params.viewForm}
          infor={params.infor}
        />
      ),
    },
    {
      id: 1,
      title: t(params.viewForm ? 'media_culture' : 'add_images/video_culture'),
      content: (
        <Step2
          onSubmit={handleSetValue}
          value={value}
          viewForm={params.viewForm}
          infor={params.infor}
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
      heightHeader={40 + 145}
      headerContent={
        <View style={styles.header}>
          <View style={styles.row}>
            <View>
              <FieldTitle
                style={styleSheet.textStyleBold}
                title={t(params.viewForm ? 'season_name' : 'select_season')}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  marginRight: 10,
                  ...styleSheet.textStyleBasic,
                  color: Colors.SYS_BUTTON,
                }}>
                {new Date(Date.now()).toLocaleDateString('vi-VN')}
              </Text>
              {/* <Image source={ICON['clock']} /> */}
              <IconFigma name="clock" />
            </View>
          </View>

          <FieldSelect
            options={params.seasonList}
            placeholder={'select_season'}
            disabled={true}
            title={''}
            require
            defaultValue={
              (params.farmingSeasonId && [params.farmingSeasonId]) || []
            }
            onChangeValue={items => {}}
          />
        </View>
      }
      stepList={stepList}
      step={step}
      onGoBack={onGoBack}
    />
  );
};

export default AddWork;

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.WHITE,
    padding: 20,
    width: '100%',
    zIndex: 1,
    height: 130,
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
