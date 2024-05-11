/* eslint-disable react-native/no-inline-styles */

import * as React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {Formik} from 'formik';
import {SCREEN} from 'src/help';
import {Line, StepButtonSingle} from 'src/components/molecules';
import {useState, useEffect} from 'react';
import {getMasterData} from 'src/api/appData/actions';
import {
  AppContainer,
  FieldDropDownOther,
  FieldSelect,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import DropDownPicker from 'react-native-dropdown-picker';
import {FARM} from 'src/api/farm/type.d';
import {Colors} from 'src/styles';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import {UpdateValue, alertPopup, saveValue} from '.';
type Props = {};
const DefaultValue: FARM.Basic.ConsumptionMarketType = {
  name: '',
  id: null,
};
DropDownPicker.setListMode('SCROLLVIEW');
const Step8 = (props: Props) => {
  const value = useSelector((state: RootState) => state.farmReducer.farmBody);
  const {t} = useTranslation();

  const arrayProductMasterData =
    value.consumptionMarket?.filter(f => f.id) || [];
  const arrayProductOther = value.consumptionMarket?.filter(f => !f.id) || [];
  const [vArray, setVArray] = useState<FARM.Basic.ConsumptionMarketType[]>(
    arrayProductOther.length ? arrayProductOther : [DefaultValue],
  );
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUnit();
  }, []);

  const fetchUnit = () => {
    getMasterData('MARKET')
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
  const formType = value.id ? 'UPDATE' : 'CREATE';
  return (
    <Formik
      initialValues={{consumptionMarket: arrayProductMasterData}}
      onSubmit={values =>
        saveValue(
          {
            consumptionMarket: [
              ...values.consumptionMarket,
              ...vArray.filter(f => f.name),
            ],
          },
          8,
        )
      }>
      {({handleSubmit, setFieldValue, values}) => (
        <AppContainer
          title={t('market')}
          headerRight={
            !value.id ? (
              <TouchableOpacity
                onPress={() => {
                  alertPopup(formType, values, true, 7, t);
                }}>
                <Text style={styles.textCancle}>{t('cancel')}</Text>
              </TouchableOpacity>
            ) : (
              <View style={{width: 20}}></View>
            )
          }>
          <ScrollViewKeyboardAvoidView
            scrollViewProps={{
              style: styles.container,
              contentContainerStyle: styles.content,
            }}
            onContentSizeChange={(w, h, ref) => {
              ref?.scrollToEnd();
            }}
            bottomButton={
              <>
                {value.id ? (
                  <StepButtonSingle
                    subTitile={t('addFarm10Info')}
                    title="save"
                    buttonStyle={styleSheet.buttonDefaultStyle}
                    textButtonStyle={styleSheet.buttonDefaultText}
                    onPressRight={() =>
                      UpdateValue({
                        consumptionMarket: [
                          ...values.consumptionMarket,
                          ...vArray.filter(f => f.name),
                        ],
                      })
                    }
                  />
                ) : (
                  <StepButtonSingle
                    subTitile={t('addFarm10Info')}
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
              placeholder={'choseMarket'}
              title={t('choseMarket') + ':'}
              name="consumptionMarket"
              defaultValue={values.consumptionMarket.map(m => m.id) || []}
              onChangeValue={items =>
                setFieldValue(
                  'consumptionMarket',
                  items.map(m => {
                    return {
                      id: m.value,
                      name: m.label,
                    };
                  }),
                )
              }
            />
            {vArray.map((obj, index) => {
              return (
                <View key={index + ''} style={{marginTop: index > 0 ? 19 : 0}}>
                  {index > 0 && <Line colors={Colors.GRAY_LINE} />}
                  <FieldDropDownOther
                    placeholder={t('market').toString()}
                    onChange={value => {
                      let newArray: any = vArray.map((o, id) => {
                        if (id === index) {
                          return {name: value, id: null};
                        } else {
                          return o;
                        }
                      });
                      setVArray(newArray);
                    }}
                    title={t('fillOrtherMarket').toString() + ':'}
                    onRemove={() =>
                      setVArray(vArray.filter((f, i) => i !== index))
                    }
                    autoFocus={Boolean(vArray.length > 1 && !value.id)}
                    defaultValue={obj.name || ''}
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
                  setVArray([...vArray, DefaultValue]);
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
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 15,
    flex: 1,
    width: '100%',
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
  content: {
    paddingBottom: 20,
  },
  textCancle: {
    ...styleSheet.textStyleBold,
    fontSize: 16,
    color: Colors.CANCLE_BUTTON,
  },
});

export default Step8;
