import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {Formik} from 'formik';
import {SCREEN} from 'src/help';
import {StepButton, StepButtonSingle} from 'src/components/molecules';
import {
  FieldTextInputWithUnit,
  ScrollViewKeyboardAvoidView,
} from 'src/components/organisms';
import * as yup from 'yup';
import {SEASON} from 'src/api/season/type.d';

type Step6Props = {
  onSubmit?: (value: {
    grossYield: {
      value: number;
      unitId: number | null;
    };
    grossArea: {
      value: number;
      unitId: number | null;
    };
  }) => void;
  value: SEASON.Request.Season;
  onSave: (value: {
    grossYield: {
      value: number;
      unitId: number | null;
    };
    grossArea: {
      value: number;
      unitId: number | null;
    };
  }) => void;
};

const Step6 = (props: Step6Props) => {
  const {onSubmit = _ => {}, value, onSave} = props;
  const {t} = useTranslation();
  const schema = yup.object().shape({
    grossArea: yup
      .number()
      .required(() => t('required_field'))
      .typeError(t('error_format_text').toString()),
    grossYield: yup
      .number()
      .required(() => t('required_field'))
      .typeError(t('error_format_text').toString()),
  });

  return (
    <Formik
      initialValues={{
        grossArea: value.grossArea.value,
        grossAreaUnit: value.grossArea.unitId,
        grossYield: value.grossYield.value,
        grossYieldUnit: value.grossYield.unitId,
      }}
      onSubmit={values => {
        const newValue = {
          grossYield: {
            value: values.grossYield || 0,
            unitId: (values.grossYieldUnit && values.grossYieldUnit) || null,
          },
          grossArea: {
            value: values.grossArea || 0,
            unitId: (values.grossAreaUnit && values.grossAreaUnit) || null,
          },
        };
        onSubmit({...newValue});
      }}
      validationSchema={schema}>
      {({handleChange, handleBlur, handleSubmit, values, setFieldValue}) => (
        <>
          <ScrollViewKeyboardAvoidView
            scrollViewProps={{
              style: styles.container,
            }}
            bottomButton={
              <>
                {value.id ? (
                  <StepButton
                    subTitile={t('addSeason6Info')}
                    disableLeft={false}
                    disableRight={false}
                    onPressRight={handleSubmit}
                    onPressLeft={() =>
                      onSave({
                        grossYield: {
                          value: Number(values.grossYield),
                          unitId: Number(values.grossYieldUnit),
                        },
                        grossArea: {
                          value: Number(values.grossArea),
                          unitId: Number(values.grossAreaUnit),
                        },
                      })
                    }
                  />
                ) : (
                  <StepButtonSingle
                    subTitile={t('addSeason6Info')}
                    disableLeft={false}
                    disableRight={false}
                    onPressRight={handleSubmit}
                  />
                )}
              </>
            }>
            <View style={{zIndex: 0}}>
              <FieldTextInputWithUnit
                title={t('TotalexpectedOutput') + ':'}
                name="grossYield"
                unit="MASS"
                isRequired={true}
                autoFocus={!values.grossYield}
                onChangeUnit={v => {
                  setFieldValue('grossYieldUnit', v);
                }}
                defaultUnitValue={values.grossYieldUnit || undefined}
                textInputProps={{
                  placeholder: t('TotalexpectedOutput').toString(),
                  onChangeText: handleChange('grossYield'),
                  defaultValue:
                    (values.grossYield && values.grossYield.toString()) ||
                    undefined,
                }}
              />
            </View>
            <View style={{zIndex: -1}}>
              <FieldTextInputWithUnit
                title={t('cultivatedArea') + ':'}
                name="grossArea"
                unit="ACREAGE"
                autoFocus={!values.grossArea}
                isRequired={true}
                onChangeUnit={v => {
                  setFieldValue('grossAreaUnit', v);
                }}
                defaultUnitValue={values.grossAreaUnit || undefined}
                textInputProps={{
                  placeholder: t('cultivatedArea').toString(),
                  onChangeText: handleChange('grossArea'),
                  defaultValue:
                    (values.grossArea && values.grossArea.toString()) ||
                    undefined,
                }}
              />
            </View>
          </ScrollViewKeyboardAvoidView>
        </>
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 15,
    width: '100%',
  },
  filedText: {
    ...styleSheet.filedText,
    width: SCREEN.width - 40 - 100 - 10,
    marginRight: 10,
  },
  filedTextUnit: {
    ...styleSheet.filedText,
    width: 100,
  },
  dropDownContainerStyle: {
    ...styleSheet.filedText,
    width: 100,
    height: 150,
  },
  bottomTab: {
    width: SCREEN.width,
    alignItems: 'center',
  },
});

export default Step6;
