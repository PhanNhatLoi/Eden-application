/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {connect} from 'react-redux';
import {styleSheet} from 'src/styles/styleSheet';
import FillPhoneForm from './components/step1';
import ActiveOtp from './components/step2';
import FillPassword from './components/step3';
import FillFullName from './components/step4';
import UploadAvatar from './components/step5';
import CompeletedScreen from './components/step6';
import {Colors} from 'src/styles';
import {useTranslation} from 'react-i18next';
import {StepWrapperL} from 'src/components/organisms';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {AUTH} from 'src/api/auth/type';

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

const initialValues: AUTH.REGISTER.Request.Register = {
  login: '',
  password: '',
  phone: '',
  activationKey: '',
  name: '',
  firstName: '',
  lastName: '',
  shortName: '',
  avatar: '',
  job: null,
  salary: null,
  dayWorks: null,
  // otp: '',
};

const Register = (props: Props) => {
  const [step, setStep] = useState<number>(0);
  const {navigation} = props;
  const [currentRegister, setCurrentRegister] =
    useState<AUTH.REGISTER.Request.Register>(initialValues);
  const [expirationTime, setExpirationTime] = useState<number>(0);
  const {t} = useTranslation();

  const handleSubmit = (value: any, propsStep: number) => {
    switch (propsStep) {
      case 0:
        setCurrentRegister({
          ...initialValues,
          login: value.login,
          activationKey: value.activationKey,
        });
        setExpirationTime(value.expirationTime);
        break;
      case 1:
        setCurrentRegister({
          ...currentRegister,
          activationKey: value.activationKey,
        });
        break;
      case 2:
        setCurrentRegister({
          ...currentRegister,
          password: value.password,
        });
        break;
      case 3:
        setCurrentRegister({
          ...currentRegister,
          name: value.name,
          shortName: value.shortName,
        });
        break;
      case 4:
        setCurrentRegister({
          ...currentRegister,
          avatar: value.avatar,
        });
        break;
      default:
        break;
    }
    setStep(step + 1);
  };

  const stepList = [
    // step_1: 'fill phone register' *,
    // step_2: 'active otp'  *,
    // step_3: 'fill password  *',
    // step_4: 'full name'  *,
    // step_5: 'upload avatar',
    // step_6: 'finish',
    {
      id: 0,
      title: ' ',
      content: (
        <FillPhoneForm
          handleSubmit={(val: {login: string; expirationTime: number}) =>
            handleSubmit(val, 0)
          }
        />
      ),
    },
    //todo after otp
    // {
    //   id: 1,
    //   title: ' ',
    //   content: (
    //     <ActiveOtp
    //       expirationTime={expirationTime}
    //       data={currentRegister}
    //       handleSubmit={(val: {activationKey: string}) => handleSubmit(val, 1)}
    //     />
    //   ),
    // },
    {
      id: 2,
      title: ' ',
      content: (
        <FillPassword
          handleSubmit={(val: {password: string}) => handleSubmit(val, 2)}
        />
      ),
    },
    {
      id: 3,
      title: ' ',
      content: (
        <FillFullName
          handleSubmit={(val: {name: string; shortName: string}) =>
            handleSubmit(val, 3)
          }
        />
      ),
    },
    {
      id: 4,
      title: ' ',
      content: (
        <UploadAvatar
          handleSubmit={(val: {avatar: string}) => handleSubmit(val, 4)}
          data={currentRegister}
        />
      ),
    },
    {
      id: 5,
      title: ' ',
      content: <CompeletedScreen data={currentRegister} />,
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
      headerRight={
        step === 0 ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text
              style={{...styleSheet.textStyleBold, color: Colors.SYS_BUTTON}}>
              {t('login')}
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )
      }
      stepList={stepList}
      step={step}
      onGoBack={onGoBack}
      showHeader={!(step === 5)}
    />
  );
};

export default connect(null, {})(Register);
