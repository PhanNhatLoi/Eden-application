import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Colors} from 'src/styles';
import i18next from 'i18next';
import {useDispatch} from 'react-redux';
import {removeNotify} from 'src/state/reducers/Notification/notify';
import {useSelector} from 'react-redux';
import {RootState} from 'src/state/store';
import {padding} from 'src/styles/mixins';
import {styleSheet} from 'src/styles/styleSheet';
import CustomModal from '../modals/Modal';
import Icon from 'react-native-vector-icons/AntDesign';
import {AppState} from 'react-native';

const CustomAlert = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const notify = useSelector((state: RootState) => state.notify.notification);
  const appState = useRef(AppState.currentState);

  const {t} = i18next;

  useEffect(() => {
    setModalVisible(Boolean(notify));
  }, [notify]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'background'
      ) {
        dispatch(removeNotify());
      }

      appState.current = nextAppState;
      // console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  //handle close
  const handlePressClose = () => {
    notify?.onpress && notify.onpress();
    dispatch(removeNotify());
  };

  return (
    <CustomModal
      onBackdropPressOnclose={false}
      isVisible={modalVisible}
      setIsVisible={setModalVisible}
      justifyContent="center">
      <View style={styles.modal}>
        {notify?.type !== 'ALERT' && (
          <TouchableOpacity
            style={{alignItems: 'flex-end', width: '100%'}}
            onPress={() => handlePressClose()}>
            <Icon name="closecircle" size={20} color={Colors.GRAY_03} />
          </TouchableOpacity>
        )}
        <View style={styles.content}>
          {notify?.body && (
            <Text style={styles.textContent}>{t(notify.body)}</Text>
          )}
        </View>
        <TouchableOpacity
          style={{
            ...styleSheet.buttonPrimaryStyle,
            backgroundColor: Colors.BLACK_02,
          }}
          onPress={() => handlePressClose()}>
          <Text
            style={{
              ...styleSheet.textStyleBasic,
              color: Colors.WHITE,
              fontSize: 14,
            }}>
            {t('close')}
          </Text>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};
const styles = StyleSheet.create({
  modal: {
    backgroundColor: Colors.WHITE,
    ...padding(10, 20, 30, 20),
    borderRadius: 8,
  },
  content: {
    marginVertical: 20,
  },
  textContent: {
    ...styleSheet.textStyleBasic,
    textAlign: 'center',
  },
});

export default CustomAlert;
