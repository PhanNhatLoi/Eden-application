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
import {Colors} from 'src/styles';
import {StepButtonSingle} from 'src/components/molecules';
import {AUTH} from 'src/api/auth/type';

const SignupSchema = Yup.object().shape({
  password: passwordValidate,
  confirmPassword: confirmPasswordValidate,
});

type Props = {
  handleSubmit: (value: {password: string}) => void;
};
const FillPassword = (props: Props) => {
  const {handleSubmit = () => {}} = props;
  const onFinish = (value: {password: string}) => {
    handleSubmit({password: value.password});
  };

  return (
    <Formik
      initialValues={{password: '', confirmPassword: ''}}
      onSubmit={onFinish}
      validationSchema={SignupSchema}>
      {({handleSubmit, handleChange}) => (
        <ScrollViewKeyboardAvoidView
          scrollViewProps={{
            style: styles.container,
          }}
          bottomButton={
            <StepButtonSingle
              loading={false}
              title="next"
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
              {t('register')}
            </Text>
          </View>
          <Text style={styles.description}>
            {t('please_fill_your_password')}
          </Text>
          <View>
            <PasswordInput
              require
              name="password"
              placeholder={t('password').toString()}
              autoFocus
            />
            <PasswordInput
              require
              name="confirmPassword"
              placeholder={t('confirm_password').toString()}
            />
          </View>
        </ScrollViewKeyboardAvoidView>
      )}
    </Formik>
  );
};

export default FillPassword;
