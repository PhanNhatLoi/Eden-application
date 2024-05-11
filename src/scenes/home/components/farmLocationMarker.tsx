import {Image, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Marker, MarkerAnimated} from 'react-native-maps';
import {ICON} from 'src/assets';

import {LocationFarmType} from '..';

type Props = {
  value: LocationFarmType | undefined;
  setItemFocus: React.Dispatch<
    React.SetStateAction<LocationFarmType | undefined>
  >;
};
const FarmLocationMarker = (props: Props) => {
  const {value, setItemFocus} = props;
  return value ? (
    <MarkerAnimated
      onPress={() => setItemFocus(value)}
      coordinate={value.coordinate}>
      <Image
        source={ICON['farmLocationIcon']}
        style={{height: 43, width: 24}}
      />
    </MarkerAnimated>
  ) : (
    <></>
  );
};

export default FarmLocationMarker;

const styles = StyleSheet.create({});
