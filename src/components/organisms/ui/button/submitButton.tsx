import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ColorValue,
} from 'react-native';
import React, {useState} from 'react';
import {t} from 'i18next';
import {styleSheet} from 'src/styles/styleSheet';
import {Colors} from 'src/styles';
import CustomModal from '../modals/Modal';

type Props = {
  label: string;
  disabled?: boolean;
  onPress: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  loading?: boolean;
  spiner?: {
    size: number;
    color?: ColorValue;
  };
};

const SubmitButton = (props: Props) => {
  return (
    <View>
      <TouchableOpacity
        disabled={props.disabled}
        style={{
          ...styleSheet.buttonPrimaryStyle,
          backgroundColor: props.disabled
            ? Colors.GRAY_MEDIUM
            : Colors.SYS_BUTTON,
        }}
        onPress={props.onPress}>
        <Text style={{...styleSheet.textStyleBasic, color: Colors.WHITE}}>
          {t(props.label)}
        </Text>
      </TouchableOpacity>
      <CustomModal isVisible={props.loading || false}>
        <ActivityIndicator
          size={props.spiner?.size || 80}
          color={props.spiner?.color || '#00ff00'}
        />
      </CustomModal>
    </View>
  );
};

export default SubmitButton;
