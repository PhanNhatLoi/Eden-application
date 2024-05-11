import {
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import {StepButtonSingle} from 'src/components/molecules';
import {ScrollViewKeyboardAvoidView} from 'src/components/organisms';
import {forgotPassword, validateOtpResetPassword} from 'src/api/auth/actions';
import TouchID, {AuthenticateConfig} from 'react-native-touch-id';
import {useSelector} from 'react-redux';
import {AppDispatch, RootState} from 'src/state/store';
import {useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import {pushNotify} from 'src/state/reducers/Notification/notify';
import {
  changeLoginTouchId,
  logout,
} from 'src/state/reducers/authUser/authSlice';
import CustomModal from 'src/components/organisms/ui/modals/Modal';
import TextInput from 'src/components/molecules/TextInput';
import SpinButton from 'src/components/organisms/buttons/SpinButton';
import {SCREEN} from 'src/help';
import requestPermission from 'src/help/requestPermission';

type Props = {
  value: {phone: string};
  onSubmit?: (value: {
    expirationTime: number;
    login: string;
    resetKey: string;
    activationKey: string; //hotfix disabled otp
  }) => void;
};
const Step1 = (props: Props) => {
  const {t} = useTranslation();
  const {value, onSubmit = () => {}} = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [passwordWrong, setPasswordWrong] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const loginTouchId = useSelector(
    (state: RootState) => state.authReducer.loginTouchId,
  );
  const isEnabled = !!loginTouchId?.type;
  const dispatch = useDispatch<AppDispatch>();
  const [supported, setSupported] = useState<'TouchID' | 'FaceID'>();
  const [errorCode, setErrorCode] = useState<
    'NOT_SUPPORTED' | 'NOT_AVAILABLE'
  >();

  const optionalConfigAuthen: AuthenticateConfig = {
    title: t('authentication_required').toString(), // Android
    cancelText: t('cancel').toString(),
    sensorErrorDescription: t('authen_failed').toString(),
    sensorDescription: t('authen').toString(),
    fallbackLabel: t('show_passcode').toString(), // iOS
  };
  const optionalConfigSupport = {
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: false, // if true is passed, itwill allow isSupported to return an error if the device is not enrolled in touch id/face id etc. Otherwise, it will just tell you what method is supported, even if the user is not enrolled.  (default false)
  };

  useEffect(() => {
    TouchID.isSupported(optionalConfigSupport)
      .then(async res => {
        setSupported(res);
      })
      .catch(err => {
        if (Platform.OS === 'ios') {
          if (err.name === 'RCTTouchIDNotSupported')
            setErrorCode('NOT_SUPPORTED');
          if (
            err.name === 'LAErrorTouchIDNotAvailable' ||
            err.name === 'LAErrorTouchIDNotEnrolled'
          )
            setErrorCode('NOT_AVAILABLE');
        }
        if (Platform.OS === 'android') {
          setErrorCode(err.code);
        }
      });
  }, []);

  const pressHandler = async () => {
    if (!loginTouchId) {
      dispatch(
        pushNotify({
          title: 'please_login_again',
          message: 'please_login_again',
        }),
      );
      dispatch(logout());
      return;
    }

    TouchID.authenticate(t('').toString(), optionalConfigAuthen)
      .then(() => {
        dispatch(changeLoginTouchId(undefined));
      })
      .catch((err: any) => console.log(err));
  };

  const handleSubmit = () => {
    setLoading(true);
    forgotPassword({login: value.phone})
      .then(initResponse => {
        validateOtpResetPassword({
          otp: initResponse.otp,
          phone: value.phone,
          resetKey: initResponse.resetKey,
        })
          .then(res => {
            onSubmit({
              expirationTime: 295,
              login: value.phone,
              resetKey: initResponse.resetKey,
              activationKey: res.resetKey,
            });
          })
          .catch(err => console.log(err))
          .finally(() => setLoading(false));

        // onSubmit({
        //   expirationTime: 295,
        //   login: res.login,
        //   resetKey: res.resetKey,
        //   otp: res.otp,
        // });
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };
  return (
    <ScrollViewKeyboardAvoidView
      scrollViewProps={{
        style: styles.container,
        contentContainerStyle: {minHeight: 400},
      }}>
      <View style={styles.row}>
        <Text style={styleSheet.textStyleBasic}>{t('face_touch_id')}</Text>
        <Switch
          trackColor={{true: Colors.SYS_BUTTON, false: Colors.GRAY_03}}
          thumbColor={Colors.WHITE}
          onValueChange={() => {
            if (supported) {
              if (isEnabled) pressHandler();
              else setIsVisible(true);
            } else {
              if (errorCode === 'NOT_AVAILABLE') {
                Alert.alert(
                  t('error_app_permision'),
                  t('error_TouchId_NOT_AVAILABLE').toString(),
                  Platform.OS === 'ios'
                    ? [
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
                      ]
                    : [
                        {
                          text: t('confirm').toString(),
                          onPress: () => {},
                        },
                      ],
                );
              } else if (errorCode === 'NOT_SUPPORTED')
                dispatch(
                  pushNotify({
                    message: 'device_not_support_touchId',
                    title: 'device_not_support_touchId',
                  }),
                );
            }
          }}
          value={isEnabled || false}
        />
      </View>
      <StepButtonSingle
        spinColor={Colors.SYS_BUTTON}
        title="change_password"
        loading={loading}
        disableLeft={false}
        disableRight={false}
        buttonStyle={styleSheet.buttonDefaultStyle}
        textButtonStyle={styleSheet.buttonDefaultText}
        onPressRight={handleSubmit}
      />
      <CustomModal
        isVisible={isVisible}
        justifyContent="flex-start"
        setIsVisible={setIsVisible}
        onBackdropPressOnclose>
        <SafeAreaView>
          <View style={styles.modal}>
            <TouchableOpacity
              style={{alignItems: 'flex-end', width: '100%', padding: 5}}
              onPress={() => setIsVisible(false)}>
              <Icon name="closecircle" size={20} color={Colors.GRAY_03} />
            </TouchableOpacity>
            <View style={{paddingHorizontal: 20}}>
              <TextInput
                style={[
                  styleSheet.filedText,
                  {
                    borderColor: passwordWrong
                      ? Colors.CANCLE_BUTTON
                      : Colors.GRAY_03,
                  },
                ]}
                autoFocus
                secureTextEntry
                onChangeText={val => setPassword(val)}
              />
              {passwordWrong && (
                <Text
                  style={[
                    styleSheet.helperTextStyle,
                    {textAlign: 'center', marginTop: 10},
                  ]}>
                  {t('password_wrong')}
                </Text>
              )}
              <Text
                style={[
                  styleSheet.textStyleBasic,
                  {textAlign: 'center', marginTop: 10},
                ]}>
                {t('login_by_touchId')}
              </Text>
              <SpinButton
                isLoading={false}
                disabled={!password}
                title={t('confirm')}
                colorSpiner={Colors.SYS_BUTTON}
                buttonProps={{
                  onPress: () => {
                    if (password === loginTouchId.user?.password) {
                      dispatch(changeLoginTouchId(supported));
                      setIsVisible(false);
                      setPasswordWrong(false);
                    } else {
                      setPasswordWrong(true);
                    }
                  },

                  style: {
                    ...styleSheet.buttonPrimaryStyle,
                    backgroundColor: Colors.BLACK_02,
                  },
                }}
                titleProps={{
                  style: {...styleSheet.buttonPrimaryText},
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </CustomModal>
    </ScrollViewKeyboardAvoidView>
  );
};

export default Step1;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 45,
  },
  container: {
    padding: 20,
    width: '100%',
    // flex: 1,
  },
  modal: {
    // height: 200,
    marginTop: SCREEN.height * 0.2,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    // paddingHorizontal: 20,
    justifyContent: 'center',
  },
});
