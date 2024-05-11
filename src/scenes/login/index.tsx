/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Keyboard,
  Linking,
  Alert,
} from 'react-native';
import 'src/i18n/i18n.config';
import {Formik} from 'formik';
import {styleSheet} from 'src/styles/styleSheet';
import {SCREEN_NAME} from 'src/navigations/screen-name';

import PhoneInput from 'src/components/organisms/fields/input/PhoneInput';
import QPasswordInput from 'src/components/organisms/fields/input/QPasswordInput';
import SpinButton from 'src/components/organisms/buttons/SpinButton';
import {useTranslation} from 'react-i18next';
import * as yup from 'yup';
import {AppDispatch, RootState} from 'src/state/store';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser} from 'src/state/reducers/authUser/authThunk';
import {Colors} from 'src/styles';
import {AUTH} from 'src/api/auth/type';
import {ICON} from 'src/assets';
import TouchID from 'react-native-touch-id';
import {formatPhoneNumner} from 'src/help/formatPhone';

type Props = {
  navigation: any;
};

function Login(props: Props): JSX.Element {
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const loginTouchId = useSelector(
    (state: RootState) => state.authReducer?.loginTouchId,
  );
  const [loadingForm, setLoadingForm] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoadingForm(false);
    }, 500);
  }, []);

  const onFinish = async (value: AUTH.LOGIN.Request.Login) => {
    setLoading(true);
    Keyboard.dismiss();
    dispatch(loginUser(value))
      .unwrap()
      .catch(error => {
        console.log('🚀 ~ file: index.tsx:41 ~ onFinish ~ error:', error);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 700);
      });
  };

  const loginValidationSchema = yup.object().shape({
    username: yup
      .string()
      .min(10, () => t('phone_number_invalid'))
      .max(11, () => t('phone_number_invalid'))
      .required(() => t('phone_number_required')),
    password: yup
      .string()
      .required(() => t('please_fill_your_password'))
      .min(6, t('min_6_syms').toString())
      .max(60, t('max_60_syms').toString()),
  });

  const optionalConfigAuthen = {
    title: 'Authentication Required', // Android
    color: '#e00606', // Android,
  };
  const optionalConfigSupport = {
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: false, // if true is passed, itwill allow isSupported to return an error if the device is not enrolled in touch id/face id etc. Otherwise, it will just tell you what method is supported, even if the user is not enrolled.  (default false)
  };

  return (
    <SafeAreaView style={styles.container}>
      {!loadingForm && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <Formik
            initialValues={{
              username: loginTouchId?.user?.username || '',
              password: '',
              loginText: loginTouchId?.user?.username || '',
            }}
            onSubmit={onFinish}
            validationSchema={loginValidationSchema}>
            {({handleChange, handleBlur, handleSubmit, values}) => {
              const pressHandler = async () => {
                TouchID.isSupported(optionalConfigSupport)
                  .then(async res => {
                    TouchID.authenticate(
                      t('login').toString(),
                      optionalConfigAuthen,
                    )
                      .then(() => {
                        handleChange('password')(loginTouchId.user.password);
                        handleSubmit();
                      })
                      .catch((err: any) => console.log(err));
                  })
                  .catch(err => {
                    if (
                      (Platform.OS === 'ios' &&
                        err.name === 'LAErrorTouchIDNotAvailable') ||
                      (Platform.OS === 'android' &&
                        err.code === 'NOT_AVAILABLE')
                    ) {
                      Alert.alert(
                        t('error_app_permision'),
                        t('error_TouchId_NOT_AVAILABLE').toString(),
                        [
                          {
                            text: t('confirm').toString(),
                            onPress: () => {
                              Linking.openSettings();
                            },
                          },
                          {
                            text: t('cancel').toString(),
                            onPress: () => {},
                            style: 'destructive',
                          },
                        ],
                      );
                    }
                  });
              };
              return (
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  style={{width: '100%', paddingHorizontal: 20}}
                  contentContainerStyle={{
                    justifyContent: 'center',
                    height: '100%',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      ...styleSheet.titleTextStyle,
                      ...styles.marginBottom,
                    }}>
                    {t('login')}
                  </Text>

                  <PhoneInput
                    onChangeText={val => {
                      handleChange('loginText')(val);
                      handleChange('username')(formatPhoneNumner(val).value);
                    }}
                    name="username"
                    defaultValue={values.loginText}
                    placeholder={t('phone_number').toString()}
                    keyboardType="numeric"
                    autoFocus={!values.loginText}
                  />

                  <QPasswordInput
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    name="password"
                    placeholder={t('password').toString()}
                    keyboardType="default"
                    autoFocus={!!values.username}
                  />
                  {loginTouchId?.type &&
                    loginTouchId.user.username === values.username && (
                      <TouchableOpacity
                        style={{alignSelf: 'flex-end'}}
                        onPress={() => {
                          Keyboard.dismiss();
                          pressHandler();
                        }}>
                        <Image
                          source={
                            ICON[
                              loginTouchId.type === 'FaceID'
                                ? 'face_id'
                                : 'fingerprint'
                            ]
                          }
                          style={{
                            height: 30,
                            width: 30,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                  {/* todo after otp active */}
                  {/* <View style={styles.leftAlign}>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate(SCREEN_NAME.FOGOT_PASSWORD)
                      }>
                      <Text style={{...styleSheet.linkTextStyle}}>
                        {t('fogot_password')}
                      </Text>
                    </TouchableOpacity>
                  </View> */}
                  {/* todo after otp active */}
                  <SpinButton
                    isLoading={loading}
                    title={t('login')}
                    buttonProps={{
                      onPress: (val: any) => handleSubmit(val),
                      style: {
                        ...styleSheet.buttonPrimaryStyle,
                        ...styles.marginTop,
                      },
                    }}
                    titleProps={{
                      style: {...styleSheet.buttonPrimaryText},
                    }}
                  />
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() =>
                      props.navigation.navigate(SCREEN_NAME.REGISTER)
                    }>
                    <Text style={styleSheet.textStyleBasic}>
                      {t('dont_have_account')}{' '}
                    </Text>
                    <Text
                      style={[
                        styleSheet.textStyleBasic,
                        styleSheet.linkTextStyle,
                      ]}>
                      {t('register')}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              );
            }}
          </Formik>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

export default Login;

const styles = StyleSheet.create({
  leftAlign: {
    width: '100%',
    alignItems: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    height: 30,
  },
  marginTop: {
    marginTop: 80,
  },
  marginBottom: {
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
});
