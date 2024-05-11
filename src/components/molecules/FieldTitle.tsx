import * as React from 'react';
import {StyleProp, StyleSheet, Text, TextStyle, View} from 'react-native';
import {Colors} from 'src/styles';
import {styleSheet} from 'src/styles/styleSheet';

/* `FieldTitleProps` is a TypeScript interface that defines the props that can be passed to the
`FieldTitle` component. In this case, it defines a single optional prop `isRequired` of type
boolean. This allows the component to conditionally render a red dot next to the field title if
the prop is set to true. */
type FieldTitleProps = {
  isRequired?: boolean;
  title?: string | null;
  style?: StyleProp<TextStyle>;
};

const FieldTitle = (props: FieldTitleProps) => {
  const {isRequired = false, title, style = styleSheet.textStyleBold} = props;
  return (
    <View style={[styleSheet.row]}>
      {isRequired && title && <Text style={styles.dot}>* </Text>}
      {title && <Text style={style}>{title}</Text>}
    </View>
  );
};
const styles = StyleSheet.create({
  dot: {
    color: Colors.RED,
    paddingTop: 1,
  },
});

export default FieldTitle;
