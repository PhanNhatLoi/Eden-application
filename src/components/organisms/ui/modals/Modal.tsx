import {SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import * as Types from './types';

type Props = {
  isVisible: boolean; //state visible
  setIsVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  animationIn?: Types.animationReactNativeModalType;
  animationOut?: Types.animationReactNativeModalType;
  animationTiming?: number; //Timing for the modal show animation (in ms)
  children: React.ReactElement;
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
  onBackdropPressOnclose?: boolean;
  backdropOpacity?: number;
};

const CustomModal = (props: Props) => {
  const {onBackdropPressOnclose = true, backdropOpacity = 0.5} = props;
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: props.justifyContent || 'center',
    },
  });

  return (
    <Modal
      isVisible={props.isVisible}
      onBackdropPress={() =>
        onBackdropPressOnclose &&
        props.setIsVisible &&
        props.setIsVisible(false)
      }
      animationIn={props.animationIn || 'slideInUp'}
      animationOut={props.animationOut || 'slideOutDown'}
      animationOutTiming={props.animationTiming || 1}
      animationInTiming={props.animationTiming || 1}
      style={styles.modalContainer}
      backdropOpacity={backdropOpacity}>
      <SafeAreaView>{props.children}</SafeAreaView>
    </Modal>
  );
};

export default CustomModal;
