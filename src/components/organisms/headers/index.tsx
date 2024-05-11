/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {styleSheet} from 'src/styles/styleSheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from 'src/styles';

type HeadersProps = {
  onPressBackBtn: () => {};
  title?: string | null;
};

const MyHeaders = (props: HeadersProps) => {
  const {onPressBackBtn, title} = props;
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <TouchableOpacity onPress={onPressBackBtn}>
        <MaterialIcons name="west" size={30} color={Colors.BLACK} />
      </TouchableOpacity>
      <Text style={styleSheet.linkTextStyle}>{title}</Text>
    </View>
  );
};

export default MyHeaders;
