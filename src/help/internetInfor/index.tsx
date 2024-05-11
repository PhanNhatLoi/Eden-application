import {AppState, NativeModules, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {SCREEN} from '..';
import {useTranslation} from 'react-i18next';
import {Colors} from 'src/styles';
import {useDispatch, useSelector} from 'react-redux';
import {updateStatusInternet} from 'src/state/reducers/Notification/notify';
import {styleSheet} from 'src/styles/styleSheet';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {RootState} from 'src/state/store';

const InternetInfo = () => {
  //const
  const {t} = useTranslation();
  const dispatch = useDispatch();
  //const

  //state
  const [stateNetInfo, setStateNetInfo] = useState<NetInfoState>();
  const internet = useSelector((state: RootState) => state.notify.internet);
  //state

  //effect
  useEffect(() => {
    const unsubNetState = NetInfo.addEventListener(state => {
      setStateNetInfo(state);
      // if (!state.isConnected) {
      // }
      // if (state.isInternetReachable !== null) {
      //   setStateNetInfo(
      //     (state.isConnected && state.isInternetReachable) || false,
      //   );
      // }
    });
    return () => {
      unsubNetState();
    };
  }, []);

  useEffect(() => {
    if (!stateNetInfo?.isConnected) {
      setTimeout(() => {
        NetInfo.fetch().then(state => {
          const internetState = state.isConnected;
          if (!internetState) dispatch(updateStatusInternet(false));
        });
      }, 3000);
    } else {
      if (!stateNetInfo.isConnected && !stateNetInfo.isInternetReachable) {
        setTimeout(() => {
          NetInfo.fetch().then(state => {
            const internetState =
              (state.isConnected && state.isInternetReachable) || false;
            if (!internetState) dispatch(updateStatusInternet(false));
          });
        }, 7000);
      } else {
        if (stateNetInfo.isConnected && stateNetInfo.isInternetReachable) {
          dispatch(updateStatusInternet(true));
        }
      }
    }
  }, [stateNetInfo]);

  //effect

  //render
  return !internet ? (
    <View style={styles.internetCard}>
      <View style={styles.internetText}>
        <Text style={[styleSheet.textStyleBasic, {marginRight: 5}]}>
          {t('no_connection_internet')}
        </Text>
        <IconMaterialIcons name="wifi-off" size={25} color={Colors.GRAY_03} />
      </View>
    </View>
  ) : (
    <></>
  );
};

export default InternetInfo;

const styles = StyleSheet.create({
  internetCard: {
    position: 'absolute',
    top: 60,
    height: 60,
    width: SCREEN.width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  internetText: {
    width: '70%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.GRAY_01,
    flexDirection: 'row',
  },
});
