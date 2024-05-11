import React from 'react';
import {StyleSheet} from 'react-native';
import {styleSheet} from 'src/styles/styleSheet';

export type userRegisterCurrent = {
  login: string;
  otp: string;
  password: string;
  fullName: string;
  imageUrl?: string;
  referal_person?: string;
  activationKey: string;
};

export type componentRenderType = {
  index: number;
  key: string;
  description: string;
  buttonString: string;
  buttonAction: any;
  component: React.ReactElement;
};

export const styles = StyleSheet.create({
  description: {
    ...styleSheet.textStyleBasic,
    textAlign: 'center',
    marginBottom: 13,
  },
  container: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
  },
  text: {
    ...styleSheet.linkTextStyle,
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    margin: 0,
    padding: 0,
  },
});
