import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  AppContainer,
  FieldSelect,
  FieldTextInput,
  FieldTextInputWithUnit,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {useTranslation} from 'react-i18next';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import {Formik} from 'formik';
import * as yup from 'yup';
import {StepButtonSingle} from 'src/components/molecules';
import {
  getManufacturer,
  getCategoryMaterial,
  getUnit,
} from 'src/api/appData/actions';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import {useDispatch} from 'react-redux';
import {updateMaterials} from 'src/state/reducers/season/seasonSlice';
import {SEASON} from 'src/api/season/type.d';

type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<{
    params: {value: SEASON.Request.Material | null; index: number};
  }>;
};
type OptionType = {
  value: number;
  label: string;
};

type initDataType = {
  categoryId: number | null;
  categoryName: string | null;
  supplierId: number | null;
  supplierName: string | null;
  materialText: string | null;
  quantity: number | null;
  unitId: number | null;
  unitNameOther: string | null;
};

type ParamsType = {
  manufacturerId?: number;
  categoryId?: number;
};
const AddMaterial = (props: Props) => {
  const {navigation} = props;
  const {t} = useTranslation();
  const value = props.route?.params?.value || null;
  const index = props.route.params.index;
  const [materialType, setMaterialType] = useState<OptionType[]>([]);
  const [manufacturer, setManufacturer] = useState<OptionType[]>([]);
  const [units, setUnits] = useState<OptionType[]>([]);
  const [loadingMafu, setLoadingUnitMafu] = useState<boolean>(false);
  const [loadingMaterial, setLoadingMaterial] = useState<boolean>(false);

  const materials = useSelector((state: RootState) => state.season.materials);
  const dispatch = useDispatch();

  const initData: initDataType = {
    categoryId: value?.categoryId || null,
    categoryName: value?.categoryName || '',
    supplierId: value?.supplierId || null,
    supplierName: value?.supplierName || '',
    materialText: value?.materialText || '',
    quantity: value?.quantity || 0,
    unitId: value?.unitId || null,
    unitNameOther: value?.unitNameOther || '',
  };

  useEffect(() => {
    setLoadingUnitMafu(true);
    setLoadingMaterial(true);
    fetchCategoryMaterial();
    fetchUnit();
    fetchManufacturer();
  }, []);

  const fetchCategoryMaterial = () => {
    getCategoryMaterial()
      .then(res => {
        setMaterialType(() => {
          return res.map((m: {id: number; name: string}) => {
            return {
              value: m.id,
              label: m.name,
            };
          });
        });
      })
      .catch(err => console.log(err))
      .finally(() => setLoadingMaterial(false));
  };
  const fetchUnit = () => {
    getUnit('MASS')
      .then(res => {
        setUnits(() => {
          return res.map((m: {id: number; shortName: string}) => {
            return {
              value: m.id,
              label: m.shortName,
            };
          });
        });
      })
      .catch(err => console.log(err))
      .finally(() => setLoadingUnitMafu(false));
  };

  const fetchManufacturer = () => {
    getManufacturer()
      .then(res => {
        setManufacturer(() => {
          return res.map((m: any) => {
            return {
              value: m.id,
              label: m.profile.name,
            };
          });
        });
      })
      .catch(err => console.log(err))
      .finally(() => {});
  };

  const schema = yup.object().shape({
    quantity: yup
      .number()
      .moreThan(0, t('min_value_0').toString())
      .typeError(t('error_format_text').toString()),
    materialText: yup.string().required(t('required_field').toString()),
  });

  return (
    <AppContainer
      title={t('Addmaterials')}
      headerRight={
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.textCancle}>{t('cancel')}</Text>
        </TouchableOpacity>
      }>
      <Formik
        initialValues={initData}
        onSubmit={values => {
          const newValue: SEASON.Request.Material = {
            unitId: values.unitId,
            categoryId: values.categoryId,
            supplierId: values.supplierId,
            quantity: Number(values.quantity),
            categoryName: materialType.find(f => f.value === values.categoryId)
              ?.label,
            supplierName: manufacturer.find(f => f.value === values.supplierId)
              ?.label,
            materialText: values.materialText,
            unitNameOther: values.unitNameOther || '',
          };

          let newMaterials: SEASON.Request.Material[] = materials;
          if (index >= 0)
            newMaterials = materials.map((m, i) => {
              return i === index ? newValue : m;
            });
          else newMaterials = [...materials, newValue];
          dispatch(updateMaterials(newMaterials));
          navigation.goBack();
        }}
        validationSchema={schema}>
        {({handleChange, handleBlur, values, handleSubmit, setFieldValue}) => {
          return (
            <>
              <ScrollViewKeyboardAvoidView
                scrollViewProps={{
                  style: styles.container,
                  contentContainerStyle: {paddingBottom: 10},
                }}
                bottomButton={
                  <StepButtonSingle
                    title="save"
                    subTitile={t('addSeason8Info')}
                    disableLeft={false}
                    disableRight={false}
                    buttonStyle={{
                      ...styleSheet.buttonDefaultStyle,
                    }}
                    textButtonStyle={styleSheet.buttonDefaultText}
                    onPressRight={() => {
                      Keyboard.dismiss();
                      handleSubmit();
                    }}
                  />
                }>
                <FieldSelect
                  loading={loadingMaterial}
                  options={materialType}
                  placeholder={'materialType'}
                  title={t('materialType') + ':'}
                  name="categoryId"
                  // require
                  defaultValue={
                    (initData.categoryId && [initData.categoryId]) || []
                  }
                  onChangeValue={items => {
                    setFieldValue(
                      'categoryId',
                      (items.length && items[0].value) || null,
                    );
                  }}
                />

                <FieldSelect
                  loading={loadingMafu}
                  options={manufacturer}
                  placeholder={'select_manufacturer'}
                  title={t('select_manufacturer') + ':'}
                  name="supplierId"
                  // require
                  defaultValue={
                    (initData.supplierId && [initData.supplierId]) || []
                  }
                  onChangeValue={items => {
                    setFieldValue(
                      'supplierId',
                      (items.length && items[0].value) || null,
                    );
                  }}
                />
                <FieldTextInput
                  title={t('product_material') + ':'}
                  defaultValue={values.materialText || ''}
                  textInputProps={{
                    onChangeText: handleChange('materialText'),
                    placeholder: t('product_material').toString(),
                  }}
                  isRequired
                  name="materialText"
                />

                <FieldTextInputWithUnit
                  title={t('expectedNumber') + ':'}
                  name="quantity"
                  unit="MASS"
                  supportOtherUnit
                  onChangeUnitName={unitName =>
                    setFieldValue('unitNameOther', unitName)
                  }
                  unitName={values.unitNameOther || ''}
                  defaultUnitValue={values.unitId || undefined}
                  onChangeUnit={unitId => setFieldValue('unitId', unitId)}
                  textInputProps={{
                    onChangeText: handleChange('quantity'),
                    onBlur: handleBlur('quantity'),
                    defaultValue:
                      (values.quantity && values.quantity.toString()) || '',
                    keyboardType: 'decimal-pad',
                  }}
                />
              </ScrollViewKeyboardAvoidView>
            </>
          );
        }}
      </Formik>
    </AppContainer>
  );
};

export default AddMaterial;

const styles = StyleSheet.create({
  textCancle: {
    ...styleSheet.textStyleBold,
    color: Colors.CANCLE_BUTTON,
  },
  content: {
    paddingBottom: 50,
  },
  container: {
    paddingTop: 23,
    paddingHorizontal: 20,
  },
});
