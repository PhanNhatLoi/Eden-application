import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import * as yup from 'yup';
import {StepButton, StepButtonSingle} from 'src/components/molecules';
import {
  AppContainer,
  FieldTextInputWithUnit,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import {FARM} from 'src/api/farm/type.d';
import {styles} from './styles';
import {styleSheet} from 'src/styles/styleSheet';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import {TouchableOpacity, View, Text} from 'react-native';
import {UpdateValue, alertPopup, saveValue} from '.';

const Step3 = () => {
  const value = useSelector((state: RootState) => state.farmReducer.farmBody);
  const {t} = useTranslation();
  const schema = yup.object().shape({
    value: yup
      .number()
      .required(t('required_field').toString())
      .moreThan(0, t('min_value_0').toString())
      .typeError(t('error_format_text').toString()),
  });
  const [loading, setLoading] = React.useState<boolean>(true);
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  const formType = value.id ? 'UPDATE' : 'CREATE';
  return (
    <Formik
      initialValues={{
        value: value.grossArea.value || '',
        unitId: value.grossArea.unitId,
      }}
      onSubmit={values => {
        saveValue(
          {
            grossArea: {
              value: Number(values.value),
              unitId: Number(values.unitId),
            },
          },
          3,
        );
      }}
      validationSchema={schema}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        setFieldValue,
        errors,
      }) => (
        <AppContainer
          title={t('farmArea')}
          headerRight={
            !value.id ? (
              <TouchableOpacity
                onPress={() => {
                  alertPopup(formType, values, true, 2, t);
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
                    subTitile={t('addFarm3Info')}
                    title="save"
                    buttonStyle={styleSheet.buttonDefaultStyle}
                    textButtonStyle={styleSheet.buttonDefaultText}
                    onPressRight={() =>
                      Object.keys(errors).length === 0 &&
                      UpdateValue({
                        grossArea: {
                          value: Number(values.value),
                          unitId: Number(values.unitId),
                        },
                      })
                    }
                  />
                ) : (
                  <StepButtonSingle
                    subTitile={
                      t('addFarm3Info') +
                      ' ' +
                      ((values as any).unit?.label || 'Hecta')
                    }
                    disableLeft={false}
                    disableRight={false}
                    onPressRight={handleSubmit}
                  />
                )}
              </>
            }>
            <FieldTextInputWithUnit
              title={t('totalArea') + ':'}
              name="value"
              unit="ACREAGE"
              isRequired={true}
              onChangeUnit={unit => setFieldValue('unitId', unit)}
              autoFocus={!values.value}
              defaultUnitValue={values.unitId || undefined}
              textInputProps={{
                onChangeText: handleChange('value'),
                onBlur: handleBlur('value'),
                defaultValue: values.value.toString(),
              }}
            />
          </ScrollViewKeyboardAvoidView>
        </AppContainer>
      )}
    </Formik>
  );
};

export default Step3;
