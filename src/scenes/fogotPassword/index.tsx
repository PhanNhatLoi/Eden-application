/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {View, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styleSheet} from 'src/styles/styleSheet';
import FillPhoneForm from './components/fillPhoneForm';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import ActiveOtp from './components/activeOtp';
import * as Types from './types';
import FillPassword from './components/fillPassword';
import {Colors} from 'src/styles';
import MyHeaders from 'src/components/organisms/headers';
import {useTranslation} from 'react-i18next';
import {
  forgotPassword,
  resetPassword,
  validateOtpResetPassword,
} from 'src/api/auth/actions';
import {StepWrapperL} from 'src/components/organisms';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

const initialValues: Types.resetPasswordType = {
  resetKey: '',
};

const FogotPassword = (props: Props) => {
  const [step, setStep] = useState<number>(0);
  const {navigation} = props;
  const [resetPasswordData, setResetPasswordData] =
    useState<Types.resetPasswordType>(initialValues);
  const {t} = useTranslation();
  const setNextStep = () => setStep(step + 1);
  const stepList = [
    {
      id: 0,
      title: ' ',
      content: (
        <FillPhoneForm
          textStringButton="next"
          description="please_fill_phone_number_forgot"
          setNextStep={setNextStep}
          setData={setResetPasswordData}
          data={resetPasswordData}
          apiAction={forgotPassword}
        />
      ),
    },

    {
      id: 1,
      title: ' ',
      content: (
        <ActiveOtp
          setNextStep={setNextStep}
          setData={setResetPasswordData}
          data={resetPasswordData}
          apiAction={validateOtpResetPassword}
        />
      ),
    },

    {
      id: 2,
      title: ' ',
      content: (
        <FillPassword
          textStringbutton="next"
          description="please_fill_your_password"
          setNextStep={setNextStep}
          setData={setResetPasswordData}
          data={resetPasswordData}
          apiAction={resetPassword}
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
      stepList={stepList}
      step={step}
      showBackBtn={false}
      headerRight={
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{...styleSheet.textStyleBold, color: Colors.SYS_BUTTON}}>
            {t('login')}
          </Text>
        </TouchableOpacity>
      }
    />
  );
};

export default FogotPassword;
