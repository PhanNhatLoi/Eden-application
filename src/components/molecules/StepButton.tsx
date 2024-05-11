import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SCREEN} from 'src/help';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import FormInfo from './FormInfo';
import SpinButton from '../organisms/buttons/SpinButton';

type StepButtonProps = {
  onPressLeft?: () => void;
  onPressRight?: () => void;
  disableLeft?: boolean;
  disableRight?: boolean;
  subTitile: string | null;
  loading?: boolean;
  rightButtonText?: string;
};

const StepButton = (props: StepButtonProps) => {
  const {
    disableLeft = false,
    disableRight = false,
    onPressLeft = () => {},
    onPressRight = () => {},
    subTitile = '',
    loading = false,
    rightButtonText = 'next',
  } = props;
  const {t} = useTranslation();
  return (
    <>
      {subTitile && <FormInfo title={subTitile} />}
      <View style={styles.container}>
        <TouchableOpacity
          disabled={disableLeft}
          onPress={() => {
            onPressLeft();
            Keyboard.dismiss();
          }}
          style={styles.defaultButton}>
          <Text style={styles.textDefaultButton}>{t('save')}</Text>
        </TouchableOpacity>

        <SpinButton
          disabled={disableRight}
          isLoading={loading}
          title={t(rightButtonText)}
          buttonProps={{
            onPress: () => {
              onPressRight();
              Keyboard.dismiss();
            },
            style: styles.primaryButton,
          }}
          titleProps={{
            style: styles.textPrimaryButton,
          }}
        />
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
    width: '48%',
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

export default StepButton;
