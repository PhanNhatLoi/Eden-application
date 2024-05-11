import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styleSheet} from 'src/styles/styleSheet';
import {useTranslation} from 'react-i18next';
import {DIARY} from 'src/api/diary/type.d';
import {Formik} from 'formik';
import {
  FieldTextInputWithUnit,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import * as yup from 'yup';

import {StepButtonSingle} from 'src/components/molecules';
import {optionsType} from 'src/components/organisms/appForm/FieldDropDown';
import {getMasterData, getUnit} from 'src/api/appData/actions';
import {Colors} from 'src/styles';

type Props = {
  onSubmit?: (value: {expectedOutputToday: DIARY.Basic.UnitDataType}) => void;
  value?: DIARY.Request.Diary;
  loading: boolean;
  viewForm?: boolean;
};

const step2 = (props: Props) => {
  const {t} = useTranslation();
  const {value, onSubmit = _ => {}, loading, viewForm = false} = props;
  const [units, setUnits] = useState<optionsType[]>([]);

  useEffect(() => {
    getUnit('MASS')
      .then(res => {
        const format = res.map((obj: any) => ({
          label: obj.shortName,
          value: obj.id,
        }));
        setUnits(format);
      })
      .catch(err => console.log(err));
  }, []);

  const schema = yup.object().shape({
    value: yup
      .number()
      .moreThan(0, t('min_value_0').toString())
      .typeError(t('error_format_text').toString()),
  });

  return (
    <Formik
      initialValues={{
        value: value?.expectedOutputToday?.value || '',
        unitId: value?.expectedOutputToday?.unitId || undefined,
      }}
      onSubmit={values => {
        onSubmit({
          expectedOutputToday: {
            value: (values.value && Number(values.value)) || null,
            unitId: (values.unitId && Number(values.unitId)) || null,
            unitName: units.find(f => f.value === values.unitId)?.label || '',
          },
          // update array to json after merge BE code
        });
      }}
      validationSchema={schema}>
      {({handleSubmit, setFieldValue, handleChange, handleBlur, values}) => (
        <>
          <ScrollViewKeyboardAvoidView
            headerHeight={190}
            scrollViewProps={{
              style: styles.container,
              contentContainerStyle: {width: '100%', paddingHorizontal: 20},
            }}
            bottomButton={
              <StepButtonSingle
                loading={loading}
                spinColor={Colors.SYS_BUTTON}
                title={t(viewForm ? 'close' : 'save').toString()}
                disableLeft={false}
                disableRight={false}
                buttonStyle={styleSheet.buttonDefaultStyle}
                textButtonStyle={[
                  styleSheet.buttonDefaultText,
                  // {color: Colors.WHITE},
                ]}
                onPressRight={handleSubmit}
              />
            }>
            <FieldTextInputWithUnit
              isRequired
              autoFocus={!values.value}
              title={t('estimated_output_to_date')}
              name="value"
              unit="MASS"
              disabled={viewForm}
              defaultUnitValue={values.unitId}
              onChangeUnit={unit => setFieldValue('unitId', unit)}
              textInputProps={{
                placeholder: t('fill_estimated_output').toString(),
                onChangeText: handleChange('value'),
                onBlur: handleBlur('value'),
                keyboardType: 'decimal-pad',
                defaultValue: values.value.toString() || '',
              }}
            />
          </ScrollViewKeyboardAvoidView>
        </>
      )}
    </Formik>
  );
};

export default step2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
  },
});
