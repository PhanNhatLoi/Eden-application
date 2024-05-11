import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SCREEN} from 'src/help';
import {styleSheet} from 'src/styles/styleSheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors} from 'src/styles';
type FormInfoProps = {
  title: string | null;
};

const FormInfo = (props: FormInfoProps) => {
  const {title} = props;
  return (
    <View style={styles.container}>
      <AntDesign name="exclamationcircleo" color={Colors.GRAY_DARK} size={15} />
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    ...styleSheet.row,
    width: SCREEN.width - 40,
    marginBottom: 25,
    marginTop: 10,
    alignItems: 'flex-start',
  },
  text: {
    ...styleSheet.textStyleSub,
    marginLeft: 10,
  },
});
export default FormInfo;
