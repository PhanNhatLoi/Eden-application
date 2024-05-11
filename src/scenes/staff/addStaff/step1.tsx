import * as React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  Keyboard,
} from 'react-native';
import {Colors} from 'src/styles';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {ErrorMessage, Formik} from 'formik';
import * as yup from 'yup';
import {SCREEN} from 'src/help';
import {STAFF} from 'src/api/staff/type.d';
import {
  FieldTextInput,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {ICON} from 'src/assets';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SpinButton from 'src/components/organisms/buttons/SpinButton';
import {
  InitProfileEmployees,
  UpdateProfileStaff,
  createStaff,
} from 'src/api/staff/actions';
import * as RootNavigation from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {loginApi} from 'src/api/auth/actions';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';

type Step1Props = {
  onSubmit?: (value: STAFF.Request.StaffProfile) => void;
  profile: STAFF.Request.StaffProfile;
  user: STAFF.Request.StaffUser;
  type: 'CREATE' | 'UPDATE';
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
};

const Step1 = (props: Step1Props) => {
  const {onSubmit = _ => {}, profile, user, setDirty} = props;
  const {t} = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const schema = yup.object().shape({
    phone: yup.string().required(() => t('setting_account')),
    name: yup.string().required(() => t('required_field')),
    shortName: yup.string().required(() => t('required_field')),
    dayWorks: yup
      .number()
      .moreThan(0, t('min_value_0').toString())
      .max(31, t('maximum_value_').toString() + '31')
      .typeError(t('error_format_text').toString())
      .integer(t('error_format_text_integer').toString()),
  });

  const handleSave = (values: STAFF.Request.StaffProfile) => {
    setLoading(true);
    if (props.type === 'UPDATE') {
      // update staff
      UpdateProfileStaff({...values, dayWorks: values.dayWorks || null})
        .then(res => {
          RootNavigation.navigate(SCREEN_NAME.STAFF, {refresh: true});
        })
        .catch(err => console.log(err));
    } else {
      createStaff(user)
        .then(res => {
          loginApi({
            username: user.login || '',
            password: user.password || '',
          }).then(res => {
            InitProfileEmployees(
              {
                ...values,
                dayWorks: values.dayWorks === 0 ? null : values.dayWorks,
                gender: null,
              },
              res.id_token,
            )
              .then(res => {
                RootNavigation.navigate(SCREEN_NAME.STAFF, {refesh: true});
              })
              .catch(err => {
                console.log(err);
                setLoading(false);
              });
          });
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <Formik
      initialValues={{
        ...profile,
        dayWorks: profile.dayWorks || '',
      }}
      onSubmit={values => {
        handleSave(values);
      }}
      validationSchema={schema}>
      {({values, handleSubmit, setFieldValue}) => (
        <>
          <ScrollViewKeyboardAvoidView
            scrollViewProps={{
              style: {paddingTop: 20},
              contentContainerStyle: styles.content,
            }}
            bottomButton={
              <SpinButton
                isLoading={loading}
                title={t('save')}
                buttonProps={{
                  onPress: () => {
                    Keyboard.dismiss();
                    handleSubmit();
                  },
                  style: {
                    ...styleSheet.buttonDefaultStyle,
                    width: SCREEN.width - 40,
                    marginTop: 10,
                  },
                }}
                titleProps={{
                  style: styleSheet.buttonDefaultText,
                }}
                colorSpiner={Colors.SYS_BUTTON}
              />
            }>
            <View style={styles.container}>
              <FieldTextInput
                title={t('first_name') + ':'}
                defaultValue={values.name || undefined}
                textInputProps={{
                  onChangeText: v => {
                    setFieldValue('name', v.trim());
                    setDirty(true);
                  },
                  placeholder: t('first_name').toString(),
                }}
                name="name"
                isRequired
              />
              <FieldTextInput
                title={t('last_name') + ':'}
                defaultValue={values.shortName || undefined}
                textInputProps={{
                  onChangeText: v => {
                    setFieldValue('shortName', v.trim());
                    setDirty(true);
                  },
                  placeholder: t('last_name').toString(),
                  multiline: false,
                  style: {
                    ...styleSheet.filedText,
                    // width: SCREEN.width - 40,
                  },
                }}
                name="shortName"
                isRequired
              />
              <FieldTextInput
                title={t('job') + ':'}
                defaultValue={values.job || undefined}
                textInputProps={{
                  onChangeText: v => {
                    setFieldValue('job', v);
                    setDirty(true);
                  },
                  placeholder: t('fill_job').toString(),
                  multiline: false,
                  style: {
                    ...styleSheet.filedText,
                    width: SCREEN.width - 40,
                  },
                }}
                name="job"
                isRequired={false}
              />
              <FieldTextInput
                title={t('work_date_of_month') + ':'}
                defaultValue={
                  (values.dayWorks && values.dayWorks.toString()) || ''
                }
                type="integer"
                textInputProps={{
                  maxLength: 2,
                  onChangeText: v => {
                    setFieldValue('dayWorks', v);
                    setDirty(true);
                  },
                  // keyboardType: 'decimal-pad',
                  placeholder: t('fill_work_date_of_month').toString(),
                  multiline: false,
                  style: {
                    ...styleSheet.filedText,
                    width: SCREEN.width - 40,
                  },
                }}
                name="dayWorks"
                isRequired={false}
              />
              <FieldTextInput
                title={t('salary_on_month') + ' (VND):'}
                defaultValue={(values.salary && values.salary.toString()) || ''}
                type="integer"
                textInputProps={{
                  maxLength: 11,
                  onChangeText: v => {
                    setFieldValue('salary', v);
                    setDirty(true);
                  },
                  placeholder: t('fill_salary_on_month').toString(),
                  multiline: false,
                  style: {
                    ...styleSheet.filedText,
                    width: SCREEN.width - 40,
                  },
                }}
                name="salary"
                isRequired={false}
              />
            </View>
            <TouchableOpacity
              disabled={props.type === 'UPDATE'}
              style={styles.loginCard}
              onPress={() => {
                onSubmit(values);
              }}>
              <View style={styles.row}>
                <Text style={styleSheet.textStyleBasic}>{t('login_user')}</Text>
                <Text style={styleSheet.textStyleBasic}>
                  {profile.phone || t('settings')}
                </Text>
              </View>
              {!(props.type === 'UPDATE') && <IconFigma name="arrow_r" />}
            </TouchableOpacity>
            <Text
              style={[
                styleSheet.textStyleBasic,
                {
                  marginHorizontal: 20,
                  marginTop: 10,
                  color: Colors.CANCLE_BUTTON,
                },
              ]}>
              <ErrorMessage name={'phone'} />
            </Text>
          </ScrollViewKeyboardAvoidView>
        </>
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    paddingBottom: 30,
  },
  loginCard: {
    height: 60,
    width: SCREEN.width,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    paddingHorizontal: 22,
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    paddingRight: 12,
  },
});

export default Step1;
