import {ColorValue} from 'react-native';
import {
  StyleProp,
  ViewStyle,
  KeyboardTypeOptions,
  StyleSheet,
} from 'react-native/types';

export type InputProps = {
  name: string;
  autoFocus?: boolean;
  require?: boolean;
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  placeholderTextColor?: ColorValue;
  keyboardType?: KeyboardTypeOptions;
  backgroundColor?: string;
  type?: 'number' | 'phone' | 'email' | 'email_or_phone';
  onFocus?: () => void;
};
