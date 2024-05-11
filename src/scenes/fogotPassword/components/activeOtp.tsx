import {Text, TouchableOpacity, View} from 'react-native';
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
import {forgotPassword} from 'src/api/auth/actions';

type Props = {
  setNextStep: Function;
  setData: React.Dispatch<React.SetStateAction<any>>;
  data: any;
  apiAction: (
    data: AUTH.PASSWORD.Request.ValidateOtpResetPassword,
  ) => Promise<{resetKey: string}>;
};
const ActiveOtp = (props: Props) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [timeCount, setTimeCount] = React.useState<number>(
    props.data.expirationTime || 0,
  );

  useEffect(() => {
    if (timeCount > 0) {
      setTimeout(() => {
        setTimeCount(timeCount - 1);
      }, 1000);
    }
  }, [timeCount]);

  const onFinish = (value: {otp: string}) => {
    setLoading(true);
    props
      .apiAction({
        otp: value.otp,
        resetKey: props.data.resetKey,
      })
      .then(res => {
        setLoading(false);
        props.setData((pre: any) => {
          return {
            ...pre,
            activationKey: res.resetKey,
          };
        });
        props.setNextStep();
      })
      .catch(err => {
        setLoading(false);
      });
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
              {t('forgot_password')}
            </Text>
          </View>
          <Text style={styles.description}>{t('sent_otp_string')}</Text>
          <Text style={{...styles.description, fontSize: 18, lineHeight: 20}}>
            {formatPhoneNumner(props.data.login).labelHidden}
          </Text>
          <OtpInput name="otp" timeCount={timeCount} autoFocus />
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={styleSheet.textStyleBasic}>
              {t('have_not_received_the_code')}
            </Text>
            <TouchableOpacity
              disabled={timeCount !== 0}
              onPress={() => {
                forgotPassword({login: props.data.login})
                  .then(res => {
                    setTimeCount(295);
                  })
                  .catch(err => console.log(err));
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
        </ScrollViewKeyboardAvoidView>
      )}
    </Formik>
  );
};

export default ActiveOtp;
