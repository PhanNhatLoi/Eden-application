import * as React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {Formik} from 'formik';
import * as yup from 'yup';
import {FieldTitle} from 'src/components/molecules';
import {SCREEN} from 'src/help';
import {STAFF} from 'src/api/staff/type.d';
import {
  FieldTextInput,
  PasswordInput,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {
  confirmPasswordValidate,
  passwordValidate,
  phoneValidate,
} from 'src/help/validation/input';
import SpinButton from 'src/components/organisms/buttons/SpinButton';
import {Colors} from 'src/styles';
import {checkPhone} from 'src/api/auth/actions';

type Step2Props = {
  onSubmit?: (value: {login: string | null; password: string | null}) => void;
  user: STAFF.Request.StaffUser;
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
};

const Step2 = (props: Step2Props) => {
  const {onSubmit = _ => {}, user, setDirty} = props;
  const {t} = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [typeKeyBoard, setTypeKeyBoard] = React.useState<'number' | 'text'>();

  const schema = yup.object().shape({
    login: phoneValidate,
    password: passwordValidate,
    confirmPassword: confirmPasswordValidate,
  });

  return (
    <Formik
      initialValues={{
        password: '',
        confirmPassword: '',
        login: user.login || '',
      }}
      onSubmit={values => {
        setLoading(true);
        values.login &&
          checkPhone({login: values.login})
            .then(res => {
              onSubmit({
                login: values.login,
                password: values.password,
              });
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
      }}
      validationSchema={schema}>
      {({handleSubmit, handleChange, handleBlur, values, setFieldValue}) => (
        <>
          <ScrollViewKeyboardAvoidView
            typeKeyBoard={typeKeyBoard}
            scrollViewProps={{
              style: {paddingTop: 20},
            }}
            bottomButton={
              <SpinButton
                isLoading={loading}
                title={t('save')}
                buttonProps={{
                  onPress: handleSubmit,
                  style: {
                    ...styleSheet.buttonDefaultStyle,
                    width: SCREEN.width - 40,
                  },
                }}
                titleProps={{
                  style: styleSheet.buttonDefaultText,
                }}
                colorSpiner={Colors.SYS_BUTTON}
              />
            }>
            <FieldTextInput
              autoFocus
              title={t('phone_number') + ':'}
              defaultValue={values.login || undefined}
              textInputProps={{
                onFocus: () => {
                  setTypeKeyBoard('number');
                },
                onChangeText: v => {
                  setFieldValue('login', v);
                  setDirty(true);
                },
                keyboardType: 'number-pad',
                placeholder: t('phone_number').toString(),
                multiline: false,
                style: {
                  ...styleSheet.filedText,
                  width: SCREEN.width - 40,
                },
              }}
              name="login"
              isRequired
            />
            <View style={{marginBottom: 10}}>
              <FieldTitle isRequired title={t('password').toString() + ':'} />
            </View>
            <PasswordInput
              backgroundColor={Colors.WHITE}
              require
              name="password"
              placeholder={t('password').toString()}
            />
            <View style={{marginBottom: 10}}>
              <FieldTitle
                isRequired
                title={t('confirm_password').toString() + ':'}
              />
            </View>
            <PasswordInput
              backgroundColor={Colors.WHITE}
              require
              name="confirmPassword"
              placeholder={t('confirm_password').toString()}
            />
          </ScrollViewKeyboardAvoidView>
        </>
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({});

export default Step2;
