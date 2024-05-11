import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  ColorValue,
  Keyboard,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {SCREEN} from 'src/help';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import FormInfo from './FormInfo';

type StepButtonSingleProps = {
  onPressLeft?: () => void;
  onPressRight?: () => void;
  disableLeft?: boolean;
  disableRight?: boolean;
  subTitile?: string | null;
  buttonStyle?: StyleProp<ViewStyle>;
  textButtonStyle?: StyleProp<TextStyle>;
  title?: string;
  loading?: boolean;
  spinColor?: ColorValue;
};

const StepButtonSingle = (props: StepButtonSingleProps) => {
  const {
    disableRight = false,
    onPressRight = () => {},
    subTitile = '',
    buttonStyle,
    textButtonStyle,
    title = 'next',
    loading = false,
    spinColor = Colors.WHITE,
  } = props;
  const {t} = useTranslation();
  return (
    <>
      {subTitile ? <FormInfo title={subTitile} /> : null}
      <View style={styles.container}>
        <TouchableOpacity
          disabled={loading || disableRight}
          onPress={() => {
            Keyboard.dismiss();
            onPressRight();
          }}
          style={[
            buttonStyle || [
              styles.primaryButton,
              {
                backgroundColor: disableRight
                  ? Colors.GRAY_02
                  : styles.primaryButton.backgroundColor,
              },
            ],
          ]}>
          {loading ? (
            <ActivityIndicator color={spinColor} size={25} />
          ) : (
            <Text style={textButtonStyle || styles.textPrimaryButton}>
              {t(title)}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN.width - 40,
  },
  defaultButton: {
    height: 50,
    width: '48%',
    borderRadius: 50,
    borderColor: Colors.SYS_BUTTON,
    borderWidth: 1,
    backgroundColor: Colors.WHITE,
    ...styleSheet.center,
  },
  primaryButton: {
    height: 50,
    width: SCREEN.width - 40,
    borderRadius: 50,
    borderColor: Colors.SYS_BUTTON,
    borderWidth: 1,
    backgroundColor: Colors.SYS_BUTTON,
    ...styleSheet.center,
  },
  textPrimaryButton: {
    ...styleSheet.textStyleBold,
    color: Colors.WHITE,
  },
  textDefaultButton: {
    ...styleSheet.textStyleBold,
    color: Colors.SYS_BUTTON,
  },
});

export default StepButtonSingle;
