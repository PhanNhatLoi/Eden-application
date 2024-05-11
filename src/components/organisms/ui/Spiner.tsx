import {View, StyleSheet, ActivityIndicator} from 'react-native';
import React from 'react';
import {Colors} from 'src/styles';
import {SCREEN} from 'src/help';

type Props = {
  loading: boolean;
  color?: string;
  opacity?: number;
  size?: number;
};

const Spiner = (props: Props) => {
  const {opacity = 0.8} = props;
  const styles = StyleSheet.create({
    spiner: {
      flex: 1,
      backgroundColor: Colors.WHITE,
      opacity: opacity,
      height: SCREEN.height + 200,
      position: 'absolute',
      width: '100%',
      zIndex: 999,
    },
  });
  return props.loading ? (
    <View style={styles.spiner}>
      <ActivityIndicator
        style={{marginTop: '100%'}}
        size={props.size || 25}
        color={props.color || Colors.SYS_BUTTON}
      />
    </View>
  ) : (
    <></>
  );
};

export default Spiner;
