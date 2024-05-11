import {Alert, StyleSheet} from 'react-native';
import React from 'react';
import {StepWrapperL} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import Step1 from './step1';
import Step2 from './step2';
import {ChangePhoneBodyRequest} from 'src/api/auth/type';
import Step3 from './step3';

type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<{
    params: {
      phone: string;
    };
  }>;
};

const ChangePassword = (props: Props) => {
  const {t} = useTranslation();
  const {params} = props.route;
  const {navigation} = props;
  const [step, setStep] = React.useState(0);
  const [value, setValue] = React.useState<ChangePhoneBodyRequest>({
    phone: params.phone,
  });

  const handleSetValue = (val: any) => {
    setValue((pre: any) => {
      return {...pre, ...val};
    });
    if (step < stepList.length - 1) setStep(pre => pre + 1);
  };

  const stepList = [
    {
      id: 0,
      title: t('change_password'),
      content: (
        <Step1
          value={{phone: params.phone}}
          onSubmit={v => handleSetValue(v)}
        />
      ),
    },
    // {
    //   id: 1,
    //   title: t('change_password'),
    //   content: <Step2 value={value} onSubmit={v => handleSetValue(v)} />,
    // },
    {
      id: 2,
      title: t('change_password'),
      content: <Step3 value={value} onSubmit={v => handleSetValue(v)} />,
    },
  ];

  const onGoBack = () => {
    if (step === 0) navigation.goBack();
    else
      Alert.alert(t('confirm_back'), t('confirm_back_des').toString(), [
        {
          text: t('cancel').toString(),
          onPress: () => {},
          style: 'destructive',
        },
        {
          text: t('accept').toString(),
          onPress: () => navigation.goBack(),
          style: 'default',
        },
      ]);
  };

  return <StepWrapperL stepList={stepList} step={step} onGoBack={onGoBack} />;
};

export default ChangePassword;

const styles = StyleSheet.create({});
