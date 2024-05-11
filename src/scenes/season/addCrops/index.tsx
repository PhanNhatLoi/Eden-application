import {Keyboard, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import {Formik} from 'formik';
import {
  AppContainer,
  FieldSelect,
  FieldTextInputWithUnit,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {getCertificateOfLands} from 'src/api/season/actions';
import {SEASON} from 'src/api/season/type.d';
import * as yup from 'yup';
import {StepButtonSingle} from 'src/components/molecules';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {createCrops} from 'src/state/reducers/season/seasonSlice';
import {getFarmDetails} from 'src/api/farm/actions';
import {RootState} from 'src/state/store';
import {FARM} from 'src/api/farm/type.d';
import {getMasterData} from 'src/api/appData/actions';

type optionsType = {
  label: string;
  value: number;
};

type Props = {
  route?: RouteProp<{
    params: {farmId: number; data?: SEASON.Request.Season};
  }>;
  navigation: NavigationProp<ParamListBase>;
};

export type initDataType = {
  masterDataTypeId: number | null;
  farmProductId: number | null;
  grossAreaUnit: number | null;
  grossArea: number | null;
  certificateOfLandIds: number[];
  grossYieldUnit: number | null;
  grossYield: number | null;
  businessType: {
    id: number | null;
    name: string | null;
    masterDataTypeId: number | null;
  };
};

const AddCrops = (props: Props) => {
  const {navigation} = props;
  const farmId = props.route?.params.farmId;
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [productsFarm, setProductsFarm] = useState<any[]>([]);
  const [businessTypes, setBusinessTypes] = useState<optionsType[]>([]);
  const [cropsList, setCropsList] = useState<optionsType[]>([]);
  const [certificateOfLand, setCertificateOfLand] = useState<optionsType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const crops = useSelector((state: RootState) => state?.season?.crops);
  const sysAccountId = useSelector(
    (state: RootState) => state.authReducer.sysAccountIdOwer || null,
  );

  const initData: initDataType = {
    farmProductId: crops?.productsOfFarm?.farmProductId || null,
    masterDataTypeId: crops?.productsOfFarm?.masterDataTypeId || null,
    grossAreaUnit: crops?.grossArea.unitId || null,
    grossArea: crops?.grossArea.value || null,
    grossYieldUnit: crops?.grossYield.unitId || null,
    grossYield: crops?.grossYield.value || null,
    certificateOfLandIds: crops?.certifycateOfLandIds || [],
    businessType: crops?.businessType || {
      id: null,
      name: null,
      masterDataTypeId: null,
    },
  };

  useEffect(() => {
    setLoading(true);
    farmId &&
      getFarmDetails(farmId, sysAccountId).then(
        (res: FARM.Response.FarmDetails) => {
          setProductsFarm(res.products);
          setCropsList(() =>
            res?.products?.map((m: any) => {
              return {
                label: m.productType?.name,
                value: m.id,
              };
            }),
          );
        },
      );

    getMasterData('CULTIVATION')
      .then(res => {
        setBusinessTypes(
          res.map((m: any) => {
            return {
              label: m.name,
              value: m.id,
            };
          }),
        );
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (farmId) {
      setLoading(true);
      getCertificateOfLands(farmId)
        .then(res => {
          setLoading(false);
          setCertificateOfLand(() =>
            res.map((m: SEASON.Response.CertificateOfLands) => {
              return {
                label: m.landLotNo,
                value: m.id,
              };
            }),
          );
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
        });
    }
  }, [farmId]);

  const handleOnsubmit = (value: initDataType) => {
    const CropsData: SEASON.Basic.Crops = {
      grossArea: {
        value: Number(value.grossArea),
        unitId: Number(value.grossAreaUnit),
      },
      grossYield: {
        value: Number(value.grossYield),
        unitId: Number(value.grossYieldUnit),
      },
      productsOfFarm: {
        farmProductId: value.farmProductId,
        name:
          productsFarm.find(f => f.id === value.farmProductId)?.productType
            ?.name || '',
        masterDataTypeId:
          productsFarm.find(f => f.id === value.farmProductId)?.productType
            ?.id || null,
      },
      certifycateOfLandIds: value.certificateOfLandIds,
      businessType: value.businessType,
    };
    // // to do save data
    // console.log(CropsData);
    dispatch(createCrops(CropsData));
    navigation.goBack();
  };

  const schema = yup.object().shape({
    farmProductId: yup.string().required(() => t('required_field')),
    businessType: yup.object().shape({
      masterDataTypeId: yup.string().required(() => t('required_field')),
    }),
    grossArea: yup
      .number()
      .moreThan(0, t('min_value_0').toString())
      .typeError(t('error_format_text').toString())
      .required(t('required_field').toString()),
    grossYield: yup
      .number()
      .moreThan(0, t('min_value_0').toString())
      .typeError(t('error_format_text').toString())
      .required(t('required_field').toString()),
  });

  return (
    <AppContainer
      title={t('crops')}
      headerRight={
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.textCancle}>{t('cancel')}</Text>
        </TouchableOpacity>
      }>
      <Formik
        initialValues={initData}
        onSubmit={handleOnsubmit}
        validationSchema={schema}>
        {({handleChange, handleBlur, values, handleSubmit, setFieldValue}) => {
          return (
            <ScrollViewKeyboardAvoidView
              loading={loading}
              scrollViewProps={{
                style: styles.container,
              }}
              bottomButton={
                <StepButtonSingle
                  title="save"
                  loading={loading}
                  subTitile={t('addCropsInfo')}
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
                loading={loading}
                options={cropsList}
                placeholder={'crops_select'}
                title={t('crops_select') + ':'}
                name="farmProductId"
                require
                defaultValue={
                  (initData.farmProductId && [initData.farmProductId]) || []
                }
                onChangeValue={items => {
                  setFieldValue(
                    'farmProductId',
                    (items.length && items[0].value) || null,
                  );
                }}
              />

              <FieldTextInputWithUnit
                title={t('totalArea') + ':'}
                name="grossArea"
                unit="ACREAGE"
                isRequired={true}
                defaultUnitValue={
                  (values.grossAreaUnit && values.grossAreaUnit) || ''
                }
                onChangeUnit={v => {
                  setFieldValue('grossAreaUnit', v);
                }}
                textInputProps={{
                  onChangeText: handleChange('grossArea'),
                  placeholder: t('totalArea').toString(),
                  onBlur: handleBlur('grossArea'),
                  defaultValue:
                    (values.grossArea && values.grossArea?.toString()) ||
                    undefined,
                }}
              />

              <FieldSelect
                loading={loading}
                options={certificateOfLand}
                placeholder={'certificateOfLands'}
                title={t('certificateOfLands') + ':'}
                name="certificateOfLand"
                // require
                defaultValue={initData.certificateOfLandIds || []}
                onChangeValue={items => {
                  setFieldValue(
                    'certificateOfLandIds',
                    (items.length && [items[0].value]) || [],
                  );
                }}
              />

              <FieldTextInputWithUnit
                title={t('expectedOutput') + ':'}
                name="grossYield"
                unit="MASS"
                isRequired={true}
                defaultUnitValue={values.grossYieldUnit || undefined}
                onChangeUnit={v => setFieldValue('grossYieldUnit', v)}
                textInputProps={{
                  placeholder: t('expectedOutput').toString(),
                  onChangeText: handleChange('grossYield'),
                  onBlur: handleBlur('grossYield'),
                  defaultValue:
                    (values.grossYield && values.grossYield?.toString()) || '',
                  keyboardType: 'decimal-pad',
                }}
              />
              <FieldSelect
                loading={loading}
                options={businessTypes}
                placeholder={'farmMethod'}
                title={t('farmMethod') + ':'}
                name="businessType.masterDataTypeId"
                require
                defaultValue={
                  (initData.businessType?.masterDataTypeId && [
                    initData.businessType.masterDataTypeId,
                  ]) ||
                  []
                }
                onChangeValue={items => {
                  setFieldValue(
                    'businessType',
                    (items.length && {
                      name: items[0].label,
                      masterDataTypeId: items[0].value,
                    }) || {
                      name: null,
                      masterDataTypeId: null,
                    },
                  );
                }}
              />
            </ScrollViewKeyboardAvoidView>
          );
        }}
      </Formik>
    </AppContainer>
  );
};

export default AddCrops;

const styles = StyleSheet.create({
  textCancle: {
    ...styleSheet.textStyleBold,
    color: Colors.CANCLE_BUTTON,
  },
  container: {
    paddingTop: 10,
  },
});
