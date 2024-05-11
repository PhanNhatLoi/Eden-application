/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {Formik, FormikProps} from 'formik';
import * as yup from 'yup';
import {SCREEN} from 'src/help';
import {StepButtonSingle} from 'src/components/molecules';
import {useState, useRef, useEffect} from 'react';
import {getMasterData} from 'src/api/appData/actions';
import * as RootNavigation from 'src/navigations/root-navigator';
import {
  AppContainer,
  FieldSelect,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {RouteProp} from '@react-navigation/native';
import {FARM} from 'src/api/farm/type.d';
import {Colors} from 'src/styles';
import {handleSetValue} from '.';
import {optionsType} from 'src/components/organisms/appForm/FieldDropDown';
import {SCREEN_NAME} from 'src/navigations/screen-name';

type Step1Props = {
  route?: RouteProp<{
    params: {
      item: FARM.Request.LandCetification;
      index: number;
    };
  }>;
};

const Step1 = (props: Step1Props) => {
  // const {onSubmit = _ => {}, initValue = ''} = props;
  const {t} = useTranslation();
  const formRef = useRef<FormikProps<any>>(null);
  const schema = yup.object().shape({
    typeId: yup.string().required(() => t('required_field')),
  });
  const [items, setItems] = useState<optionsType[]>([]);
  const {params} = props.route || {};

  useEffect(() => {
    fetchUnit();
  }, []);
  const fetchUnit = async () => {
    try {
      const res = await getMasterData('CERTIFICATION_LAND');
      const format = res.map((obj: any) => ({label: obj.name, value: obj.id}));
      setItems(format);
    } catch (error) {
      console.log('🚀 ~ file: step3.tsx:33 ~ fetchUnit ~ error:', error);
    }
  };

  return (
    <Formik
      initialValues={{typeId: params?.item?.typeId || null}}
      onSubmit={values => {
        handleSetValue(
          {...params?.item, typeId: values.typeId},
          SCREEN_NAME.ADD_LAND_CERTIFICATE_STEP_2 as keyof typeof SCREEN_NAME,
          params?.index,
        );
      }}
      innerRef={formRef}
      validationSchema={schema}>
      {({handleSubmit, setFieldValue, values}) => (
        <AppContainer
          title={t('GCN2')}
          headerRight={
            <TouchableOpacity onPress={() => RootNavigation.goBack()}>
              <Text style={styles.textCancle}>{t('cancel')}</Text>
            </TouchableOpacity>
          }>
          <ScrollViewKeyboardAvoidView
            scrollViewProps={{
              style: styles.container,
            }}
            bottomButton={
              <StepButtonSingle
                subTitile={t('addLandCertificateInfo')}
                disableLeft={false}
                disableRight={false}
                onPressRight={handleSubmit}
              />
            }>
            <View style={styleSheet.row}></View>
            <View style={{width: SCREEN.width - 40}}>
              <FieldSelect
                options={items}
                placeholder={'addGCNQSDĐTitle'}
                title={'addGCNQSDĐTitle'}
                name="typeId"
                require
                defaultValue={(values.typeId && [values.typeId]) || []}
                onChangeValue={items => {
                  setFieldValue(
                    'typeId',
                    (items.length && items[0].value) || null,
                  );
                }}
              />
            </View>
          </ScrollViewKeyboardAvoidView>
        </AppContainer>
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 15,
    flex: 1,
  },
  filedText: {
    ...styleSheet.filedText,
    width: SCREEN.width - 40,
  },
  dropDownContainerStyle: {
    ...styleSheet.filedText,
    width: SCREEN.width - 40,
    height: 150,
  },
  bottomTab: {
    width: SCREEN.width,
    alignItems: 'center',
  },
  textCancle: {
    ...styleSheet.textStyleBold,
    color: Colors.CANCLE_BUTTON,
  },
});

export default Step1;
