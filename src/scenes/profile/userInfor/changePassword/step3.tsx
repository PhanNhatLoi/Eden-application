import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {ChangePhoneBodyRequest} from 'src/api/auth/type';
import {Formik} from 'formik';
import {
  PasswordInput,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import * as RootNavigation from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import * as yup from 'yup';
import {
  confirmPasswordValidate,
  passwordValidate,
} from 'src/help/validation/input';
import {StepButtonSingle} from 'src/components/molecules';
import {resetPassword} from 'src/api/auth/actions';
import {useDispatch, useSelector} from 'react-redux';
import {pushNotify} from 'src/state/reducers/Notification/notify';
import {RootState, store} from 'src/state/store';
import {alertPopup} from 'src/scenes/farm/addFarm';
import {
  changeLoginTouchId,
  saveUserLogin,
} from 'src/state/reducers/authUser/authSlice';

type Props = {
  value: ChangePhoneBodyRequest;
  onSubmit?: (value: any) => void;
};
const Step3 = (props: Props) => {
  const {t} = useTranslation();
  const {value, onSubmit = () => {}} = props;
  const [loading, setLoading] = useState<boolean>(false);
  const dishpatch = useDispatch();
  const loginTouchId = useSelector(
    (state: RootState) => state.authReducer.loginTouchId,
  );

  const schema = yup.object().shape({
    password: passwordValidate,
    confirmPassword: confirmPasswordValidate,
    oldPassword: passwordValidate,
  });
  return (
    <Formik
      initialValues={{
        password: '',
        confirmPassword: '',
        oldPassword: '',
      }}
      onSubmit={values => {
        if (loginTouchId.user.password !== values.oldPassword) {
          store.dispatch(
            pushNotify({
              title: t('old_password_wrong'),
              message: t('old_password_wrong'),
            }),
          );
          return;
        }
        setLoading(true);
        resetPassword({
          resetKey: value.activationKey,
          newPassword: values.password,
        })
          .then(res => {
            dishpatch(
              saveUserLogin({
                username: loginTouchId.user.username,
                password: values.password,
              }),
            );
            dishpatch(changeLoginTouchId(undefined));
            dishpatch(
              pushNotify({
                message: 'change_password_success',
                title: 'change_password',
              }),
            );
            RootNavigation.navigate(SCREEN_NAME.USER_INFOR);
          })
          .catch(err => console.log(err))
          .finally(() => setLoading(false));
      }}
      validationSchema={schema}>
      {({handleSubmit}) => (
        <ScrollViewKeyboardAvoidView
          scrollViewProps={{
            style: styles.container,
          }}
          bottomButton={
            <StepButtonSingle
              title="finish"
              onPressRight={handleSubmit}
              loading={loading}
            />
          }>
          <Text style={styles.description}>{t('fill_new_password')}</Text>
          <PasswordInput
            require
            name="oldPassword"
            placeholder={t('old_password').toString()}
          />
          <PasswordInput
            require
            name="password"
            placeholder={t('password').toString()}
          />
          <PasswordInput
            require
            name="confirmPassword"
            placeholder={t('confirm_password').toString()}
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
    height: '100%',
    width: '100%',
  },
  description: {
    ...styleSheet.textStyleBasic,
    textAlign: 'center',
    marginVertical: 30,
  },
});
