import React from 'react';
import {StyleSheet} from 'react-native';
import {styleSheet} from 'src/styles/styleSheet';

export type resetPasswordType = {
  resetKey: string;
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
    paddingHorizontal: 20,
    width: '100%',
    flex: 1,
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
