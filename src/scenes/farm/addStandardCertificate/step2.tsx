import * as React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Colors} from 'src/styles';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {Formik} from 'formik';
import * as yup from 'yup';
import {StepButtonSingle} from 'src/components/molecules';
import * as RootNavigation from 'src/navigations/root-navigator';
import {SCREEN} from 'src/help';
import {
  AppContainer,
  FieldTextInput,
  MultipeImagePicker,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import FieldDatePickerL from 'src/components/organisms/appForm/FieldDatePickerL';
import {getMasterData} from 'src/api/appData/actions';
import {optionsType} from 'src/components/organisms/appForm/FieldDropDown';
import {RouteProp} from '@react-navigation/native';
import {FARM} from 'src/api/farm/type.d';
import {store} from 'src/state/store';
import {
  addCertification,
  updateCertification,
} from 'src/state/reducers/farm/farmSlice';
import {SCREEN_NAME} from 'src/navigations/screen-name';
type value = {
  id?: number | null;
  issuedBy: string;
  issuedDate: string | null;
  expirationDate: string | null;
  evaluationDate: string | null;
  reassessmentDate: string | null;
  images: string | null;
  typeId: number | null;
};
type Step2Props = {
  route?: RouteProp<{
    params: {
      item: FARM.Request.Cetification;
      index: number;
    };
  }>;
};

const Step2 = (props: Step2Props) => {
  // const {onSubmit = _ => {}, preValue, initValue, onChangeType} = props;
  const {t} = useTranslation();
  const [items, setItems] = React.useState<optionsType[]>([]);
  const fetchUnit = async () => {
    try {
      const res = await getMasterData('CERTIFICATION');
      const format = res.map((obj: any) => ({label: obj.name, value: obj.id}));
      setItems(format);
    } catch (error) {
      console.log('🚀 ~ file: step3.tsx:33 ~ fetchUnit ~ error:', error);
    }
  };
  const {params} = props.route || {};

  React.useEffect(() => {
    fetchUnit();
  }, []);

  //Schema formik
  const schema = yup.object().shape({
    issuedBy: yup.string().required(() => t('required_field')),
    issuedDate: yup.date().required(() => t('required_field')),
    // dateExpire: yup.date().required(() => t('required_field')),
    // dateReview: yup.date().required(() => t('required_field')),
    // dateReReview: yup.date().required(() => t('required_field')),
  });

  //init Value
  const initFormValue: value = {
    id: params?.item.id || null,
    issuedBy: params?.item?.issuedBy || '',
    issuedDate: params?.item?.issuedDate || '',
    expirationDate: params?.item?.expirationDate || '',
    evaluationDate: params?.item?.evaluationDate || '',
    reassessmentDate: params?.item?.reassessmentDate || '',
    images: params?.item?.images || '',
    typeId: params?.item.typeId || null,
  };

  // function date + 1
  function addOneDay(date = new Date()) {
    date.setDate(date.getDate() + 1);
    return date;
  }

  return (
    <Formik
      initialValues={initFormValue}
      onSubmit={values => {
        if (params?.index || params?.index === 0) {
          store.dispatch(
            updateCertification({
              body: {...values, typeId: params.item.typeId},
              index: params.index,
            }),
          );
        } else {
          store.dispatch(
            addCertification({
              body: {...values, typeId: params?.item.typeId},
            }),
          );
        }
        RootNavigation.navigate(SCREEN_NAME.ADD_FARM, {step: 9});
      }}
      validationSchema={schema}>
      {({handleSubmit, handleChange, handleBlur, values, setFieldValue}) => {
        return (
          <AppContainer
            title={t('GCN')}
            onGoBack={() => {
              params?.index || params?.index === 0
                ? RootNavigation.navigate(SCREEN_NAME.ADD_FARM, {step: 9})
                : RootNavigation.navigate(SCREEN_NAME.ADD_CERTIFICATE_STEP_1, {
                    index: params?.index,
                    item: values,
                  });
            }}
            headerRight={
              <TouchableOpacity
                onPress={() =>
                  params?.index || params?.index === 0
                    ? RootNavigation.goBack()
                    : RootNavigation.navigate(SCREEN_NAME.ADD_FARM, {step: 9})
                }>
                <Text style={styles.textCancle}>{t('cancel')}</Text>
              </TouchableOpacity>
            }>
            <ScrollViewKeyboardAvoidView
              scrollViewProps={{
                style: styles.container,
                contentContainerStyle: {paddingBottom: 10},
              }}
              bottomButton={
                <StepButtonSingle
                  title="save"
                  disableLeft={false}
                  disableRight={false}
                  onPressRight={handleSubmit}
                />
              }>
              <View style={styles.row}>
                <Text style={styles.title}>{t('GCN')}</Text>
                <TouchableOpacity
                  onPress={() => {
                    RootNavigation.navigate(
                      SCREEN_NAME.ADD_CERTIFICATE_STEP_1,
                      {
                        item: {
                          ...values,
                          typeId: params?.item.typeId,
                        },
                        index: params?.index,
                      },
                    );
                  }}>
                  <Text style={styles.titleBold}>
                    {items.find(f => f.value === params?.item.typeId)?.label}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.line} />
              <FieldDatePickerL
                title={t('dateProvider').toString() + ':'}
                name="issuedDate"
                onChange={(date: string) => {
                  setFieldValue('issuedDate', date);
                }}
                isRequired
                maximumDate={new Date(Date.now()).toISOString()}
                value={values.issuedDate || ''}
              />
              <FieldDatePickerL
                title={t('dateExpire').toString() + ':'}
                name="expirationDate"
                onChange={(date: string) => {
                  setFieldValue('expirationDate', date);
                }}
                // isRequired
                value={values.expirationDate || ''}
                minimumDate={
                  (values.issuedDate &&
                    addOneDay(new Date(values.issuedDate))) ||
                  undefined
                }
                disablePreviousDate
              />
              <FieldDatePickerL
                title={t('dateReview').toString() + ':'}
                name="evaluationDate"
                onChange={(date: string) => {
                  setFieldValue('evaluationDate', date);
                  setFieldValue('reassessmentDate', null);
                }}
                // isRequired
                value={values.evaluationDate || ''}
              />
              <FieldDatePickerL
                title={t('dateReReview').toString() + ':'}
                name="reassessmentDate"
                onChange={(date: string) => {
                  setFieldValue('reassessmentDate', date);
                }}
                // isRequired
                value={values.reassessmentDate || ''}
                minimumDate={
                  (values.evaluationDate &&
                    addOneDay(new Date(values.evaluationDate))) ||
                  undefined
                }
              />
              <FieldTextInput
                title={t('certificateProvider') + ':'}
                defaultValue={values.issuedBy}
                textInputProps={{
                  placeholder: t('certificateProvider').toString(),
                  onChangeText: handleChange('issuedBy'),
                  onBlur: handleBlur('issuedBy'),
                  value: values.issuedBy,
                  multiline: false,
                }}
                name="issuedBy"
                isRequired
              />
              <View style={{width: SCREEN.width - 40}}>
                <MultipeImagePicker
                  // axis="horizontal"
                  maximumImages={5}
                  title={t('upload_GCN') + ':'}
                  name="images"
                  initValue={
                    (values?.images && values?.images?.split('|')) || []
                  }
                  onPickNewImage={images => {
                    setFieldValue(
                      'images',
                      images.map(image => image.uri).join('|'),
                    );
                  }}
                />
              </View>
            </ScrollViewKeyboardAvoidView>
          </AppContainer>
        );
      }}
    </Formik>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 15,
    flex: 1,
  },
  title: {
    ...styleSheet.textStyleBasic,
    fontSize: 14,
  },
  titleBold: {
    ...styleSheet.textStyleBold,
    color: Colors.SYS_BUTTON,
  },
  row: {
    ...styleSheet.row,
    marginTop: 10,
    justifyContent: 'space-between',
    marginBottom: 21,
  },
  line: {
    height: 1,
    width: SCREEN.width - 40,
    backgroundColor: Colors.GRAY_MEDIUM,
    marginBottom: 10,
  },
  bottomTab: {
    width: SCREEN.width,
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
  textCancle: {
    ...styleSheet.textStyleBold,
    color: Colors.CANCLE_BUTTON,
  },
});

export default Step2;
