import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {SCREEN} from 'src/help';
import {Colors} from 'src/styles';

const Line = (props: {colors: string}) => {
  return (
    <View
      style={[
        styles.line,
        {
          backgroundColor: props.colors || Colors.GRAY_LINE,
        },
      ]}
    />
  );
};
const styles = StyleSheet.create({
  line: {
    width: SCREEN.width - 40,
    height: 1,
    marginBottom: 10,
  },
});

export default Line;
