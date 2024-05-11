import {Text, TouchableOpacity, View, Alert, ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import {t} from 'i18next';
import OtpInput from 'src/components/organisms/fields/input/OtpInput';
import {Formik} from 'formik';
import {styleSheet} from 'src/styles/styleSheet';
import {formatPhoneNumner} from 'src/help/formatPhone';
import {Colors} from 'src/styles';
import {styles} from '../types';
import {ScrollViewKeyboardAvoidView} from 'src/components/organisms';
import {StepButtonSingle} from 'src/components/molecules';
import {AUTH} from 'src/api/auth/type';
import {register, sendOtpRegister} from 'src/api/auth/actions';

type Props = {
  handleSubmit: (value: {activationKey: string}) => void;
  data: AUTH.REGISTER.Request.Register;
  expirationTime: AUTH.REGISTER.Basic.expirationTime;
};
const ActiveOtp = (props: Props) => {
  const {expirationTime, handleSubmit = () => {}} = props;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [timeCount, setTimeCount] = React.useState<number>(expirationTime || 0);

  useEffect(() => {
    if (timeCount > 0) {
      setTimeout(() => {
        setTimeCount(timeCount - 1);
      }, 1000);
    }
  }, [timeCount]);

  const onFinish = (value: {otp: string}) => {
    setLoading(true);
    sendOtpRegister({
      phone: props.data.login,
      otp: value.otp,
    })
      .then(res => {
        handleSubmit({activationKey: res.resetKey});
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Formik initialValues={{otp: ''}} onSubmit={onFinish}>
      {({handleSubmit}) => (
        <ScrollViewKeyboardAvoidView
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
              {t('register')}
            </Text>
          </View>
          <Text style={styles.description}>{t('sent_otp_string')}</Text>
          <View>
            <Text
              style={{
                ...styles.description,
                ...styleSheet.textStyleBold,
                fontSize: 18,
                lineHeight: 20,
              }}>
              {formatPhoneNumner(props.data.login).labelHidden}
            </Text>
            <OtpInput autoFocus name="otp" timeCount={timeCount} />
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={styleSheet.textStyleBasic}>
                {t('have_not_received_the_code')}
              </Text>
              <TouchableOpacity
                disabled={timeCount !== 0}
                onPress={() => {
                  register(props.data.login)
                    .then(res => {
                      setLoading(false);
                      setTimeCount(res.expirationTime);
                    })
                    .catch(err => {
                      console.log(err);
                    })
                    .finally(() => setLoading(false));
                }}>
                <Text
                  style={{
                    ...styleSheet.textStyleBasic,
                    marginLeft: 5,
                    textDecorationLine: 'underline',
                    color: timeCount === 0 ? Colors.BLACK : Colors.GRAY_03,
                  }}>
                  {t('re_sent_otp_code')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollViewKeyboardAvoidView>
      )}
    </Formik>
  );
};

export default ActiveOtp;
