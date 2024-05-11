import {
  ActivityIndicator,
  ColorValue,
  Text,
  TextInputProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import React from 'react';
import {Colors} from 'src/styles';

type SpinButtonProps = {
  title: string;
  isLoading: boolean;
  disabled?: boolean;
  titleProps?: TextInputProps;
  buttonProps?: TouchableOpacityProps;
  colorSpiner?: ColorValue;
  icon?: React.ReactElement;
};
const SpinButton = (props: SpinButtonProps) => {
  const {
    title,
    titleProps,
    buttonProps,
    isLoading,
    disabled,
    icon,
    colorSpiner = Colors.WHITE,
  } = props;
  const style = disabled
    ? [buttonProps?.style, {backgroundColor: Colors.GRAY_LIGHT}]
    : buttonProps?.style;
  return (
    <TouchableOpacity
      {...buttonProps}
      disabled={isLoading || disabled}
      style={style}>
      {isLoading ? (
        <ActivityIndicator size="small" color={colorSpiner} />
      ) : (
        <>
          <Text {...titleProps}>{title}</Text>
          {icon}
        </>
      )}
    </TouchableOpacity>
  );
};

export default SpinButton;
