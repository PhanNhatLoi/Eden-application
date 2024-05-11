/* eslint-disable react-native/no-inline-styles */
import {ColorValue, Text, TextInputProps, View} from 'react-native';
import React from 'react';
import {ErrorMessage} from 'formik';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import TextInput from 'src/components/molecules/TextInput';
type PhoneInputProps = TextInputProps & {
  name: string;
  placeholderTextColor?: ColorValue;
};
const PhoneInput = (props: PhoneInputProps) => {
  const {name} = props;
  return (
    <View style={{width: '100%'}}>
      <TextInput
        {...props}
        placeholderTextColor={props.placeholderTextColor || Colors.GRAY_03}
        style={{...styleSheet.inputStyle}}
        keyboardType="number-pad"
      />
      <Text style={styleSheet.errorTextStyle}>
        <ErrorMessage name={name} />
      </Text>
    </View>
  );
};

export default PhoneInput;
