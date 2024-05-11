import {StyleSheet, View} from 'react-native';
import {Colors} from 'src/styles';
import {margin, padding} from 'src/styles/mixins';
import {styleSheet} from 'src/styles/styleSheet';

export const Hr = () => <View style={styles.hr}></View>;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...padding(13, 20, 0, 20),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  hr: {
    marginVertical: 16,
    // borderBottomWidth: 1,
    height: 1,
    backgroundColor: Colors.GRAY_LINE,
  },
  title: {
    ...styleSheet.textStyleBold,
    lineHeight: 20,
    fontSize: 13,
    marginBottom: 8,
  },
  textKey: {
    ...styleSheet.textStyleBasic,
    color: Colors.GRAY_04,
    fontSize: 12,
  },
  textValue: {
    ...styleSheet.textStyleBold,
    color: Colors.BLACK,
    fontSize: 12,
  },
  iconTitle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  logBox: {
    marginLeft: 10,
    borderColor: Colors.SYS_BUTTON,
    ...padding(13, 0, 27, 20),
  },
});
