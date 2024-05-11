import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {FARM} from 'src/api/farm/type.d';
import {useTranslation} from 'react-i18next';
import {FieldTextInputWithUnit} from 'src/components/organisms';
import {optionsType} from 'src/components/organisms/appForm/FieldDropDown';

type FieldCustomProps = {
  name: 'grossAreas' | 'grossProductivities' | 'farmingSeasonNumber';
  title: string;
  index: number;
  optionsUnit: optionsType[];
  values: {array: FARM.Basic.FarmProductType[]};
  setFieldValue: any;
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T = string | React.ChangeEvent<any>>(
      field: T,
    ): T extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void;
  };
};
const FieldCustom = (props: FieldCustomProps) => {
  const {title, index, handleChange, values, setFieldValue, name, optionsUnit} =
    props;
  const {t} = useTranslation();
  return (
    <>
      {optionsUnit.length > 0 && (
        <FieldTextInputWithUnit
          unitWidth={name === 'grossProductivities' ? 160 : undefined}
          title={t(`${name}_for`) + title + ':'}
          name={
            name === 'farmingSeasonNumber'
              ? `array[${index}].${name}`
              : `array[${index}].${name}.value`
          }
          options={optionsUnit}
          onChangeUnit={unit => {
            if (name !== 'farmingSeasonNumber')
              setFieldValue(`array[${index}].${name}.unitId`, unit);
          }}
          defaultUnitValue={
            name === 'farmingSeasonNumber'
              ? undefined
              : values.array[index][name].unitId || undefined
          }
          textInputProps={{
            onChangeText: handleChange(
              name === 'farmingSeasonNumber'
                ? `array[${index}].${name}`
                : `array[${index}].${name}.value`,
            ),
            placeholder: t(`${name}_for`) + title,
            defaultValue:
              name === 'farmingSeasonNumber'
                ? (values.array[index][name] &&
                    values.array[index][name]?.toString()) ||
                  ''
                : (values.array[index][name].value &&
                    values.array[index][name].value?.toString()) ||
                  '',
          }}
        />
      )}
    </>
  );
};

export default FieldCustom;

const styles = StyleSheet.create({});
