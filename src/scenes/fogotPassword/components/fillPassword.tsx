import {Text, View, Alert, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {t} from 'i18next';
import {styles} from '../types';
import {styleSheet} from 'src/styles/styleSheet';
import {Formik} from 'formik';
import {
  PasswordInput,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import * as Yup from 'yup';
import {
  confirmPasswordValidate,
  passwordValidate,
} from 'src/help/validation/input';
import * as RootNavigation from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {Colors} from 'src/styles';
import {StepButtonSingle} from 'src/components/molecules';

const SignupSchema = Yup.object().shape({
  password: passwordValidate,
  confirmPassword: confirmPasswordValidate,
});

type Props = {
  setNextStep: Function;
  setData: React.Dispatch<React.SetStateAction<any>>;
  data: any;
  description: string;
  textStringbutton: string;
  apiAction?: any;
};
const FillPassword = (props: Props) => {
  const [loading, setLoading] = React.useState(false);
  const onFinish = (value: {password: string}) => {
    setLoading(true);
    props
      .apiAction({
        resetKey: props.data.activationKey,
        newPassword: value.password,
      })
      .then((res: any) => {
        setLoading(false);
        // props.setNextStep();
        RootNavigation.navigate(SCREEN_NAME.COMPELETED, {
          description: 'successful_reset_password',
          user: {
            username: props.data.login,
            password: value.password,
          },
        });
      })
      .catch((err: any) => {
        setLoading(false);
      });
  };

  return (
    <Formik
      initialValues={{password: '', confirmPassword: ''}}
      onSubmit={onFinish}
      validationSchema={SignupSchema}>
      {({handleSubmit}) => (
        <ScrollViewKeyboardAvoidView
          scrollViewProps={{
            style: styles.container,
          }}
          bottomButton={
            <StepButtonSingle
              loading={loading}
              title="finish"
              onPressRight={handleSubmit}
            />
          }>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                ...styleSheet.textStyleBold,
                fontSize: 30,
                color: Colors.BLACK,
                lineHeight: 100,
              }}>
              {t('forgot_password')}
            </Text>
          </View>
          <Text style={styles.description}>{t(props.description)}</Text>
          <PasswordInput
            require
            autoFocus
            name="password"
            placeholder={t('password').toString()}
          />
          <PasswordInput
            require
            name="confirmPassword"
            placeholder={t('confirm_password').toString()}
          />
        </ScrollViewKeyboardAvoidView>
      )}
    </Formik>
  );
};

export default FillPassword;
