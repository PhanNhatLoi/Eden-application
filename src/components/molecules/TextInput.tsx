import {
  InputAccessoryView,
  Keyboard,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
} from 'react-native';
import React from 'react';
import {Colors} from 'src/styles';

const TextInputCT = (props: TextInputProps) => {
  return (
    <>
      <TextInput
        {...props}
        maxLength={props.maxLength || 255}
        autoCorrect={false}
        spellCheck={false}
        keyboardAppearance="light"
        style={[
          props.style,
          {color: Colors.BLACK, borderColor: Colors.GRAY_02},
        ]}
        placeholderTextColor={Colors.GRAY_03}
      />
    </>
  );
};

export default TextInputCT;

const styles = StyleSheet.create({});
