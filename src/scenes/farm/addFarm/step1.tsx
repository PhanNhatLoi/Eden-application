import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import * as yup from 'yup';
import {StepButton, StepButtonSingle} from 'src/components/molecules';
import {
  AppContainer,
  FieldMedia,
  FieldTextInput,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {styles} from './styles';
import {phoneValidateNotRequired} from 'src/help/validation/input';
import {styleSheet} from 'src/styles/styleSheet';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import {Text, TouchableOpacity, View} from 'react-native';
import {alertPopup, saveValue, UpdateValue} from '.';

const Step1 = () => {
  const {t} = useTranslation();
  const value = useSelector((state: RootState) => state.farmReducer.farmBody);
  const [dirty, setDirty] = React.useState<boolean>(
    value.name || value.phone || value.avatar ? true : false,
  );
  const formType = value.id ? 'UPDATE' : 'CREATE';
  const schema = yup.object().shape({
    name: yup.string().required(() => t('required_field')),
    phone: phoneValidateNotRequired,
  });
  const [loading, setLoading] = React.useState<boolean>(true);
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <Formik
      initialValues={{
        name: value.name || '',
        avatar: value.avatar || '',
        phone: value.phone || '',
      }}
      onSubmit={values => {
        // onSubmit
        saveValue(
          {
            name: values.name,
            avatar: values.avatar || '',
            phone: values.phone || '',
          },
          1,
        );
      }}
      validationSchema={schema}>
      {({
        handleChange,
        handleBlur,
        values,
        handleSubmit,
        setFieldValue,
        errors,
      }) => (
        <AppContainer
          title={t('farmName')}
          onGoBack={() => {
            alertPopup(formType, values, dirty, 0, t);
          }}
          headerRight={
            !value.id ? (
              <TouchableOpacity
                onPress={() => {
                  alertPopup(formType, values, dirty, 0, t);
                }}>
                <Text style={styles.textCancle}>{t('cancel')}</Text>
              </TouchableOpacity>
            ) : (
              <View style={{width: 20}}></View>
            )
          }>
          <ScrollViewKeyboardAvoidView
            loading={loading}
            scrollViewProps={{
              style: styles.container,
              contentContainerStyle: styles.content,
            }}
            bottomButton={
              <>
                {value.id ? (
                  <StepButtonSingle
                    subTitile={t('addFarm1Info')}
                    title="save"
                    buttonStyle={styleSheet.buttonDefaultStyle}
                    textButtonStyle={styleSheet.buttonDefaultText}
                    onPressRight={() => {
                      Object.keys(errors).length === 0 && UpdateValue(values);
                    }}
                  />
                ) : (
                  <StepButtonSingle
                    subTitile={t('addFarm1Info')}
                    disableLeft={false}
                    disableRight={false}
                    onPressRight={handleSubmit}
                  />
                )}
              </>
            }>
            <FieldTextInput
              autoFocus={!values.name}
              title={t('farmName') + ':'}
              defaultValue={values.name}
              textInputProps={{
                placeholder: t('addFarmName').toString(),
                onChangeText: value => {
                  handleChange('name')(value);
                  setDirty(true);
                },
              }}
              name="name"
              isRequired={true}
            />
            <FieldTextInput
              title={t('phone_number') + ':'}
              defaultValue={values.phone}
              textInputProps={{
                placeholder: t('phone_number').toString(),
                onChangeText: value => {
                  handleChange('phone')(value);
                  setDirty(true);
                },
                keyboardType: 'number-pad',
              }}
              name="phone"
            />
            <FieldMedia
              defaultUri={value.avatar || undefined}
              subTitle={t('avatarTitle')}
              title={t('avatar') + ':'}
              name="avatar"
              onChange={value => {
                setFieldValue('avatar', value);
                setDirty(true);
              }}
              isRequired={false}
            />
          </ScrollViewKeyboardAvoidView>
        </AppContainer>
      )}
    </Formik>
  );
};

export default Step1;
