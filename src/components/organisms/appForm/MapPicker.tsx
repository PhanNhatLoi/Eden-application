/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';
import Modal from 'react-native-modal';
import Geolocation from '@react-native-community/geolocation';
import {useEffect, useState} from 'react';
import MapView, {PROVIDER_GOOGLE, Region} from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import {ICON} from 'src/assets';
export type location = {
  latitude?: number;
  longitude?: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
};
type MapPickerProps = {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm?: (_: location) => void;
  defaultRegion?: location;
};

const MapPicker = (props: MapPickerProps) => {
  const {isOpen, setOpen, onConfirm, defaultRegion} = props;
  const {t} = useTranslation();
  const initRegion = (): Region => {
    return {
      latitude:
        (defaultRegion?.latitude && Number(defaultRegion?.latitude)) || 0,
      longitude:
        (defaultRegion?.longitude && Number(defaultRegion?.longitude)) || 0,
      latitudeDelta: defaultRegion?.latitudeDelta || 0.04,
      longitudeDelta: defaultRegion?.longitudeDelta || 0.05,
    };
  };

  const [region, setRegion] = useState(initRegion());

  useEffect(() => {
    setRegion(initRegion());
  }, [defaultRegion]);

  const getCurrentPosistion = () => {
    Geolocation.getCurrentPosition(
      async position => {
        setRegion({
          ...region,
          latitude: Number(position.coords.latitude),
          longitude: Number(position.coords.longitude),
        });
      },
      error => {
        console.log('🚀 ~ file: ~ line 74 ~ getLocation ~ error', error);
      },
      {timeout: 15000, maximumAge: 2000, enableHighAccuracy: true},
    );
  };

  useEffect(() => {
    if (!defaultRegion?.latitude && !defaultRegion?.longitude) {
      getCurrentPosistion();
    }
  }, []);

  const handleConfirm = () => {
    onConfirm?.(region);
    setOpen(false);
  };

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={() => setOpen(false)}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationOutTiming={1000}
      animationInTiming={1000}
      style={{...styles.map, ...styles.noPadding, ...styleSheet.center}}
      backdropOpacity={0.5}>
      <MapView
        showsMyLocationButton
        showsUserLocation
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        onRegionChangeComplete={re => setRegion(re)}
      />
      <TouchableOpacity
        style={styles.topAbsolute}
        onPress={() => setOpen(false)}>
        <MaterialIcons name="west" size={25} color={Colors.BLACK} />
      </TouchableOpacity>
      <Image source={ICON.pinBig} style={styles.icon} resizeMode="contain" />
      <View style={styles.bottomView}>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={{...styleSheet.buttonPrimaryText}}>{t('confirm')}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  noPadding: {
    padding: 0,
    margin: 0,
  },
  topAbsolute: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 20 : 60,
    left: 30,
    borderRadius: 100,
    backgroundColor: Colors.WHITE,
    ...styleSheet.shadown,
    padding: 10,
  },
  icon: {
    width: 50,
    height: 50,
  },
  bottomView: {
    height: 130,
    width: Platform.OS === 'ios' ? '85%' : '100%',
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 20,
    left: 0,
  },
  confirmBtn: {
    ...styleSheet.buttonPrimaryStyle,
    ...styleSheet.shadown,
  },
});

export default MapPicker;
