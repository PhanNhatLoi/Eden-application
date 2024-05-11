import {View, Text, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import i18next from 'i18next';
import {ErrorMessage, Field, FieldProps} from 'formik';
import * as Types from './types';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import TextInput from 'src/components/molecules/TextInput';
const maxLengthOTP = 6;

type Props = Types.InputProps & {
  timeCount: number;
};

const OtpInput = (props: Props) => {
  const {timeCount} = props;
  const {t} = i18next;
  const [value, setValue] = useState<string>(''); //hard code

  const validate = (value: string) => {
    let errorMessage;
    if (props.require && !value) {
      return t('required_field');
    }
    if (value.length < 6) return t('otp_min_value_6');
    return errorMessage;
  };

  return (
    <Field name={props.name} validate={validate}>
      {({
        field, // { name, value, onChange, onBlur }
        form: {touched, errors}, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
        meta,
      }: FieldProps) => {
        const handleOnChange = (value: string) => {
          //config otp only number character
          const regex = /^[\d]*$/;
          if (regex.test(value)) {
            setValue(value);
            field.onChange(props.name)(value);
          }
        };

        return (
          <View>
            <View style={{...styleSheet.inputStyle, ...styles.parentStyle}}>
              <View style={styles.input}>
                <Text style={{color: Colors.GRAY_DARK}}>
                  {' '}
                  {t('code') + ':'}
                </Text>
              </View>
              <TextInput
                {...props}
                placeholder={t('otp_code').toString()}
                maxLength={maxLengthOTP}
                placeholderTextColor={Colors.GRAY_MEDIUM}
                onChangeText={handleOnChange}
                onBlur={field.onBlur(props.name)}
                value={value}
                keyboardType="numeric"
                inputMode="numeric"
                style={styles.chilrenStyle}
              />
              <View
                style={[
                  styles.input,
                  {
                    borderLeftWidth: 1,
                    borderLeftColor: Colors.GRAY_02,
                    width: 88,
                    alignItems: 'flex-end',
                    marginVertical: 6,
                    paddingHorizontal: 20,
                  },
                ]}>
                <Text style={{color: Colors.GRAY_DARK}}>{timeCount}s</Text>
              </View>
            </View>
            <Text style={styleSheet.errorTextStyle}>
              <ErrorMessage name={props.name} />
            </Text>
          </View>
        );
      }}
    </Field>
  );
};

export default OtpInput;

const styles = StyleSheet.create({
  parentStyle: {
    flexDirection: 'row',
  },
  input: {
    ...styleSheet.textStyleBold,
    justifyContent: 'center',
    marginRight: 10,
  },

  chilrenStyle: {
    ...styleSheet.textStyleBold,
    paddingLeft: 0,
    flex: 1,
    color: Colors.BLACK,
  },
  button: {
    marginHorizontal: 10,
    justifyContent: 'center',
  },
});
