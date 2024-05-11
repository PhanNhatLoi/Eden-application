import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Formik} from 'formik';
import SpinButton from 'src/components/organisms/buttons/SpinButton';
import OtpInput from 'src/components/organisms/fields/input/OtpInput';
import * as RootNavigation from 'src/navigations/root-navigator';
import {ChangeEmailBodyRequest} from 'src/api/auth/type';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {SCREEN} from 'src/help';
import {ScrollViewKeyboardAvoidView} from 'src/components/organisms';
import {Colors} from 'src/styles';

type Props = {
  value: ChangeEmailBodyRequest;
  onSubmit?: (value: any) => void;
};
const Step3 = (props: Props) => {
  const {t} = useTranslation();
  const {value, onSubmit = () => {}} = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [timeCount, setTimeCount] = useState<number>(295); // hardcode

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
        setTimeout(() => {
          setLoading(false);
          RootNavigation.navigate(SCREEN_NAME.USER_INFOR);
          // onSubmit({otp: values.otp});
        }, 1000);
      }}>
      {({handleSubmit}) => (
        <ScrollViewKeyboardAvoidView
          scrollViewProps={{
            style: styles.container,
          }}
          bottomButton={
            <SpinButton
              isLoading={loading}
              title={t('finish')}
              buttonProps={{
                onPress: handleSubmit,
                style: {
                  ...styleSheet.buttonPrimaryStyle,
                  width: SCREEN.width - 40,
                },
              }}
              titleProps={{
                style: {...styleSheet.buttonPrimaryText},
              }}
            />
          }>
          <Text style={styles.description}>{t('sent_otp_email_string')}</Text>
          <Text style={{...styles.description, fontSize: 18, lineHeight: 20}}>
            {value.email}
          </Text>
          <OtpInput name="otp" timeCount={timeCount} />
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={styleSheet.textStyleBasic}>
              {t('have_not_received_the_code')}
            </Text>
            <TouchableOpacity disabled={timeCount !== 0}>
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

export default Step3;

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
    ...styleSheet.textStyleBasic,
    textAlign: 'center',
    marginVertical: 30,
  },
});
