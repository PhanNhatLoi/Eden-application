import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import i18next from 'i18next';
import {ErrorMessage, Field, FieldProps} from 'formik';
import * as Types from './types';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import {ICON} from 'src/assets';
import TextInput from 'src/components/molecules/TextInput';

const PasswordInput = (props: Types.InputProps) => {
  const {t} = i18next;
  const [hiddenPassword, setHiddenPassword] = useState<boolean>(true);

  const validate = (value: string) => {
    let errorMessage;
    if (props.require && !value) {
      return t('required_field');
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
        return (
          <View>
            <View
              style={{
                ...styleSheet.inputStyle,
                ...styles.parentStyle,
                backgroundColor: props.backgroundColor
                  ? props.backgroundColor
                  : styleSheet.inputStyle.backgroundColor,
              }}>
              <TextInput
                {...props}
                onChangeText={field.onChange(props.name)}
                onBlur={field.onBlur(props.name)}
                value={field.value}
                maxLength={59}
                secureTextEntry={hiddenPassword}
                keyboardType="ascii-capable"
                clearButtonMode={errors[props.name] ? 'always' : 'never'}
                style={styles.chilrenStyle}
                placeholderTextColor={Colors.GRAY_03}
              />
              {!errors[props.name] && touched[props.name] && (
                <View style={{justifyContent: 'center'}}>
                  <Image
                    source={ICON['correct']}
                    style={{height: 15, width: 15}}
                  />
                </View>
              )}
              <TouchableOpacity
                style={styles.button}
                onPress={() => setHiddenPassword(!hiddenPassword)}>
                <Image
                  source={ICON[hiddenPassword ? 'view' : 'hide']}
                  style={{height: 15, width: 22}}
                />
              </TouchableOpacity>
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

export default PasswordInput;

const styles = StyleSheet.create({
  parentStyle: {
    flexDirection: 'row',
  },
  chilrenStyle: {
    paddingLeft: 0,
    flex: 1,
    color: Colors.BLACK,
  },
  button: {
    marginHorizontal: 10,
    justifyContent: 'center',
  },
});
