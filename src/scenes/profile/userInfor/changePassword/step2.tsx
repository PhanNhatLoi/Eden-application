import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Formik} from 'formik';
import OtpInput from 'src/components/organisms/fields/input/OtpInput';
import {formatPhoneNumner} from 'src/help/formatPhone';
import {ChangePhoneBodyRequest} from 'src/api/auth/type';
import {ScrollViewKeyboardAvoidView} from 'src/components/organisms';
import {StepButtonSingle} from 'src/components/molecules';
import {forgotPassword, validateOtpResetPassword} from 'src/api/auth/actions';
import {Colors} from 'src/styles';

type Props = {
  value: ChangePhoneBodyRequest;
  onSubmit?: (value: {activationKey: string}) => void;
};
const Step2 = (props: Props) => {
  const {t} = useTranslation();
  const {value, onSubmit = () => {}} = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [timeCount, setTimeCount] = useState<number>(value.expirationTime); //hardCode
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (timeCount > 0) {
      setTimeout(() => {
        setTimeCount(timeCount - 1);
      }, 1000);
    }
  }, [timeCount]);
  return (
    <Formik
      initialValues={{otp: ''}}
      onSubmit={values => {
        setLoading(true);
        validateOtpResetPassword({
          otp: values.otp,
          phone: value.phone,
          resetKey: value.resetKey,
        })
          .then(res => {
            onSubmit({activationKey: res.resetKey});
          })
          .catch(err => console.log(err))
          .finally(() => setLoading(false));
      }}>
      {({handleSubmit, values}) => (
        <ScrollViewKeyboardAvoidView
          scrollViewProps={{
            style: styles.container,
          }}
          bottomButton={
            <StepButtonSingle onPressRight={handleSubmit} loading={loading} />
          }>
          <Text style={styles.description}>{t('sent_otp_string')}</Text>
          <Text style={{...styles.description, fontSize: 18, lineHeight: 20}}>
            {formatPhoneNumner(value.phone).labelHidden || ''}
          </Text>
          <OtpInput name="otp" timeCount={timeCount} />
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={styleSheet.textStyleBasic}>
              {t('have_not_received_the_code')}
            </Text>
            <TouchableOpacity
              disabled={timeCount > 0}
              onPress={() => {
                forgotPassword({login: value.phone})
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

export default Step2;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 45,
  },
  container: {
    paddingHorizontal: 20,
    height: '100%',
  },
  description: {
    ...styleSheet.textStyleBold,
    textAlign: 'center',
    marginVertical: 30,
  },
});
