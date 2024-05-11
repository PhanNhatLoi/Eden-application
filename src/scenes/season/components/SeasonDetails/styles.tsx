import {StyleSheet, View} from 'react-native';
import {SCREEN} from 'src/help';
import {Colors} from 'src/styles';
import {margin, padding} from 'src/styles/mixins';
import {styleSheet} from 'src/styles/styleSheet';

export const Hr = () => <View style={styles.hr}></View>;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: SCREEN.height,
    ...padding(13, 20, 0, 20),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  hr: {
    marginVertical: 16,
    borderBottomWidth: 1,
    borderColor: Colors.GRAY_LINE,
  },
  title: {
    ...styleSheet.textStyleBold,
    fontSize: 14,
    lineHeight: 17,
    marginBottom: 8,
  },
  textKey: {
    ...styleSheet.textStyleBasic,
    fontSize: 12,
    color: Colors.GRAY_04,
  },
  textValue: {
    ...styleSheet.textStyleBasic,
    fontSize: 12,
    color: Colors.BLACK,
  },
  iconTitle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  logBox: {
    ...margin(0, 10, 0, 10),
    borderColor: Colors.SYS_BUTTON,
    ...padding(13, 0, 27, 20),
  },
});
