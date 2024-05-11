import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import SpinButton from 'src/components/organisms/buttons/SpinButton';
import {ChangePhoneBodyRequest} from 'src/api/auth/type';
import {Formik} from 'formik';
import {
  FieldTextInput,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {SCREEN} from 'src/help';
import * as yup from 'yup';
import {emailValidate} from 'src/help/validation/input';

type Props = {
  value: ChangePhoneBodyRequest;
  onSubmit?: (value: {email: string}) => void;
};
const Step2 = (props: Props) => {
  const {t} = useTranslation();
  const {value, onSubmit = () => {}} = props;
  const [loading, setLoading] = useState<boolean>(false);

  const schema = yup.object().shape({
    email: emailValidate,
  });
  return (
    <Formik
      initialValues={{email: ''}}
      validationSchema={schema}
      onSubmit={values => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          onSubmit(values);
        }, 1000);
      }}>
      {({handleSubmit, setFieldValue}) => (
        <ScrollViewKeyboardAvoidView
          scrollViewProps={{
            style: styles.container,
          }}
          bottomButton={
            <SpinButton
              isLoading={loading}
              title={t('next')}
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
          <Text style={styleSheet.textStyleBasic}>
            {t('please_fill_email_address')}
          </Text>

          <FieldTextInput
            title={''}
            textInputProps={{
              onChangeText: value => setFieldValue('email', value),
              multiline: false,
              placeholder: t('email_address').toString(),
              style: {
                ...styleSheet.filedText,
                marginTop: 30,
                width: SCREEN.width - 40,
              },
            }}
            name="email"
            isRequired={false}
          />
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
  content: {
    height: '100%',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    paddingBottom: 0,
    height: '100%',
  },
});
