/* eslint-disable react-native/no-inline-styles */

import * as React from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import {Line, StepButtonSingle} from 'src/components/molecules';
import {useState, useEffect} from 'react';
import {getMasterData} from 'src/api/appData/actions';
import {
  AppContainer,
  FieldDropDownOther,
  FieldSelect,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {FARM} from 'src/api/farm/type.d';
import {styles} from './styles';
import * as yup from 'yup';
import {styleSheet} from 'src/styles/styleSheet';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import {UpdateValue, alertPopup, saveValue} from '.';
import {Colors} from 'src/styles';
import {getProductSeasonUse} from 'src/api/farm/actions';
import {SEASON} from 'src/api/season/type.d';

const defaultValue: FARM.Basic.FarmProductType = {
  productType: {
    id: null,
    name: '',
  },
  grossProductivities: {
    value: 0,
    interval: 'YEAR',
    unitId: null,
  },
  grossYields: {
    value: 0,
    unitId: null,
  },
  grossAreas: {
    value: 0,
    unitId: null,
  },
  farmingSeasonNumber: 0,
};
const Step4 = () => {
  const value = useSelector((state: RootState) => state.farmReducer.farmBody);
  const {t} = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [scrollToEnd, setScrollToEnd] = useState<boolean>(true);
  const [masterDataDisabled, setMasterDataDisabled] = useState<number[]>([]);
  const [otherDataDisabled, setOtherDataDisabled] = useState<number[]>([]);

  const arrayProductOther =
    value.products?.filter(f => !f.productType.id) || [];
  const [vArray, setVArray] = useState<FARM.Basic.FarmProductType[]>(
    arrayProductOther.length ? arrayProductOther : [defaultValue],
  );

  useEffect(() => {
    fetchCropsSeasonUse();
    fetchItem();
  }, []);

  const fetchItem = () => {
    getMasterData('PRODUCT')
      .then(res => {
        setItems(
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
  };

  const fetchCropsSeasonUse = () => {
    if (value.id) {
      getProductSeasonUse(value.id)
        .then(res => {
          setMasterDataDisabled(
            res.map((m: SEASON.Basic.ProductOfFarm) => m.masterDataTypeId),
          );
          setOtherDataDisabled(
            res.map((m: SEASON.Basic.ProductOfFarm) => m.farmProductId),
          );
        })
        .catch(err => console.log(err));
    }
  };

  const schema = yup.object().shape({
    productsList: yup.array().min(1, () => t('required_field')),
  });
  const formType = value.id ? 'UPDATE' : 'CREATE';

  return (
    <Formik
      initialValues={{
        products: value.products?.filter(f => f.productType.id) || [],
      }}
      onSubmit={values => {
        const products = [
          ...values.products,
          ...vArray.filter(f => f.productType.name),
        ];
        if (products.length === 0) Alert.alert(t('min_value_crops'));
        products.length && saveValue({products: products}, 4);
      }}
      validationSchema={schema}>
      {({handleSubmit, setFieldValue, values, errors}) => (
        <AppContainer
          title={t('typeTree')}
          headerRight={
            !value.id ? (
              <TouchableOpacity
                onPress={() => {
                  alertPopup(formType, values, true, 3, t);
                }}>
                <Text style={styles.textCancle}>{t('cancel')}</Text>
              </TouchableOpacity>
            ) : (
              <View style={{width: 20}}></View>
            )
          }>
          <ScrollViewKeyboardAvoidView
            onContentSizeChange={(w, h, ref) => {
              if (scrollToEnd) {
                ref?.scrollToEnd();
                setScrollToEnd(false);
              }
            }}
            scrollViewProps={{
              style: styles.container,
              contentContainerStyle: styles.content,
            }}
            bottomButton={
              <>
                {value.id ? (
                  <StepButtonSingle
                    disableRight={
                      !values.products.length &&
                      vArray.length === 1 &&
                      !vArray[0].productType?.name
                    }
                    subTitile={t('addFarm5Info')}
                    title="save"
                    buttonStyle={styleSheet.buttonDefaultStyle}
                    textButtonStyle={styleSheet.buttonDefaultText}
                    onPressRight={() =>
                      UpdateValue({
                        products: [
                          ...values.products,
                          ...vArray.filter(f => f.productType.name),
                        ],
                      })
                    }
                  />
                ) : (
                  <StepButtonSingle
                    subTitile={t('addFarm5Info')}
                    disableLeft={false}
                    disableRight={false}
                    onPressRight={handleSubmit}
                  />
                )}
              </>
            }>
            <FieldSelect
              multi
              loading={loading}
              options={items}
              placeholder={'choseTree'}
              title={t('choseTree') + ':'}
              name="products"
              require
              defaultValue={values.products.map(m => m.productType.id) || []}
              disabledItemIds={masterDataDisabled}
              onChangeValue={items =>
                setFieldValue(
                  'products',
                  items.map(m => {
                    return values.products.some(
                      s => s.productType.id === m.value,
                    )
                      ? values.products.find(f => f.productType.id === m.value)
                      : {
                          ...defaultValue,
                          productType: {
                            id: m.value,
                            name: m.label,
                          },
                        };
                  }),
                )
              }
            />
            {vArray.map((obj, index) => {
              return (
                <View style={{marginTop: index > 0 ? 19 : 0}} key={index + ''}>
                  {index > 0 && <Line colors={Colors.GRAY_LINE} />}
                  <FieldDropDownOther
                    disabled={otherDataDisabled.some(s => s === obj.id)}
                    onChange={value => {
                      let newArray: any = vArray.map((o, id) => {
                        if (id === index) {
                          return {
                            ...o,
                            productType: {
                              id: null,
                              name: value,
                            },
                          };
                        } else {
                          return o;
                        }
                      });
                      setVArray(newArray);
                    }}
                    onRemove={() =>
                      setVArray(vArray.filter((f, i) => i !== index))
                    }
                    placeholder={t('fillOrtherCareer').toString()}
                    defaultValue={obj.productType.name}
                    title={t('fillOrtherCareer') + ':'}
                  />
                </View>
              );
            })}
            <View
              style={{
                alignItems: 'flex-end',
                width: '100%',
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setVArray([...vArray, defaultValue]);
                  setScrollToEnd(true);
                }}>
                <IconFigma name="add_ICON" size={30} />
              </TouchableOpacity>
            </View>
          </ScrollViewKeyboardAvoidView>
        </AppContainer>
      )}
    </Formik>
  );
};

export default Step4;
