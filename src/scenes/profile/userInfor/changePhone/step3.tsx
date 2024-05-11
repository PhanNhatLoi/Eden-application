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
import * as RootNavigation from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import * as yup from 'yup';
import {phoneValidate} from 'src/help/validation/input';

type Props = {
  value: ChangePhoneBodyRequest;
  onSubmit?: (value: any) => void;
};
const Step3 = (props: Props) => {
  const {t} = useTranslation();
  const {value, onSubmit = () => {}} = props;
  const [loading, setLoading] = useState<boolean>(false);

  const schema = yup.object().shape({
    phone: phoneValidate,
  });
  return (
    <Formik
      initialValues={{phone: ''}}
      validationSchema={schema}
      onSubmit={values => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          RootNavigation.navigate(SCREEN_NAME.USER_INFOR);
          // onSubmit({phone: values.phone});
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
          <Text style={styleSheet.textStyleBasic}>
            {t('please_fill_phone_number')}
          </Text>

          <FieldTextInput
            title={''}
            textInputProps={{
              onChangeText: value => setFieldValue('phone', value),
              keyboardType: 'number-pad',
              multiline: false,
              placeholder: t('phone_number').toString(),
              style: {
                ...styleSheet.filedText,
                marginTop: 30,
                width: SCREEN.width - 40,
              },
            }}
            name="phone"
            isRequired={false}
          />
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
