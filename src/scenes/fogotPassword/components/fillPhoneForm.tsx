/* eslint-disable react-native/no-inline-styles */
import {Text, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {t} from 'i18next';
import MInput from 'src/components/organisms/fields/input/Input';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import {Formik} from 'formik';
import {styles} from '../types';
import {ScrollViewKeyboardAvoidView} from 'src/components/organisms';
import {StepButtonSingle} from 'src/components/molecules';
import {AUTH} from 'src/api/auth/type';

type Props = {
  setNextStep: Function;
  setData: React.Dispatch<React.SetStateAction<any>>;
  data: any;
  description: string;
  termsOfService?: boolean;
  textStringButton: string;
  apiAction: (data: {
    login: string;
  }) => Promise<AUTH.PASSWORD.Response.ResetPassword>;
};

const FillPhoneForm = (props: Props) => {
  const [loading, setLoading] = React.useState(false);

  const [loadingForm, setLoadingForm] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoadingForm(false);
    }, 300);
  }, []);

  const onFinish = (value: {login: string}) => {
    setLoading(true);
    props
      .apiAction({login: value.login})
      .then(res => {
        setLoading(false);
        props.setData((pre: any) => {
          return {
            ...pre,
            login: value.login,
            expirationTime: 295, //hardcode
            resetKey: res.resetKey,
            // login: login, change 0 -> 84
          };
        });
        props.setNextStep();
      })
      .catch(err => {
        setLoading(false);
      });
  };

  return (
    <Formik initialValues={{login: ''}} onSubmit={onFinish}>
      {({handleSubmit}) => (
        <ScrollViewKeyboardAvoidView
          loading={loadingForm}
          scrollViewProps={{
            style: styles.container,
          }}
          bottomButton={
            <StepButtonSingle
              loading={loading}
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
              {t('forgot_password')}
            </Text>
          </View>
          <Text style={styles.description}>{t(props.description)}</Text>
          <MInput
            type="phone"
            require
            name="login"
            placeholder={t('phone_number').toString()}
            keyboardType="numeric"
            autoFocus
          />
        </ScrollViewKeyboardAvoidView>
      )}
    </Formik>
  );
};

export default FillPhoneForm;
