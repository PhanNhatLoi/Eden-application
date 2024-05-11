import {Text, View} from 'react-native';
import React, {useState} from 'react';
import {t} from 'i18next';
import {styles} from '../types';
import {styleSheet} from 'src/styles/styleSheet';
import {Field, FieldProps, Formik} from 'formik';
import ImageUpload from 'src/components/organisms/ui/Image/ImageUpload';
import {activeUser, finishRegister} from 'src/api/auth/actions';
import {Colors} from 'src/styles';
import {ScrollViewKeyboardAvoidView} from 'src/components/organisms';
import {StepButtonSingle} from 'src/components/molecules';
import {AUTH} from 'src/api/auth/type';

type Props = {
  handleSubmit: (value: {avatar: string}) => void;
  data: AUTH.REGISTER.Request.Register;
};
const UploadAvatar = (props: Props) => {
  const {handleSubmit = () => {}, data} = props;
  const [loading, setLoading] = useState<boolean>(false);
  const onFinish = (value: {avatar: string}) => {
    setLoading(true);
    const dataSubmit: AUTH.REGISTER.Request.UserInit = {
      login: data.login,
      password: data.password,
      lastName: data.name?.trim() || null,
      firstName: data.shortName?.trim() || null,
      activationKey: data.activationKey,
    };
    finishRegister(dataSubmit)
      .then(res => {
        handleSubmit({avatar: value.avatar});
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Formik initialValues={{avatar: ''}} onSubmit={onFinish}>
      {({handleSubmit}) => (
        <Field name="avatar">
          {({
            field, // { name, value, onChange, onBlur }
            form: {touched, errors}, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
            meta,
          }: FieldProps) => {
            return (
              <ScrollViewKeyboardAvoidView
                scrollViewProps={{
                  style: styles.container,
                }}
                bottomButton={
                  <StepButtonSingle
                    loading={loading}
                    title="finish"
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
                <Text style={styles.description}>{t('add_avatar')}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}>
                  <ImageUpload
                    height={158}
                    width={158}
                    shape="circle"
                    onChange={field.onChange('avatar')}
                  />
                </View>
              </ScrollViewKeyboardAvoidView>
            );
          }}
        </Field>
      )}
    </Formik>
  );
};

export default UploadAvatar;
