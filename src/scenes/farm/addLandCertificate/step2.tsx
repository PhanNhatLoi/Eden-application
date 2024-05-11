import * as React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from 'src/styles';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {Formik} from 'formik';
import * as yup from 'yup';
import {Line, StepButtonSingle} from 'src/components/molecules';
import {SCREEN} from 'src/help';
import * as RootNavigation from 'src/navigations/root-navigator';
import {
  AppContainer,
  FieldSelect,
  FieldTextInput,
  FieldTextInputWithUnit,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {useEffect, useState} from 'react';
import {getMasterData} from 'src/api/appData/actions';
import {FARM} from 'src/api/farm/type.d';
import {RouteProp} from '@react-navigation/native';
import {handleSetValue} from '.';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {optionsType} from 'src/components/organisms/appForm/FieldDropDown';
type Props = {
  route?: RouteProp<{
    params: {
      item: FARM.Request.LandCetification;
      index: number;
    };
  }>;
};

const Step2 = (props: Props) => {
  // const {onSubmit = _ => {}, value} = props;
  const [loading, setLoading] = useState<boolean>(true);
  const {t} = useTranslation();
  const schema = yup.object().shape({
    areageValue: yup.number().typeError(t('error_format_text').toString()),
    ownerNameOther: yup.string().required(t('required_field').toString()),
    landLotNo: yup.string().required(t('required_field').toString()),
  });
  const [items, setItems] = useState<optionsType[]>([]);
  const [itemsType, setItemsType] = useState<optionsType[]>([]);
  // const [owner, setOwner] = useState([]);
  const {params} = props.route || {};
  useEffect(() => {
    fetchUnit();
    fetchType();
  }, []);

  const fetchUnit = async () => {
    try {
      const res = await getMasterData('FORM_OF_USES');
      const format = res.map((obj: any) => ({label: obj.name, value: obj.id}));
      setItems(format);
      setTimeout(() => {
        setLoading(false);
      }, 700);
    } catch (error) {
      console.log('🚀 ~ file: step2 ~ fetchUnit ~ error:', error);
    }
  };

  const fetchType = async () => {
    try {
      const res = await getMasterData('CERTIFICATION_LAND');
      const format = res.map((obj: any) => ({label: obj.name, value: obj.id}));
      setItemsType(format);
    } catch (error) {
      console.log('🚀 ~ file: step3.tsx:33 ~ fetchUnit ~ error:', error);
    }
  };

  const initValue = {
    landLotNo: params?.item?.landLotNo || '',
    areageValue: params?.item?.areage.value || '',
    areageUnit: params?.item?.areage.unitId || null,
    formOfUsesIds: params?.item?.formOfUsesIds || [],
    ownerNameOther: params?.item.ownerNameOther || '',
  };
  // console.log(initValue);

  return (
    <Formik
      initialValues={initValue}
      onSubmit={values => {
        handleSetValue(
          {
            id: params?.item.id || null,
            landLotNo: values.landLotNo,
            ownerNameOther: values.ownerNameOther,
            areage: {
              id: params?.item.areage.id || null,
              unitId: Number(values.areageUnit),
              value: Number(values.areageValue),
            },
            formOfUsesIds: values.formOfUsesIds,
            typeId: params?.item.typeId,
            images: params?.item.images,
          },

          SCREEN_NAME.ADD_LAND_CERTIFICATE_STEP_3 as keyof typeof SCREEN_NAME,
          params?.index,
        );
      }}
      validationSchema={schema}>
      {({handleSubmit, handleChange, handleBlur, values, setFieldValue}) => (
        <AppContainer
          title={t('GCNInfo2')}
          onGoBack={() => {
            if (params?.index || params?.index === 0) {
              RootNavigation.navigate(SCREEN_NAME.ADD_FARM, {step: 10});
            } else {
              handleSetValue(
                {
                  id: params?.item.id || null,
                  landLotNo: values.landLotNo,
                  ownerNameOther: values.ownerNameOther,
                  areage: {
                    id: params?.item.areage.id || null,
                    unitId: Number(values.areageUnit),
                    value: Number(values.areageValue),
                  },
                  formOfUsesIds: values.formOfUsesIds,
                  images: params?.item.images,
                  typeId: params?.item.typeId,
                },
                SCREEN_NAME.ADD_LAND_CERTIFICATE_STEP_1 as keyof typeof SCREEN_NAME,
                params?.index,
              );
            }
          }}
          headerRight={
            <TouchableOpacity
              onPress={() =>
                RootNavigation.navigate(SCREEN_NAME.ADD_FARM, {step: 10})
              }>
              <Text style={styles.textCancle}>{t('cancel')}</Text>
            </TouchableOpacity>
          }>
          <ScrollViewKeyboardAvoidView
            loading={loading}
            scrollViewProps={{
              style: styles.container,
            }}
            bottomButton={
              <StepButtonSingle
                subTitile={''}
                disableLeft={false}
                disableRight={false}
                onPressRight={handleSubmit}
              />
            }>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 21,
              }}>
              <Text style={{...styleSheet.textStyleBasic, fontSize: 14}}>
                {t('GCN2')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  RootNavigation.navigate(
                    SCREEN_NAME.ADD_LAND_CERTIFICATE_STEP_1,
                    {
                      item: {
                        id: params?.item.id || null,
                        landLotNo: values.landLotNo,
                        ownerNameOther: values.ownerNameOther,
                        areage: {
                          id: params?.item.areage.id || null,
                          unitId: Number(values.areageUnit),
                          value: Number(values.areageValue),
                        },
                        formOfUsesIds: values.formOfUsesIds,
                        images: params?.item.images,
                        typeId: params?.item.typeId,
                      },
                      index: params?.index,
                    },
                  );
                }}>
                <Text style={styles.titleBold}>
                  {itemsType.find(f => f.value === params?.item.typeId)?.label}
                </Text>
              </TouchableOpacity>
            </View>
            <Line colors={Colors.GRAY_02} />
            <FieldTextInput
              autoFocus={!values.landLotNo}
              title={t('landCode') + ':'}
              isRequired
              defaultValue={values.landLotNo}
              textInputProps={{
                placeholder: t('landCode').toString(),
                onChangeText: handleChange('landLotNo'),
                onBlur: handleBlur('landLotNo'),
              }}
              name="landLotNo"
            />
            <FieldTextInputWithUnit
              title={t('totalArea') + ':'}
              name="areageValue"
              unit="ACREAGE"
              defaultUnitValue={values.areageUnit || undefined}
              onChangeUnit={value => {
                value && handleChange('areageUnit')(value.toString());
              }}
              textInputProps={{
                placeholder: t('totalArea').toString(),
                onChangeText: v => setFieldValue('areageValue', v),
                defaultValue: values.areageValue.toString() || '',
              }}
            />
            <FieldSelect
              // multi
              options={items}
              placeholder={'landStatus'}
              title={t('landStatus') + ':'}
              name="formOfUses"
              defaultValue={values.formOfUsesIds || []}
              onChangeValue={items =>
                setFieldValue(
                  'formOfUsesIds',
                  items.map(m => m.value),
                )
              }
            />
            {/* <FieldSelect
              options={owner}
              placeholder={'landOwner'}
              title={'landOwner'}
              name="ownerId"
              require
              defaultValue={(values.ownerId && [values.ownerId]) || []}
              onChangeValue={items =>
                setFieldValue(
                  'ownerId',
                  (items.length && items[0].value) || null,
                )
              }
            /> */}
            <FieldTextInput
              title={t('landOwner') + ':'}
              isRequired
              defaultValue={values.ownerNameOther}
              textInputProps={{
                placeholder: t('landOwner').toString(),
                onChangeText: handleChange('ownerNameOther'),
                onBlur: handleBlur('ownerNameOther'),
              }}
              name="ownerNameOther"
            />
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
  row: {
    ...styleSheet.row,
    marginTop: 10,
  },
  textButton: {
    ...styleSheet.textStyleBold,
    color: Colors.SYS_BUTTON,
    fontSize: 13,
  },
  bottomTab: {
    width: SCREEN.width,
    alignItems: 'center',
  },
  locationButton: {
    ...styleSheet.buttonDefaultStyle,
    width: 150,
  },
  latlng: {
    ...styleSheet.textStyleSub,
    fontSize: 14,
  },
  icon: {
    width: 20,
    height: 20,
  },
  indexFront: {
    zIndex: 3,
  },
  indexFront1: {
    zIndex: 2,
  },
  textCancle: {
    ...styleSheet.textStyleBold,
    color: Colors.CANCLE_BUTTON,
  },
  titleBold: {
    ...styleSheet.textStyleBold,
    color: Colors.SYS_BUTTON,
  },
});

export default Step2;
