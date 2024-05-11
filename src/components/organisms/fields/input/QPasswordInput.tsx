/* eslint-disable react-native/no-inline-styles */
import {
  ColorValue,
  Image,
  Text,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {ErrorMessage} from 'formik';
import {styleSheet} from 'src/styles/styleSheet';
import i18next from 'i18next';
import {Colors} from 'src/styles';
import {ICON} from 'src/assets';
import TextInput from 'src/components/molecules/TextInput';

type QPasswordInputProps = TextInputProps & {
  name: string;
  textButtonStyle?: TextStyle;
  buttonProps?: TouchableOpacityProps;
  placeholderTextColor?: ColorValue;
};
const QPasswordInput = (props: QPasswordInputProps) => {
  const {name, textButtonStyle, buttonProps, placeholderTextColor} = props;
  const {t} = i18next;
  const [isHidePassword, setHidePassword] = useState(true);

  return (
    <View style={{width: '100%', height: 80}}>
      <TextInput
        placeholderTextColor={placeholderTextColor || Colors.GRAY_03}
        secureTextEntry={isHidePassword}
        maxLength={59}
        {...props}
        style={{...styleSheet.inputPasswordStyle}}
      />

      <TouchableOpacity
        {...buttonProps}
        style={{position: 'absolute', right: 10, top: 15}}
        onPress={() => setHidePassword(!isHidePassword)}>
        <Image
          source={ICON[isHidePassword ? 'view' : 'hide']}
          style={{height: 15, width: 22}}
        />
      </TouchableOpacity>
      <Text style={styleSheet.errorTextStyle}>
        <ErrorMessage name={name} />
      </Text>
    </View>
  );
};

export default QPasswordInput;
