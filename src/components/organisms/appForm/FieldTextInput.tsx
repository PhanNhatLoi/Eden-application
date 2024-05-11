import * as React from 'react';
import {StyleSheet, Text, TextInputProps, View} from 'react-native';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import {FieldTitle} from '../../molecules';
import {ErrorMessage, Field} from 'formik';
import {SCREEN} from 'src/help';
import TextInput from 'src/components/molecules/TextInput';
import {formatDecimal} from 'src/help/formatDecimal';

type FieldTextInputProps = {
  isRequired?: boolean;
  textInputProps?: TextInputProps;
  name: string;
  title: string;
  disabled?: boolean;
  defaultValue?: string;
  autoFocus?: boolean;
  supportSchema?: boolean;
  type?: 'multiline' | 'text' | 'integer' | 'decimal';
};

const FieldTextInput = (props: FieldTextInputProps) => {
  const {
    isRequired = false,
    autoFocus = false,
    textInputProps = {},
    name,
    title,
    disabled = false,
    defaultValue = '',
    type = 'text',
    supportSchema = true,
  } = props;

  const [value, setValue] = React.useState<string>(
    (Number(defaultValue) && formatDecimal(defaultValue)) || '',
  );

  const styles = StyleSheet.create({
    filedMultipeLineText: {
      ...styleSheet.textStyleBasic,
      padding: 10,
      backgroundColor: disabled ? Colors.GRAY_01 : Colors.WHITE,
      borderWidth: 1,
      borderRadius: 8,
      width: SCREEN.width - 40,
      height: 100,
      marginTop: 10,
      borderColor: Colors.GRAY_02,
    },
    filedText: {
      ...styleSheet.textStyleBasic,
      padding: 10,
      backgroundColor: disabled ? Colors.GRAY_01 : Colors.WHITE,
      borderWidth: 1,
      borderRadius: 8,
      width: SCREEN.width - 40,
      marginTop: 10,
      borderColor: Colors.GRAY_02,
      // textAlignVertical: 'top',
      height: 50,
      lineHeight: 18,
    },
  });

  const textInputMultiline = (
    <TextInput
      autoFocus={autoFocus}
      editable={!disabled}
      defaultValue={defaultValue}
      placeholderTextColor={Colors.GRAY_DARK}
      style={styles.filedMultipeLineText}
      textAlignVertical="top"
      {...textInputProps}
      onChangeText={v => {
        textInputProps.onChangeText && textInputProps.onChangeText(v);
      }}
    />
  );
  const textInputDefault = (
    <TextInput
      autoFocus={autoFocus}
      editable={!disabled}
      defaultValue={defaultValue}
      placeholderTextColor={Colors.GRAY_DARK}
      style={styles.filedText}
      {...textInputProps}
      onChangeText={v => {
        textInputProps.onChangeText && textInputProps.onChangeText(v);
      }}
    />
  );
  const textInputInteger = (
    <TextInput
      autoFocus={autoFocus}
      editable={!disabled}
      placeholderTextColor={Colors.GRAY_DARK}
      style={styles.filedText}
      value={value}
      keyboardType="number-pad"
      maxLength={14}
      {...textInputProps}
      onChangeText={v => {
        const temp =
          (v && formatDecimal(v.split('.').join('').replace(',', ''))) || '';
        setValue(temp);
        textInputProps.onChangeText &&
          textInputProps.onChangeText(v.split('.').join(''));
      }}
    />
  );
  const textInputDecimal = (
    <TextInput
      autoFocus={autoFocus}
      editable={!disabled}
      defaultValue={defaultValue}
      placeholderTextColor={Colors.GRAY_DARK}
      style={styles.filedText}
      keyboardType="numeric"
      {...textInputProps}
      onChangeText={v => {
        textInputProps.onChangeText && textInputProps.onChangeText(v);
      }}
    />
  );

  return (
    <>
      <FieldTitle isRequired={isRequired} title={title} />
      {type === 'multiline' && textInputMultiline}
      {type === 'text' && textInputDefault}
      {type === 'integer' && textInputInteger}
      {type === 'decimal' && textInputDecimal}

      {supportSchema && (
        <Text style={styleSheet.errorTextStyle}>
          <ErrorMessage name={name} />
        </Text>
      )}
    </>
  );
};

export default FieldTextInput;
