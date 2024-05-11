import * as React from 'react';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {FieldArray, Formik} from 'formik';
import {StepButton, StepButtonSingle} from 'src/components/molecules';
import {FARM} from 'src/api/farm/type.d';
import * as yup from 'yup';
import {styles} from './styles';
import {
  AppContainer,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import FieldCustom from './FieldCustom';
import {optionsType} from 'src/components/organisms/appForm/FieldDropDown';
import {styleSheet} from 'src/styles/styleSheet';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import {alertPopup, saveValue, UpdateValue} from '.';
import {Colors} from 'src/styles';

const Step7 = () => {
  const value = useSelector((state: RootState) => state.farmReducer.farmBody);
  const products = value.products;
  const {t} = useTranslation();
  const [units, setUnits] = React.useState<optionsType[]>([
    {
      value: 1,
      label: '/' + t('YEAR'),
    },
  ]);
  const [spiner, setSpiner] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [onScrollEnd, setonScrollEnd] = React.useState<boolean>(false);
  const [items, setItems] = React.useState<FARM.Basic.FarmProductType[]>([]);

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 700);
  }, []);

  //schema formik
  const schema = yup.object().shape({
    array: yup.array().of(
      yup.object().shape({
        farmingSeasonNumber: yup
          .number()
          .min(0, t('min_value_0').toString())
          .typeError(t('error_format_text').toString()),
      }),
    ),
  });
  const formType = value.id ? 'UPDATE' : 'CREATE';

  React.useEffect(() => {
    if (products.length) {
      setItems(products.length >= 10 ? products.slice(0, 10) : products);
    }
  }, [products]);

  React.useEffect(() => {
    if (onScrollEnd) {
      const newItems = [
        ...items,
        ...products.slice(items.length, items.length + 10),
      ];
      setItems(newItems);
      if (newItems.length < products.length) setonScrollEnd(false);
    }
  }, [onScrollEnd]);

  return (
    <Formik
      initialValues={{
        array: value.products,
      }}
      onSubmit={values => {
        setSpiner(true);
        setTimeout(() => {
          saveValue(
            {
              products: values.array.map(m => {
                return {
                  ...m,
                  farmingSeasonNumber: Number(m.farmingSeasonNumber),
                };
              }),
            },
            7,
          );
          setSpiner(false);
        }, 700);
      }}
      validationSchema={schema}>
      {({handleSubmit, handleChange, values, setFieldValue}) => {
        return (
          <AppContainer
            title={t('seasonNumber')}
            headerRight={
              !value.id ? (
                <TouchableOpacity
                  onPress={() => {
                    alertPopup(formType, values, true, 6, t);
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
                onMomentumScrollEnd: (
                  event: NativeSyntheticEvent<NativeScrollEvent>,
                ) => {
                  if (
                    parseInt(
                      (
                        event.nativeEvent.contentOffset.y +
                        event.nativeEvent.layoutMeasurement.height
                      ).toString(),
                    ) >=
                    parseInt(event.nativeEvent.contentSize.height.toString())
                  ) {
                    setonScrollEnd(true);
                  }
                },
              }}
              bottomButton={
                <>
                  {value.id ? (
                    <StepButtonSingle
                      subTitile={t('addFarm9Info')}
                      title="save"
                      buttonStyle={styleSheet.buttonDefaultStyle}
                      textButtonStyle={styleSheet.buttonDefaultText}
                      onPressRight={() =>
                        UpdateValue({
                          products: values.array.map(m => {
                            return {
                              ...m,
                              farmingSeasonNumber:
                                Number(m.farmingSeasonNumber) || null,
                            };
                          }),
                        })
                      }
                    />
                  ) : (
                    <StepButtonSingle
                      loading={spiner}
                      subTitile={t('addFarm9Info')}
                      disableLeft={false}
                      disableRight={false}
                      onPressRight={handleSubmit}
                    />
                  )}
                </>
              }>
              <FieldArray
                name="array"
                render={arrayHelpers => (
                  <View>
                    {items.map((obj, index) => (
                      <View key={index} style={{zIndex: 1 - index}}>
                        <FieldCustom
                          optionsUnit={units}
                          name="farmingSeasonNumber"
                          values={values}
                          title={values.array[index].productType.name}
                          index={index}
                          handleChange={handleChange}
                          setFieldValue={setFieldValue}
                        />
                      </View>
                    ))}
                    {items.length < products.length && (
                      <ActivityIndicator size={25} color={Colors.SYS_BUTTON} />
                    )}
                  </View>
                )}
              />
            </ScrollViewKeyboardAvoidView>
          </AppContainer>
        );
      }}
    </Formik>
  );
};

export default Step7;
