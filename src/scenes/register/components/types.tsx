import React from 'react';
import {StyleSheet} from 'react-native';
import {styleSheet} from 'src/styles/styleSheet';

export type userRegisterCurrent = {
  login: string;
  otp: string;
  password: string;
  fullName: string;
  avatar?: string;
  referal_person?: string;
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
    marginBottom: 30,
  },
});
