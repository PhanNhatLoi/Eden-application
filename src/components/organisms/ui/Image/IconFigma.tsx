import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ICON} from 'src/assets';

type Props = {
  name: string;
  size?: number;
};
const IconFigma = (props: Props) => {
  //constant
  const {name, size = 20} = props;
  //constant

  return <Image source={ICON[name]} style={{width: size, height: size}} />;
};

export default IconFigma;

const styles = StyleSheet.create({});
