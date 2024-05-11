import {Text, View} from 'react-native';
import React from 'react';
import {ErrorMessage, Field, FieldProps} from 'formik';
import * as validation from '../../../../help/validation/input';
import i18next from 'i18next';
import * as Types from './types';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import TextInput from 'src/components/molecules/TextInput';
import {formatPhoneNumner} from 'src/help/formatPhone';

const MInput = (props: Types.InputProps) => {
  const {t} = i18next;
  const {autoFocus = false} = props;
  const validate = (value: string) => {
    let errorMessage;
    if (props.require && !value) {
      return t('required_field');
    }
    if (value)
      switch (props.type) {
        case 'phone':
          if (!validation.isPhone.test(value)) return t('phone_number_invalid');
          break;
        case 'email':
          if (!validation.isEmail.test(value)) return t('email_invalid');
          break;
        case 'email_or_phone':
          if (!validation.isEmailOrPhone.test(value)) return t('value_invalid');
          break;
      }
    return errorMessage;
  };

  return (
    <Field name={props.name} validate={validate}>
      {({
        field, // { name, value, onChange, onBlur }
        form: {touched, errors}, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
        meta,
      }: FieldProps) => {
        const handleChangeText = (val: string) => {
          if (props.type === 'phone') {
            return field.onChange(props.name)(formatPhoneNumner(val).value);
          } else {
            return field.onChange(props.name)(val);
          }
        };
        return (
          <View style={{width: '100%'}}>
            <TextInput
              autoFocus={autoFocus}
              onChangeText={handleChangeText}
              onBlur={field.onBlur(props.name)}
              value={field.value[props.name]}
              style={props.style || styleSheet.inputStyle}
              placeholderTextColor={
                props.placeholderTextColor || Colors.GRAY_03
              }
              {...props}
            />
            <Text style={styleSheet.errorTextStyle}>
              <ErrorMessage name={props.name} />
            </Text>
          </View>
        );
      }}
    </Field>
  );
};

export default MInput;
