/* eslint-disable react-native/no-inline-styles */
import {Text, TouchableOpacity, View, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {t} from 'i18next';
import MInput from 'src/components/organisms/fields/input/Input';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import {Formik} from 'formik';
import {ICON} from 'src/assets';
import {checkPhone, register, sendOtpRegister} from 'src/api/auth/actions';
import {styles} from '../types';
import {ScrollViewKeyboardAvoidView} from 'src/components/organisms';
import {StepButtonSingle} from 'src/components/molecules';
import * as RootNavigation from 'src/navigations/root-navigator';
import {AUTH} from 'src/api/auth/type';
import {SCREEN_NAME} from 'src/navigations/screen-name';

type Props = {
  handleSubmit: (value: {
    login: string;
    expirationTime: number;
    activationKey: string; // hotfix disabled otp
  }) => void;
};

const FillPhoneForm = (props: Props) => {
  const {handleSubmit} = props;
  const [checked, setChecked] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [loadingForm, setLoadingForm] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoadingForm(false);
    }, 300);
  }, []);

  const onFinish = (value: {login: string}) => {
    setLoading(true);
    checkPhone({login: value.login})
      .then(() => {
        register(value.login)
          .then(registerResponse => {
            sendOtpRegister({
              phone: value.login,
              otp: registerResponse.otp || 111111, // 111111 hardcode,
            })
              .then(otpResponse => {
                handleSubmit({
                  login: value.login,
                  expirationTime: registerResponse.expirationTime,
                  activationKey: otpResponse.resetKey,
                });
              })
              .catch(err => {
                console.log(err);
              })
              .finally(() => setLoading(false));

            // hotfix disabled otp
            // handleSubmit({
            //   login: value.login,
            //   expirationTime: registerResponse.expirationTime,
            // });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Formik initialValues={{login: ''}} onSubmit={values => onFinish(values)}>
      {({handleSubmit}) => (
        <ScrollViewKeyboardAvoidView
          loading={loadingForm}
          scrollViewProps={{
            style: styles.container,
          }}
          bottomButton={
            <StepButtonSingle
              loading={loading}
              title="register"
              disableRight={!checked}
              buttonStyle={[
                styleSheet.buttonPrimaryStyle,
                {
                  backgroundColor: !checked
                    ? Colors.GRAY_02
                    : Colors.SYS_BUTTON,
                },
              ]}
              textButtonStyle={[
                styleSheet.buttonPrimaryText,
                {color: checked ? Colors.WHITE : Colors.GRAY_03},
              ]}
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
            {t('please_fill_phone_number')}
          </Text>
          <View>
            <MInput
              type="phone"
              require
              name="login"
              placeholder={t('phone_number').toString()}
              keyboardType="numeric"
              autoFocus
            />

            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => setChecked(!checked)}>
                <Image
                  source={ICON[checked ? 'checkbox_active' : 'checkbox']}
                  style={{width: 20, height: 20}}
                />
              </TouchableOpacity>
              <View style={styles.text}>
                <Text style={{...styles.text, color: Colors.BLACK}}>
                  {' ' + t('read_and_accept_with')}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    RootNavigation.navigate(SCREEN_NAME.TERMS_OF_SERVICE);
                  }}>
                  <Text style={styles.text}>{' ' + t('terms_of_service')}</Text>
                </TouchableOpacity>
                <Text style={{...styles.text, color: Colors.BLACK}}>
                  {' ' + t('and')}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    RootNavigation.navigate(SCREEN_NAME.POLICY);
                  }}>
                  <Text style={styles.text}>
                    {' ' + t('privacy_policy') + '.'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollViewKeyboardAvoidView>
      )}
    </Formik>
  );
};

export default FillPhoneForm;
