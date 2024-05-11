import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {AppContainer, StepWrapperL} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import Step1 from './step1';
import Step3 from './step3';
import {ChangeEmailBodyRequest} from 'src/api/auth/type';
import Step2 from './step2';

type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<{
    params: {
      email: string;
    };
  }>;
};

const ChangeEmail = (props: Props) => {
  const {t} = useTranslation();
  const {params} = props.route;
  const {navigation} = props;
  const [step, setStep] = React.useState(0);
  const [value, setValue] = React.useState<ChangeEmailBodyRequest>({
    email: params.email,
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
      title: t('email'),
      content: <Step1 value={value} onSubmit={v => handleSetValue(v)} />,
    },
    {
      id: 1,
      title: t('email'),
      content: <Step2 value={value} onSubmit={v => handleSetValue(v)} />,
    },
    {
      id: 2,
      title: t('email'),
      content: <Step3 value={value} onSubmit={v => handleSetValue(v)} />,
    },
  ];

  const onGoBack = () => {
    if (step > 0) {
      setStep(pre => pre - 1);
    } else {
      navigation.goBack();
    }
  };

  return <StepWrapperL stepList={stepList} step={step} onGoBack={onGoBack} />;
};

export default ChangeEmail;

const styles = StyleSheet.create({});
